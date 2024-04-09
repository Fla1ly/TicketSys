import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import { Typography, Box, Drawer, CssBaseline, Toolbar, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, Container } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar from "@mui/material/AppBar";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, openDrawer }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(openDrawer && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function NavbarContent({
    children,
}) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" openDrawer={openDrawer}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(openDrawer && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Ticket System
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={openDrawer}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {['Home', 'Tickets', 'Find Ticket'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {index === 0 ? <HomeRoundedIcon onClick={() => navigate('/')} /> : null}
                                    {index === 1 ? <ConfirmationNumberOutlinedIcon onClick={() => navigate('/tickets')} /> : null}
                                    {index === 2 ? <SearchRoundedIcon onClick={() => navigate('/find-ticket')} /> : null}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    {isAuthenticated && (
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/admin-panel')}>
                                <ListItemIcon>
                                    <AdminPanelSettingsIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Admin Panel" />
                            </ListItemButton>
                        </ListItem>
                    )}
                </List>
                <Box sx={{ flexGrow: 1 }} />
                <Button variant="contained" onClick={() => navigate('/login')}>Login</Button>
            </Drawer>
            <Box sx={{
                marginTop: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: '100%',
            }}>{children}</Box>
        </Box>
    );
}

export default NavbarContent;