'use client';

import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { ArrowForward, ArrowBack, CheckCircle } from '@mui/icons-material';
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

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 21; hour++) {
    const time = hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
    slots.push(time);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

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
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedData = getFormData();
    if (Object.keys(savedData).length > 0) {
      setFormData({ ...formData, ...savedData });
    }
  }, []);

  useEffect(() => {
    if (formData.fullName || formData.email) {
      saveFormData(formData);
    }
  }, [formData]);

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

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    switch (step) {
      case 0:
        if (!formData.fullName.trim()) { newErrors.fullName = true; isValid = false; }
        if (!formData.phoneNumber.trim() || !/^\d{10}$/.test(formData.phoneNumber)) {
          newErrors.phoneNumber = true; isValid = false;
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = true; isValid = false;
        }
        if (!formData.address.trim()) { newErrors.address = true; isValid = false; }
        if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) {
          newErrors.pincode = true; isValid = false;
        }
        break;
      case 1:
        if (!formData.carType) { newErrors.carType = true; isValid = false; }
        if (!formData.packageType) { newErrors.packageType = true; isValid = false; }
        break;
      case 2:
        if (!formData.bookingDate) { newErrors.bookingDate = true; isValid = false; }
        if (!formData.bookingTime) { newErrors.bookingTime = true; isValid = false; }
        break;
    }

    setErrors(newErrors);
    if (!isValid) {
      toast.error('Please fill all required fields correctly');
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
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
      toast.success('Booking confirmed! We will contact you soon 🚗');
      clearFormData();
      setTimeout(() => {
        setFormData({
          fullName: '', phoneNumber: '', email: '', address: '', landmark: '',
          pincode: '', carType: '', packageType: '', packagePrice: 0,
          bookingDate: '', bookingTime: '',
        });
        setActiveStep(0);
      }, 2000);
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
         <Box>
  {/* Full Name */}
  <Box sx={{ mb: 2.5 }}>
    <Typography sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 500, mb: 1 }}>
      Full Name*
    </Typography>
    <TextField 
      fullWidth 
      placeholder="Enter your full name"
      value={formData.fullName}
      onChange={handleInputChange('fullName')} 
      error={errors.fullName}
      sx={{ 
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          '& input': {
            color: '#000000',
            padding: '12px 14px',
          },
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#004F9E',
          },
        },
      }}
      InputProps={{
        sx: { height: '48px' }
      }}
    />
  </Box>

  {/* Phone Number */}
  <Box sx={{ mb: 2.5 }}>
    <Typography sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 500, mb: 1 }}>
      Phone Number*
    </Typography>
    <TextField 
      fullWidth 
      placeholder="10-digit mobile number"
      value={formData.phoneNumber}
      onChange={handleInputChange('phoneNumber')} 
      error={errors.phoneNumber}
      sx={{ 
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          '& input': {
            color: '#000000',
            padding: '12px 14px',
          },
          '& fieldset': {
            borderColor: errors.phoneNumber ? '#f44336' : 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover fieldset': {
            borderColor: errors.phoneNumber ? '#f44336' : 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: errors.phoneNumber ? '#f44336' : '#004F9E',
          },
        },
      }}
      InputProps={{
        sx: { height: '48px' }
      }}
    />
    {errors.phoneNumber && (
      <Typography sx={{ color: '#f44336', fontSize: '12px', mt: 0.5 }}>
        Enter valid 10-digit phone number
      </Typography>
    )}
  </Box>

  {/* Email Address */}
  <Box sx={{ mb: 2.5 }}>
    <Typography sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 500, mb: 1 }}>
      Email Address*
    </Typography>
    <TextField 
      fullWidth 
      placeholder="your.email@example.com"
      value={formData.email}
      onChange={handleInputChange('email')} 
      error={errors.email}
      sx={{ 
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          '& input': {
            color: '#000000',
            padding: '12px 14px',
          },
          '& fieldset': {
            borderColor: errors.email ? '#f44336' : 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover fieldset': {
            borderColor: errors.email ? '#f44336' : 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: errors.email ? '#f44336' : '#004F9E',
          },
        },
      }}
      InputProps={{
        sx: { height: '48px' }
      }}
    />
    {errors.email && (
      <Typography sx={{ color: '#f44336', fontSize: '12px', mt: 0.5 }}>
        Enter valid email address
      </Typography>
    )}
  </Box>

  {/* Pincode */}
  <Box sx={{ mb: 2.5 }}>
    <Typography sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 500, mb: 1 }}>
      Pincode*
    </Typography>
    <TextField 
      fullWidth 
      placeholder="e.g., 208020"
      value={formData.pincode}
      onChange={handleInputChange('pincode')} 
      error={errors.pincode}
      sx={{ 
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          '& input': {
            color: '#000000',
            padding: '12px 14px',
          },
          '& fieldset': {
            borderColor: errors.pincode ? '#f44336' : 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover fieldset': {
            borderColor: errors.pincode ? '#f44336' : 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: errors.pincode ? '#f44336' : '#004F9E',
          },
        },
      }}
      InputProps={{
        sx: { height: '48px' }
      }}
    />
    {errors.pincode && (
      <Typography sx={{ color: '#f44336', fontSize: '12px', mt: 0.5 }}>
        Enter valid 6-digit pincode
      </Typography>
    )}
  </Box>

  {/* Address */}
  <Box sx={{ mb: 2.5 }}>
    <Typography sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 500, mb: 1 }}>
      Address*
    </Typography>
    <TextField 
      fullWidth 
      placeholder="Enter your complete address"
      value={formData.address}
      onChange={handleInputChange('address')} 
      error={errors.address}
      multiline 
      rows={2}
      sx={{ 
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          '& textarea': {
            color: '#000000',
            padding: '12px 14px',
          },
          '& fieldset': {
            borderColor: errors.address ? '#f44336' : 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover fieldset': {
            borderColor: errors.address ? '#f44336' : 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: errors.address ? '#f44336' : '#004F9E',
          },
        },
      }}
    />
  </Box>

  {/* Landmark */}
  <Box>
    <Typography sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 500, mb: 1 }}>
      Landmark
    </Typography>
    <TextField 
      fullWidth 
      placeholder="Nearby landmark for easy location"
      value={formData.landmark}
      onChange={handleInputChange('landmark')}
      sx={{ 
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          '& input': {
            color: '#000000',
            padding: '12px 14px',
          },
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#004F9E',
          },
        },
      }}
      InputProps={{
        sx: { height: '48px' }
      }}
    />
  </Box>
</Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: '#FFF', fontWeight: 500 }}>
              Select Car Type
            </Typography>
            <TextField fullWidth select label="Car Type *" value={formData.carType}
              onChange={handleInputChange('carType')} error={errors.carType} 
               sx={{ 
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          '& textarea': {
            color: '#000000',
            padding: '12px 14px',
          },
          '& fieldset': {
            borderColor: errors.address ? '#f44336' : 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover fieldset': {
            borderColor: errors.address ? '#f44336' : 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: errors.address ? '#f44336' : '#004F9E',
          },
        },
      }}>
              {carTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
            <Typography variant="h6" sx={{ mt: 3, mb: 2, color: '#FFF', fontWeight: 500 }}>
              Choose Package
            </Typography>
            {packages.map((pkg) => (
              <Card key={pkg.name} onClick={() => handlePackageSelect(pkg.name, pkg.price)}
                sx={{
                  ...formStyles.packageCard,
                  ...(formData.packageType === pkg.name && {
                    background: 'rgba(0, 79, 158, 0.15)',
                    borderColor: '#004F9E',
                  }),
                }}>
                <CardContent sx={{ padding: '16px !important' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#FFF' }}>
                        {pkg.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {pkg.description}
                      </Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#004F9E' }}>
                      ₹{pkg.price}
                    </Typography>
                  </Box>
                  {formData.packageType === pkg.name && (
                    <CheckCircle sx={{ position: 'absolute', top: 16, right: 16, color: '#004F9E' }} />
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
        );
      case 2:
        return (
          <Box>
            <TextField fullWidth label="Booking Date *" type="date" value={formData.bookingDate}
              onChange={handleInputChange('bookingDate')} error={errors.bookingDate}
              InputLabelProps={{ shrink: true }} 
              inputProps={{ min: new Date().toISOString().split('T')[0] }}
               sx={{ 
                marginBottom: 2.3,
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          '& textarea': {
            color: '#000000',
            padding: '12px 14px',
          },
          '& fieldset': {
            borderColor: errors.address ? '#f44336' : 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover fieldset': {
            borderColor: errors.address ? '#f44336' : 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: errors.address ? '#f44336' : '#004F9E',
          },
        },
      }} />
            <TextField fullWidth select label="Preferred Time Slot *" value={formData.bookingTime}
              onChange={handleInputChange('bookingTime')} error={errors.bookingTime}
              helperText="Available slots: 9 AM to 9 PM"
               sx={{ 
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          '& textarea': {
            color: '#000000',
            padding: '12px 14px',
          },
          '& fieldset': {
            borderColor: errors.address ? '#f44336' : 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover fieldset': {
            borderColor: errors.address ? '#f44336' : 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: errors.address ? '#f44336' : '#004F9E',
          },
        },
      }}>
              {timeSlots.map((time) => (
                <MenuItem key={time} value={time}>{time}</MenuItem>
              ))}
            </TextField>
            <Box sx={{ mt: 3, p: 2, background: 'rgba(0, 79, 158, 0.1)', borderRadius: '8px', border: '1px solid rgba(0, 79, 158, 0.3)' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#FFF', fontWeight: 600 }}>
                Booking Summary
              </Typography>
              
              {/* Using Flexbox for summary */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', width: '40%' }}>
                    Name:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#FFF', width: '60%', textAlign: 'right', fontWeight: 500 }}>
                    {formData.fullName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', width: '40%' }}>
                    Car Type:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#FFF', width: '60%', textAlign: 'right', fontWeight: 500 }}>
                    {formData.carType}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', width: '40%' }}>
                    Package:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#FFF', width: '60%', textAlign: 'right', fontWeight: 500 }}>
                    {formData.packageType} - ₹{formData.packagePrice}
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
    <Box sx={formStyles.formCard}>
      <Stepper activeStep={activeStep} sx={formStyles.stepperContainer}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>
      <Typography variant="h2" sx={formStyles.formTitle}>{steps[activeStep]}</Typography>
      {renderStepContent()}
      <Box display="flex" justifyContent="space-between">
        {activeStep > 0 && (
          <Button onClick={handleBack} startIcon={<ArrowBack />} sx={formStyles.backButton}>
            Back
          </Button>
        )}
        <Button onClick={handleNext} endIcon={activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowForward />}
          disabled={isSubmitting}
          sx={{ ...formStyles.nextButton, marginLeft: activeStep === 0 ? 'auto' : 0 }}>
          {activeStep === steps.length - 1 ? (isSubmitting ? 'Submitting...' : 'Confirm Booking') : 'Next'}
        </Button>
      </Box>
    </Box>
  );
}