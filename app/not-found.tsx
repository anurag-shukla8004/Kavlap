'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { ErrorOutline } from '@mui/icons-material';
import { formStyles } from '@/styles/theme';

export default function NotFound() {
  return (
    <Box sx={formStyles.pageContainer}>
      <Box sx={formStyles.backgroundOverlay} />
      <Box sx={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '32px',
        textAlign: 'center',
      }}>
        <Link href="/book">
          <Image src="/KAVLAP.png" alt="KAVLAP" width={200} height={80}
            style={{ marginBottom: '32px', cursor: 'pointer' }} priority />
        </Link>
        <ErrorOutline sx={{ fontSize: 80, color: '#004F9E', mb: 2 }} />
        <Typography sx={{
          fontFamily: '"Orbitron", "Montserrat", sans-serif',
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#FFFFFF',
          marginTop: '24px',
        }}>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '16px', maxWidth: '600px' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Link href="/book" style={{ textDecoration: 'none', marginTop: '32px' }}>
          <Typography sx={{
            color: '#004F9E',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}>
            ← Go to Booking Page
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}