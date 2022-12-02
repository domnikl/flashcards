import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import React from "react";
import {Auth} from "@supabase/auth-ui-react";
import useUser = Auth.useUser;

interface HeaderProps {
    onDrawerToggle: () => void;
}

export default function Header(props: HeaderProps) {
    const {onDrawerToggle} = props;
    const user = useUser();

    return (
        <React.Fragment>
            <AppBar position="sticky" elevation={0} sx={{ paddingBottom: '20px'}}>
                <Toolbar>
                    <Grid container spacing={1} alignItems="center">
                        <Grid sx={{display: {sm: 'none', xs: 'block'}}} item>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={onDrawerToggle}
                                edge="start"
                            >
                                <MenuIcon/>
                            </IconButton>
                        </Grid>
                        <Grid item xs/>
                        <Grid item>
                            <IconButton color="inherit" sx={{p: 0.5}}>
                                <Avatar alt={user.user?.email ?? ""}/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

        </React.Fragment>
    );
}
