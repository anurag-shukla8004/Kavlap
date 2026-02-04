'use client';

import React, { useState } from 'react';
import { Box, Button, AppBar, Toolbar, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import Link from 'next/link';
import { formStyles } from '@/styles/theme';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    // { label: 'About us', path: '/about' },
    { label: 'Book Now', path: '/book' },
    // { label: 'Contact us', path: '/contact' },
  ];

  const drawer = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        background: 'linear-gradient(180deg, rgba(3, 13, 25, 0.98) 0%, rgba(0, 79, 158, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
        <Link href="/" onClick={handleDrawerToggle} style={{ textDecoration: 'none' }}>
          <Box sx={{ height: '35px', width: 'auto', display: 'flex', alignItems: 'center' }}>
            <Image
              src="/KAVLAP.svg"
              alt="KAVLAP"
              width={100}
              height={35}
              style={{ height: '100%', width: 'auto' }}
              priority
            />
          </Box>
        </Link>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: '#FFFFFF' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ paddingTop: '20px' }}>
        {navLinks.map((link) => (
          <ListItem key={link.path} disablePadding>
            <Link href={link.path} onClick={handleDrawerToggle} style={{ width: '100%', textDecoration: 'none' }}>
              <ListItemButton
                sx={{
                  padding: '16px 24px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    sx: {
                      color: '#FFFFFF',
                      fontWeight: 500,
                      fontSize: '1.1rem',
                    },
                  }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" elevation={0} sx={formStyles.header}>
      <Toolbar sx={{ justifyContent: 'space-between', padding: { xs: '8px 16px', md: '0 32px' } }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Box sx={{ height: { xs: '32px', md: '40px' }, width: 'auto', display: 'flex', alignItems: 'center' }}>
            <Image
              src="/KAVLAP.svg"
              alt="KAVLAP"
              width={120}
              height={40}
              style={{ height: '100%', width: 'auto' }}
              priority
            />
          </Box>
        </Link>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path} style={{ textDecoration: 'none' }}>
              <Button
                sx={{
                  position: 'relative',
                  color: '#FFFFFF',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  paddingX: 1,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    bottom: 6,
                    width: 0,
                    height: '2px',
                    backgroundColor: '#4A9EFF',
                    transition: 'width 0.25s ease-out',
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#4A9EFF',
                    '&::after': {
                      width: '100%',
                    },
                  },
                }}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { xs: 'block', md: 'none' }, color: '#FFFFFF' }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}