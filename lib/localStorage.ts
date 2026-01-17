const STORAGE_KEY = 'kavlap_booking_data';

export interface FormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  landmark: string;
  pincode: string;
  carType: string;
  packageType: string;
  packagePrice: number;
  bookingDate: string;
  bookingTime: string;
}

export const saveFormData = (data: Partial<FormData>) => {
  if (typeof window !== 'undefined') {
    try {
      const existingData = getFormData();
      const updatedData = { ...existingData, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      console.log('💾 Data saved to localStorage');
    } catch (error) {
      console.error('Error saving:', error);
    }
  }
};

export const getFormData = (): Partial<FormData> => {
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        console.log('📂 Data loaded from localStorage');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading:', error);
    }
  }
  return {};
};

export const clearFormData = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ Data cleared');
    } catch (error) {
      console.error('Error clearing:', error);
    }
  }
};

export const hasFormData = (): boolean => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEY);
    return data !== null && data !== '{}';
  }
  return false;
};