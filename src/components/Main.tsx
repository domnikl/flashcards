import React, {useState} from "react";
import {Box, CssBaseline, Link, Typography, useMediaQuery} from "@mui/material";
import {theme} from "../Theme";
import Navigator from "./Navigator";
import Header from "./Header";
import {Outlet} from "react-router-dom";

let drawerWidth = 256;

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="text.secondary" href="/">
                Fabulous Flashcards
            </Link>{' '}
            {new Date().getFullYear()}.
        </Typography>
    );
}

export function Main() {
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    }

    return (
        <Box sx={{display: 'flex', minHeight: '100vh'}}>
            <CssBaseline/>
            <Box component="nav" sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}>
                {isSmUp ? null : (
                    <Navigator
                        PaperProps={{style: {width: drawerWidth}}}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                    />
                )}
                <Navigator
                    PaperProps={{style: {width: drawerWidth}}}
                    sx={{display: {sm: 'block', xs: 'none'}}}
                />
            </Box>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <Header onDrawerToggle={handleDrawerToggle}/>
                <Box component="main" sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                    <Outlet/>
                </Box>

                <Box component="footer" sx={{p: 2}}>
                    <Copyright/>
                </Box>
            </Box>
        </Box>
    );
}
