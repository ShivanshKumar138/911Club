/*eslint-disable*/
import { 
  AppBar, 
  IconButton, 
  Toolbar, 
  Typography, 
  Menu, 
  MenuItem, 
  Avatar,
  ListItemIcon,
  Switch,
  Box,
  Divider,
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { getUserInfo, removeToken } from '../../utils/auth';
// import { useAuth } from '../../context/AuthContext';Not being used optional

const Header = ({ handleDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useTheme();
  
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    if (path === '/logout') {
      // Handle logout
      removeToken();  // This will remove both token and userInfo
      navigate('/login');
    } else if (path) {
      handleClose();
      navigate(path);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('Good Morning');
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good Afternoon');
      } else if (hour >= 17 && hour < 21) {
        setGreeting('Good Evening');
      } else {
        setGreeting('Good Night');
      }
    };

    // Initial greeting
    updateGreeting();

    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // const { logout } = useAuth();

  // Replace the hardcoded user with userInfo from localStorage
  const userInfo = getUserInfo();
  const user = {
    name: userInfo?.username || 'User',
    role: 'Admin',
    email: userInfo?.email || '',
    avatar: userInfo?.avatar
  };

  console.log('Avatar URL:', user.avatar); // Debug log

  // Get first letter of first and last name for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Define all profile menu items
  const menuItems = useMemo(() => [
    {
      title: 'Dark Mode',
      icon: mode === 'dark' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />,
      isSwitch: true,
    },
    {
      title: 'Logout',
      icon: <LogoutIcon fontSize="small" />,
      path: '/logout',  // This will trigger the logout handling
    },
  ], [mode]);

  // Handle search input change
  const handleSearchChange = (event) => {
    // Prevent menu from closing when typing
    event.stopPropagation();
    setSearchQuery(event.target.value);
  };

  // Filter menu items based on search query
  const filteredMenuItems = useMemo(() => {
    if (!searchQuery.trim()) return menuItems;
    
    return menuItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [menuItems, searchQuery]);

  // Render menu item based on its type
  const renderMenuItem = (item) => {
    if (item.isSwitch) {
      return (
        <MenuItem key={item.title} sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <Typography>{item.title}</Typography>
          </Box>
          <Switch
            checked={mode === 'dark'}
            onChange={toggleColorMode}
            color="primary"
          />
        </MenuItem>
      );
    }

    return (
      <MenuItem 
        key={item.title} 
        onClick={() => handleMenuItemClick(item.path)}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        {item.title}
        {item.badge && (
          <Box
            sx={{
              ml: 'auto',
              bgcolor: '#FFF9C4',
              px: 1,
              borderRadius: 1,
              fontSize: '0.75rem',
            }}
          >
            {item.badge}
          </Box>
        )}
      </MenuItem>
    );
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: '100%',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6">
              {greeting}, {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.role}
            </Typography>
          </Box>
        </Typography>

        {/* Notification Icon */}
        <IconButton color="inherit" sx={{ mr: 2 }}>
          <NotificationsIcon />
        </IconButton>

        {/* Profile Menu */}
        <IconButton
          onClick={handleProfileClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              overflow: 'hidden',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {user.avatar && !imageError ? (
              <img 
                src={user.avatar}
                alt={user.name}
                onError={(e) => {
                  console.error('Image load error:', e);
                  handleImageError();
                }}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover'
                }}
              />
            ) : (
              <Typography sx={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>
                {getInitials(user.name)}
              </Typography>
            )}
          </Box>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              width: 320,
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* User Info */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.role}
            </Typography>
          </Box>

          <Divider />

          {/* Search Bar */}
          <Box sx={{ p: 2 }} onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              placeholder="Search profile options"
              value={searchQuery}
              onChange={handleSearchChange}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                outline: 'none',
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#fff',
                color: mode === 'dark' ? '#fff' : '#000',
                '&::placeholder': {
                  color: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
              }}
            />
          </Box>

          {/* Premium Button */}
          {!searchQuery && (
            <>
              <Box sx={{ px: 2, pb: 2 }}>
                <Box
                  sx={{
                    bgcolor: (theme) => 
                      theme.palette.mode === 'dark' 
                        ? 'rgba(255, 249, 196, 0.15)' 
                        : '#FFF9C4',
                    p: 1.5,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: (theme) => 
                      theme.palette.mode === 'dark' 
                        ? 'primary.light' 
                        : 'text.primary',
                    border: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : 'none',
                  }}
                >
                  <Typography 
                    sx={{ 
                      fontWeight: 500,
                      color: (theme) => 
                        theme.palette.mode === 'dark' 
                          ? 'primary.light' 
                          : 'text.primary',
                    }}
                  >
                    Go Premium
                  </Typography>
                  <IconButton 
                    size="small" 
                    sx={{ 
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    }}
                  >
                    <SettingsIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Divider />
            </>
          )}

          {/* Filtered Menu Items */}
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            {filteredMenuItems.length > 0 ? (
              filteredMenuItems.map(renderMenuItem)
            ) : (
              <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body2">
                  No options found
                </Typography>
              </Box>
            )}
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 