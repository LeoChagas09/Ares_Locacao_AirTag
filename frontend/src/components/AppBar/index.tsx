// src/components/AppBar/index.tsx
'use client';
import * as React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Button,
  Avatar,
  Chip,
  useTheme,
  alpha,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery
} from '@mui/material';
import NextLink from 'next/link';
import { 
  People,
  Devices,
  Assignment,
  Business,
  Dashboard,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const pages = [
  { label: 'Clientes', path: '/clientes', icon: People },
  { label: 'Dispositivos', path: '/dispositivos', icon: Devices },
  { label: 'Locações', path: '/locacoes', icon: Assignment },
];

function ResponsiveAppBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AppBar 
        position="static" 
        sx={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: '72px' }}>
            {/* Menu Mobile - Hambúrguer */}
            {isMobile && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo e Nome */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mr: { xs: 0, md: 4 },
              flexGrow: { xs: 1, md: 0 }
            }}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.common.white, 0.15),
                  mr: 2,
                  width: { xs: 36, md: 40 },
                  height: { xs: 36, md: 40 },
                }}
              >
                <Business sx={{ color: 'white', fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  component={NextLink}
                  href="/"
                  sx={{
                    fontFamily: 'Inter',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    display: 'block',
                    lineHeight: 1,
                  }}
                >
                  IN HOUSE
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: alpha(theme.palette.common.white, 0.8),
                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                    fontWeight: 500,
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Sistema de Gestão
                </Typography>
              </Box>
            </Box>
            
            {/* Navigation Links - Desktop */}
            <Box sx={{ 
              flexGrow: 1, 
              display: { xs: 'none', md: 'flex' }, 
              gap: 1 
            }}>
              {pages.map((page) => {
                const IconComponent = page.icon;
                return (
                  <Button
                    key={page.label}
                    component={NextLink}
                    href={page.path}
                    startIcon={<IconComponent />}
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {page.label}
                  </Button>
                );
              })}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: {
            width: 280,
            background: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
          }
        }}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.common.white, 0.15),
                mr: 2,
                width: 40,
                height: 40,
              }}
            >
              <Business sx={{ color: 'white' }} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>
                IN HOUSE
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Sistema de Gestão
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleMobileMenuClose}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.2) }} />
        
        <List sx={{ px: 2, py: 1 }}>
          {pages.map((page) => {
            const IconComponent = page.icon;
            return (
              <ListItem key={page.label} disablePadding>
                <ListItemButton
                  component={NextLink}
                  href={page.path}
                  onClick={handleMobileMenuClose}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    <IconComponent />
                  </ListItemIcon>
                  <ListItemText 
                    primary={page.label} 
                    primaryTypographyProps={{
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
}

export default ResponsiveAppBar;