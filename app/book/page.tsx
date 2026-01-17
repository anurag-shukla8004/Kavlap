'use client';

import { Box } from '@mui/material';
import Header from '@/components/Header';
import BookingForm from '@/components/BookingForm';
import { formStyles } from '@/styles/theme';

export default function BookPage() {
  return (
    <Box sx={formStyles.pageContainer}>
      <Box sx={formStyles.backgroundOverlay} />
      <Header />
      <Box sx={formStyles.contentContainer}>
        <BookingForm />
      </Box>
    </Box>
  );
}