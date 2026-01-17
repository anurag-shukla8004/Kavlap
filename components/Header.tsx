'use client';

import React from 'react';
import { Box, Button, AppBar, Toolbar } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { formStyles } from '@/styles/theme';

export default function Header() {
  return (
    <AppBar position="sticky" elevation={0} sx={formStyles.header}>
      <Toolbar sx={{ justifyContent: 'space-between', padding: '0 !important' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Image
            src="/KAVLAP.png"
            alt="KAVLAP"
            width={120}
            height={40}
            style={{ height: '40px', width: 'auto' }}
            priority
          />
        </Link>

        <Box display="flex" gap={2}>
          <Link href="/">
            <Button sx={{ color: '#FFFFFF', fontWeight: 500 }}>
              Home
            </Button>
          </Link>
          <Link href="/about">
            <Button sx={{ color: '#FFFFFF', fontWeight: 500 }}>
              About us
            </Button>
          </Link>
          <Link href="/book">
            <Button sx={{ color: '#FFFFFF', fontWeight: 500 }}>
              Book Now
            </Button>
          </Link>
          <Link href="/contact">
            <Button sx={{ color: '#FFFFFF', fontWeight: 500 }}>
              Contact us
            </Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}