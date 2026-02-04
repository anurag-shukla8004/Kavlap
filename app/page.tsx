'use client';

import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import Header from '@/components/Header';
import InstagramIcon from '@mui/icons-material/Instagram';
import { formStyles } from '@/styles/theme';

export default function Home() {
  return (
    <Box sx={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/kavlap-homepage-car.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />
      
      {/* Dark Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        }}
      />

      {/* Header */}
      <Box sx={{ position: 'relative', zIndex: 10 }}>
        <Header />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          minHeight: {'xs': 'calc(100vh - 272px)', 'md': 'calc(100vh - 144px)'},
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          padding: { xs: '40px 20px', md: '80px 60px', lg: '100px 120px' },
        }}
      >
        {/* Hero Text and Buttons */}
        <Box
          sx={{
            maxWidth: { xs: '100%', md: '600px' },
            textAlign: { xs: 'center', md: 'left' },
            marginBottom: { xs: '60px', md: '80px' },
          }}
        >
          {/* Headline */}
          <Typography
            sx={{
              fontFamily: '"Orbitron", "Montserrat", sans-serif',
              fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.1,
              marginBottom: '24px',
            }}
          >
            CAR WASH{' '}
            <Box component="span" sx={{ color: formStyles.lightBlueColor }}>
              DELIVERY
            </Box>
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              color: '#FFFFFF',
              lineHeight: 1.6,
              opacity: 0.95,
            }}
          >
            The car wash service that comes to you. Book your easy and convenient car wash today!
          </Typography>

          {/* Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: '16px',
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            <Link href="/book" style={{ textDecoration: 'none' }}>
              <Button
                 sx={{ ...formStyles.BtnBgColor, ...formStyles.backButton, ...formStyles.bold700 }}>
                Book a Wash
              </Button>
            </Link>
            {/* <Button
              sx={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                border: '2px solid #FFFFFF',
                padding: '14px 32px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: '#FFFFFF',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
                minWidth: { xs: '100%', sm: '180px' },
              }}
            >
              View Services
            </Button> */}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: { xs: '20px', md: '30px 60px' },
        }}
      >
        {/* Phone Number */}
        <Typography
          sx={{
            color: '#FFFFFF',
            fontSize: { xs: '0.9rem', md: '1rem' },
            fontWeight: 500,
          }}
        >
          +91 7388569673
        </Typography>

        {/* Scroll Indicator */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <Box
            sx={{
              width: '24px',
              height: '24px',
              border: '2px solid #FFFFFF',
              borderTop: 'none',
              borderLeft: 'none',
              transform: 'rotate(45deg)',
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 100%': {
                  transform: 'rotate(45deg) translateY(0)',
                },
                '50%': {
                  transform: 'rotate(45deg) translateY(-10px)',
                },
              },
            }}
          />
        </Box>

        {/* Instagram Icon */}
        <Link
          href="https://www.instagram.com/_kavlap_?utm_source=qr&igsh=NGd3aG13bDRlZmVn"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: '#FFFFFF' }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <InstagramIcon sx={{ fontSize: '24px' }} />
          </Box>
        </Link>
      </Box>
    </Box>
  );
}
