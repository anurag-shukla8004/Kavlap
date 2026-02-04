'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Card,
  CardContent,
  Select,
  FormControl,
} from '@mui/material';
import { ArrowForward, ArrowBack, CheckCircle, AccessTime } from '@mui/icons-material';
import { formStyles } from '@/styles/theme';
import { saveFormData, getFormData, clearFormData, FormData } from '@/lib/localStorage';
import { createBooking, BookingData } from '@/lib/supabase';
import toast from 'react-hot-toast';

const steps = ['User Details', 'Vehicle Details', 'Date & Time'];
const carTypes = ['Hatchback', 'Sedan', 'SUV'];
const packages = [
  { name: 'Quick Shine', price: 149, description: 'Basic wash and exterior shine' },
  { name: 'Care Kit', price: 249, description: 'Complete interior & exterior cleaning' },
  { name: 'Premium', price: 349, description: 'Premium detailing with wax coating' },
];

const hours = Array.from({ length: 13 }, (_, i) => i + 9); // 9 AM to 9 PM
const minutes = [0, 15, 30, 45];

export default function BookingForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    landmark: '',
    pincode: '',
    carType: '',
    packageType: '',
    packagePrice: 0,
    bookingDate: '',
    bookingTime: '',
  });
  const [selectedHour, setSelectedHour] = useState<number | ''>('');
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for focusing on error fields
  const fullNameRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const pincodeRef = useRef<HTMLInputElement>(null);
  const carTypeRef = useRef<HTMLDivElement>(null);
  const packageRef = useRef<HTMLDivElement>(null);
  const bookingDateRef = useRef<HTMLInputElement>(null);
  const bookingTimeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedData = getFormData();
    if (Object.keys(savedData).length > 0) {
      setFormData((prev) => ({ ...prev, ...savedData }));
      // Parse saved time if exists
      if (savedData.bookingTime) {
        const timeMatch = savedData.bookingTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (timeMatch) {
          let hour = parseInt(timeMatch[1]);
          const period = timeMatch[3].toUpperCase();
          if (period === 'PM' && hour !== 12) hour += 12;
          if (period === 'AM' && hour === 12) hour = 0;
          setSelectedHour(hour);
          setSelectedMinute(parseInt(timeMatch[2]));
        }
      }
    }
  }, []);

  useEffect(() => {
    if (formData.fullName || formData.email) {
      saveFormData(formData);
    }
  }, [formData]);

  useEffect(() => {
    if (selectedHour !== '' && selectedMinute !== null) {
      const hour12 = selectedHour > 12 ? selectedHour - 12 : (selectedHour === 0 ? 12 : selectedHour);
      const period = selectedHour >= 12 ? 'PM' : 'AM';
      const timeString = `${hour12}:${selectedMinute.toString().padStart(2, '0')} ${period}`;
      setFormData((prev) => ({ ...prev, bookingTime: timeString }));
    }
  }, [selectedHour, selectedMinute]);

  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: false });
    }
  };

  const handlePackageSelect = (packageName: string, price: number) => {
    setFormData({ ...formData, packageType: packageName, packagePrice: price });
    if (errors.packageType) {
      setErrors({ ...errors, packageType: false });
    }
  };

  const validateStep = (step: number): { isValid: boolean; firstErrorField: string | null } => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;
    let firstErrorField: string | null = null;
    const fieldLabels: Record<string, string> = {
      fullName: 'Full Name',
      phoneNumber: 'Phone Number',
      email: 'Email Address',
      address: 'Address',
      pincode: 'Pincode',
      carType: 'Car Type',
      packageType: 'Package',
      bookingDate: 'Booking Date',
      bookingTime: 'Preferred Time',
    };

    switch (step) {
      case 0:
        if (!formData.fullName.trim()) { 
          newErrors.fullName = true; 
          isValid = false;
          if (!firstErrorField) firstErrorField = 'fullName';
        }
        if (!formData.phoneNumber.trim() || !/^\d{10}$/.test(formData.phoneNumber)) {
          newErrors.phoneNumber = true; 
          isValid = false;
          if (!firstErrorField) firstErrorField = 'phoneNumber';
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = true; 
          isValid = false;
          if (!firstErrorField) firstErrorField = 'email';
        }
        if (!formData.address.trim()) { 
          newErrors.address = true; 
          isValid = false;
          if (!firstErrorField) firstErrorField = 'address';
        }
        if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) {
          newErrors.pincode = true; 
          isValid = false;
          if (!firstErrorField) firstErrorField = 'pincode';
        }
        break;
      case 1:
        if (!formData.carType) { 
          newErrors.carType = true; 
          isValid = false;
          if (!firstErrorField) firstErrorField = 'carType';
        }
        if (!formData.packageType) { 
          newErrors.packageType = true; 
          isValid = false;
          if (!firstErrorField) firstErrorField = 'packageType';
        }
        break;
      case 2:
        if (!formData.bookingDate) { 
          newErrors.bookingDate = true; 
          isValid = false;
          if (!firstErrorField) firstErrorField = 'bookingDate';
        }
        if (!formData.bookingTime || selectedHour === '') { 
          newErrors.bookingTime = true; 
          isValid = false;
          if (!firstErrorField) firstErrorField = 'bookingTime';
        }
        break;
    }

    setErrors(newErrors);
    if (!isValid) {
      const errorFields = Object.keys(newErrors).map(key => fieldLabels[key] || key).join(', ');
      toast.error(`Please fill the required fields: ${errorFields}`, {
        duration: 4000,
      });
      
      // Focus and scroll to first error field
      setTimeout(() => {
        switch (firstErrorField) {
          case 'fullName':
            fullNameRef.current?.focus();
            fullNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
          case 'phoneNumber':
            phoneNumberRef.current?.focus();
            phoneNumberRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
          case 'email':
            emailRef.current?.focus();
            emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
          case 'address':
            addressRef.current?.focus();
            addressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
          case 'pincode':
            pincodeRef.current?.focus();
            pincodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
          case 'carType':
            carTypeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              const selectElement = carTypeRef.current?.querySelector('[role="combobox"]') as HTMLElement;
              selectElement?.click();
            }, 300);
            break;
          case 'packageType':
            packageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
          case 'bookingDate':
            bookingDateRef.current?.focus();
            bookingDateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
          case 'bookingTime':
            bookingTimeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
        }
      }, 100);
    }
    
    return { isValid, firstErrorField };
  };

  const handleNext = () => {
    const validation = validateStep(activeStep);
    if (validation.isValid) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const bookingData: BookingData = {
      full_name: formData.fullName,
      phone_number: formData.phoneNumber,
      email: formData.email,
      address: formData.address,
      landmark: formData.landmark || '',
      pincode: formData.pincode,
      car_type: formData.carType,
      package_type: formData.packageType,
      package_price: formData.packagePrice,
      booking_date: formData.bookingDate,
      booking_time: formData.bookingTime,
    };

    try {
      await createBooking(bookingData);
      toast.success('🎉 Booking confirmed! We will contact you soon.', {
        duration: 5000,
        icon: '🚗',
      });
      clearFormData();
      setTimeout(() => {
        setFormData({
          fullName: '', phoneNumber: '', email: '', address: '', landmark: '',
          pincode: '', carType: '', packageType: '', packagePrice: 0,
          bookingDate: '', bookingTime: '',
        });
        setSelectedHour('');
        setSelectedMinute(0);
        setActiveStep(0);
      }, 2000);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('❌ Booking failed. Please try again or contact support.', {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonTextFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      '& input': {
        color: '#000000',
        padding: { xs: '10px 12px', md: '12px 14px' },
        fontSize: { xs: '14px', md: '16px' },
      },
      '& textarea': {
        color: '#000000',
        padding: { xs: '10px 12px', md: '12px 14px' },
        fontSize: { xs: '14px', md: '16px' },
      },
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: '#004F9E',
        borderWidth: '2px',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#004F9E',
        borderWidth: '2px',
      },
      '&.Mui-error fieldset': {
        borderColor: '#f44336',
        borderWidth: '2px',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#666666',
      '&.Mui-focused': {
        color: '#004F9E',
      },
      '&.Mui-error': {
        color: '#f44336',
      },
    },
    '& .MuiInputBase-input::placeholder': {
      color: '#999999',
      opacity: 1,
    },
    '& .MuiSelect-select': {
      color: '#000000',
      padding: { xs: '10px 12px', md: '12px 14px' },
      fontSize: { xs: '14px', md: '16px' },
    },
    '& .MuiSelect-icon': {
      color: '#000000',
    },
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Box sx={{ mb: { xs: 1.5, md: 2.5 } }}>
              <Typography sx={{ color: '#FFFFFF', fontSize: { xs: '13px', md: '14px' }, fontWeight: 500, mb: 1 }}>
                Full Name*
              </Typography>
              <TextField 
                inputRef={fullNameRef}
                fullWidth 
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange('fullName')} 
                error={errors.fullName}
                sx={commonTextFieldStyles}
                InputProps={{
                  sx: { height: { xs: '44px', md: '48px' } }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1.5, md: 2.5 }, mb: { xs: 1.5, md: 2.5 } }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#FFFFFF', fontSize: { xs: '13px', md: '14px' }, fontWeight: 500, mb: 1 }}>
                  Phone Number*
                </Typography>
                <TextField 
                  inputRef={phoneNumberRef}
                  fullWidth 
                  placeholder="10-digit mobile number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange('phoneNumber')} 
                  error={errors.phoneNumber}
                  sx={commonTextFieldStyles}
                  InputProps={{
                    sx: { height: { xs: '44px', md: '48px' } }
                  }}
                />
                {errors.phoneNumber && (
                  <Typography sx={{ color: '#f44336', fontSize: '12px', mt: 0.5 }}>
                    Enter valid 10-digit phone number
                  </Typography>
                )}
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#FFFFFF', fontSize: { xs: '13px', md: '14px' }, fontWeight: 500, mb: 1 }}>
                  Email Address*
                </Typography>
                <TextField 
                  inputRef={emailRef}
                  fullWidth 
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange('email')} 
                  error={errors.email}
                  sx={commonTextFieldStyles}
                  InputProps={{
                    sx: { height: { xs: '44px', md: '48px' } }
                  }}
                />
                {errors.email && (
                  <Typography sx={{ color: '#f44336', fontSize: '12px', mt: 0.5 }}>
                    Enter valid email address
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ mb: { xs: 1.5, md: '2.5' } }}>
              <Typography sx={{ color: '#FFFFFF', fontSize: { xs: '13px', md: '14px' }, fontWeight: 500, mb: 1 }}>
                Pincode*
              </Typography>
              <TextField 
                inputRef={pincodeRef}
                fullWidth 
                placeholder="e.g., 208020"
                value={formData.pincode}
                onChange={handleInputChange('pincode')} 
                error={errors.pincode}
                sx={commonTextFieldStyles}
                InputProps={{
                  sx: { height: { xs: '44px', md: '48px' } }
                }}
              />
              {errors.pincode && (
                <Typography sx={{ color: '#f44336', fontSize: '12px', mt: 0.5 }}>
                  Enter valid 6-digit pincode
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: { xs: 1.5, md: 2.5 } }}>
              <Typography sx={{ color: '#FFFFFF', fontSize: { xs: '13px', md: '14px' }, fontWeight: 500, mb: 1 }}>
                Address*
              </Typography>
              <TextField 
                inputRef={addressRef}
                fullWidth 
                placeholder="Enter your complete address"
                value={formData.address}
                onChange={handleInputChange('address')} 
                error={errors.address}
                multiline 
                rows={2}
                sx={commonTextFieldStyles}
              />
            </Box>

            <Box>
              <Typography sx={{ color: '#FFFFFF', fontSize: { xs: '13px', md: '14px' }, fontWeight: 500, mb: 1 }}>
                Landmark
              </Typography>
              <TextField 
                fullWidth 
                placeholder="Nearby landmark for easy location"
                value={formData.landmark}
                onChange={handleInputChange('landmark')}
                sx={commonTextFieldStyles}
                InputProps={{
                  sx: { height: { xs: '44px', md: '48px' } }
                }}
              />
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Box sx={{ mb: { xs: 2, md: 3 } }} ref={carTypeRef}>
              <Typography sx={{ color: '#FFFFFF', fontSize: { xs: '15px', md: '18px' }, fontWeight: 600, mb: 1.5 }}>
                Select Car Type*
              </Typography>
              <FormControl fullWidth error={errors.carType}>
                <Select
                  value={formData.carType}
                  onChange={(e) => {
                    setFormData({ ...formData, carType: e.target.value });
                    if (errors.carType) {
                      setErrors({ ...errors, carType: false });
                    }
                  }}
                  displayEmpty
                  sx={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    height: { xs: '44px', md: '48px' },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: errors.carType ? '#f44336' : 'rgba(0, 0, 0, 0.23)',
                      borderWidth: '1px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: errors.carType ? '#f44336' : '#004F9E',
                      borderWidth: '2px',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: errors.carType ? '#f44336' : '#004F9E',
                      borderWidth: '2px',
                    },
                    '& .MuiSelect-select': {
                      color: formData.carType ? '#000000' : '#999999',
                      padding: { xs: '10px 12px', md: '12px 14px' },
                      fontSize: { xs: '14px', md: '16px' },
                      display: 'flex',
                      alignItems: 'center',
                    },
                    '& .MuiSelect-icon': {
                      color: '#000000',
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: '#FFFFFF',
                        '& .MuiMenuItem-root': {
                          color: '#000000',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 79, 158, 0.1)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(0, 79, 158, 0.2)',
                            color: '#000000',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 79, 158, 0.3)',
                            },
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    <em style={{ color: '#999999' }}>Select car type</em>
                  </MenuItem>
                  {carTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.carType && (
                <Typography sx={{ color: '#f44336', fontSize: '12px', mt: 0.5 }}>
                  Please select a car type
                </Typography>
              )}
            </Box>

            <Box ref={packageRef}>
              <Typography sx={{ color: '#FFFFFF', fontSize: { xs: '15px', md: '18px' }, fontWeight: 600, mb: 1.5 }}>
                Choose Package*
              </Typography>
              {packages.map((pkg) => (
                <Card 
                  key={pkg.name} 
                  onClick={() => handlePackageSelect(pkg.name, pkg.price)}
                  sx={{
                    ...formStyles.packageCard,
                    mb: 1.5,
                    ...(formData.packageType === pkg.name && {
                      background: 'rgba(0, 79, 158, 0.2)',
                      borderColor: '#004F9E',
                      borderWidth: '2px',
                    }),
                    ...(errors.packageType && formData.packageType !== pkg.name && {
                      borderColor: 'rgba(244, 67, 54, 0.5)',
                    }),
                  }}
                >
                  <CardContent sx={{ padding: { xs: '12px !important', md: '16px !important' } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                      <Box sx={{ flex: 1, minWidth: '200px' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#FFF', fontSize: { xs: '16px', md: '18px' } }}>
                          {pkg.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: { xs: '13px', md: '14px' } }}>
                          {pkg.description}
                        </Typography>
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#004F9E', fontSize: { xs: '20px', md: '24px' } }}>
                        ₹{pkg.price}
                      </Typography>
                    </Box>
                    {formData.packageType === pkg.name && (
                      <CheckCircle sx={{ position: 'absolute', top: 12, right: 12, color: '#004F9E', fontSize: { xs: '20px', md: '24px' } }} />
                    )}
                  </CardContent>
                </Card>
              ))}
              {errors.packageType && (
                <Typography variant="caption" sx={{ color: '#f44336', mt: 1, display: 'block' }}>
                  Please select a package
                </Typography>
              )}
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
              <Typography sx={{ color: '#FFFFFF', fontSize: { xs: '13px', md: '14px' }, fontWeight: 500, mb: 1 }}>
                Booking Date*
              </Typography>
              <TextField 
                inputRef={bookingDateRef}
                fullWidth 
                type="date" 
                value={formData.bookingDate}
                onChange={handleInputChange('bookingDate')} 
                error={errors.bookingDate}
                InputLabelProps={{ shrink: true }} 
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                sx={{
                  ...commonTextFieldStyles,
                  '& input[type="date"]': {
                    color: formData.bookingDate ? '#000000' : '#999999',
                  },
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    filter: 'invert(0.5)',
                    cursor: 'pointer',
                  },
                }}
                InputProps={{
                  sx: { height: { xs: '44px', md: '48px' } }
                }}
              />
              {errors.bookingDate && (
                <Typography sx={{ color: '#f44336', fontSize: '12px', mt: 0.5 }}>
                  Please select a booking date
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: { xs: 2.5, md: 3 } }} ref={bookingTimeRef}>
              <Typography sx={{ color: '#FFFFFF', fontSize: { xs: '13px', md: '14px' }, fontWeight: 500, mb: 1.5 }}>
                Preferred Time*
              </Typography>
              <Box sx={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '8px', 
                padding: { xs: '12px', md: '16px' },
                border: errors.bookingTime ? '2px solid #f44336' : '1px solid rgba(0, 0, 0, 0.23)',
                '&:hover': {
                  borderColor: errors.bookingTime ? '#f44336' : '#004F9E',
                  borderWidth: '2px',
                },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 }, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: '120px' }}>
                    <AccessTime sx={{ color: '#004F9E', fontSize: { xs: '20px', md: '24px' } }} />
                    <FormControl sx={{ minWidth: { xs: '80px', md: '100px' } }}>
                      <Select
                        value={selectedHour}
                        onChange={(e) => {
                          setSelectedHour(e.target.value as number);
                          if (errors.bookingTime) {
                            setErrors({ ...errors, bookingTime: false });
                          }
                        }}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: selectedHour !== '' ? '#000000' : '#999999',
                            padding: { xs: '8px 12px', md: '10px 14px' },
                            fontSize: { xs: '14px', md: '16px' },
                          },
                          '& .MuiSelect-icon': {
                            color: '#000000',
                          },
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.23)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#004F9E',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#004F9E',
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          <em style={{ color: '#999999' }}>Hour</em>
                        </MenuItem>
                        {hours.map((hour) => {
                          const hour12 = hour > 12 ? hour - 12 : (hour === 12 ? 12 : hour);
                          const period = hour >= 12 ? 'PM' : 'AM';
                          return (
                            <MenuItem key={hour} value={hour} sx={{ color: '#000000' }}>
                              {hour12} {period}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <Typography sx={{ color: '#000000', fontSize: { xs: '18px', md: '20px' }, fontWeight: 600 }}>:</Typography>
                    <FormControl sx={{ minWidth: { xs: '80px', md: '100px' } }}>
                      <Select
                        value={selectedMinute}
                        onChange={(e) => {
                          setSelectedMinute(e.target.value as number);
                          if (errors.bookingTime) {
                            setErrors({ ...errors, bookingTime: false });
                          }
                        }}
                        sx={{
                          '& .MuiSelect-select': {
                            color: '#000000',
                            padding: { xs: '8px 12px', md: '10px 14px' },
                            fontSize: { xs: '14px', md: '16px' },
                          },
                          '& .MuiSelect-icon': {
                            color: '#000000',
                          },
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.23)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#004F9E',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#004F9E',
                          },
                        }}
                      >
                        {minutes.map((min) => (
                          <MenuItem key={min} value={min} sx={{ color: '#000000' }}>
                            {min.toString().padStart(2, '0')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  {formData.bookingTime && (
                    <Typography sx={{ 
                      color: '#004F9E', 
                      fontSize: { xs: '14px', md: '16px' }, 
                      fontWeight: 600,
                      backgroundColor: 'rgba(0, 79, 158, 0.1)',
                      padding: { xs: '6px 12px', md: '8px 16px' },
                      borderRadius: '6px',
                    }}>
                      {formData.bookingTime}
                    </Typography>
                  )}
                </Box>
              </Box>
              {errors.bookingTime && (
                <Typography sx={{ color: '#f44336', fontSize: '12px', mt: 0.5 }}>
                  Please select a time slot
                </Typography>
              )}
            </Box>

            <Box sx={{ 
              mt: { xs: 2, md: 3 }, 
              p: { xs: 1.5, md: 2 }, 
              background: 'rgba(0, 79, 158, 0.1)', 
              borderRadius: '8px', 
              border: '1px solid rgba(0, 79, 158, 0.3)' 
            }}>
              <Typography variant="h6" sx={{ mb: 1.5, color: '#FFF', fontWeight: 600, fontSize: { xs: '16px', md: '18px' } }}>
                Booking Summary
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: { xs: '13px', md: '14px' } }}>
                    Name:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 500, fontSize: { xs: '13px', md: '14px' } }}>
                    {formData.fullName || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: { xs: '13px', md: '14px' } }}>
                    Car Type:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 500, fontSize: { xs: '13px', md: '14px' } }}>
                    {formData.carType || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: { xs: '13px', md: '14px' } }}>
                    Package:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 500, fontSize: { xs: '13px', md: '14px' } }}>
                    {formData.packageType ? `${formData.packageType} - ₹${formData.packagePrice}` : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{
      ...formStyles.formCard,
      padding: { xs: '20px 16px', sm: '30px 24px', md: '40px' },
      maxWidth: { xs: '100%', sm: '600px' },
      margin: { xs: '0 auto', sm: '0' },
    }}>
      <Stepper 
        activeStep={activeStep} 
        sx={{
          ...formStyles.stepperContainer,
          '& .MuiStepLabel-root': {
            '& .MuiStepLabel-label': {
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: { xs: '11px', sm: '12px', md: '14px' },
              fontWeight: 500,
              '&.Mui-active': {
                color: '#FFFFFF',
                fontWeight: 600,
              },
              '&.Mui-completed': {
                color: '#4CAF50',
              },
            },
            '& .MuiStepIcon-root': {
              color: 'rgba(255, 255, 255, 0.3)',
              fontSize: { xs: '20px', md: '24px' },
              '&.Mui-active': {
                color: '#004F9E',
              },
              '&.Mui-completed': {
                color: '#4CAF50',
              },
              '& .MuiStepIcon-text': {
                fill: '#FFFFFF',
                fontSize: { xs: '11px', md: '12px' },
                fontWeight: 600,
              },
            },
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Typography 
        variant="h2" 
        sx={{
          ...formStyles.formTitle,
          fontSize: { xs: '20px', sm: '22px', md: '28px' },
          marginBottom: { xs: '20px', md: '32px' },
        }}
      >
        {steps[activeStep]}
      </Typography>
      <Box sx={{ 
        maxHeight: { xs: 'calc(100vh - 400px)', sm: 'none' },
        overflowY: { xs: 'auto', sm: 'visible' },
        paddingRight: { xs: '4px', sm: '0' },
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0, 79, 158, 0.5)',
          borderRadius: '3px',
          '&:hover': {
            background: 'rgba(0, 79, 158, 0.7)',
          },
        },
      }}>
        {renderStepContent()}
      </Box>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        sx={{ 
          marginTop: { xs: '20px', md: '24px' },
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          gap: { xs: 1.5, sm: 0 },
        }}
      >
        {activeStep > 0 && (
          <Button 
            onClick={handleBack} 
            startIcon={<ArrowBack />} 
            sx={{
              ...formStyles.backButton,
              width: { xs: '100%', sm: 'auto' },
              padding: { xs: '10px 24px', md: '12px 32px' },
            }}
          >
            Back
          </Button>
        )}
        <Button 
          onClick={handleNext} 
          endIcon={activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowForward />}
          disabled={isSubmitting}
          sx={{ 
            ...formStyles.nextButton, 
            marginLeft: { xs: 0, sm: activeStep === 0 ? 'auto' : 0 },
            width: { xs: '100%', sm: 'auto' },
            padding: { xs: '10px 24px', md: '12px 32px' },
          }}
        >
          {activeStep === steps.length - 1 ? (isSubmitting ? 'Submitting...' : 'Confirm Booking') : 'Next'}
        </Button>
      </Box>
    </Box>
  );
}
