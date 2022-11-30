import * as React from 'react';
import Divider from '@mui/material/Divider';
import Drawer, {DrawerProps} from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import {Typography} from "@mui/material";
import FlightIcon from '@mui/icons-material/Flight';

const categories = [
    {
        id: 'Flashcard Sets',
        children: [
            {
                id: 'Airbus A320',
                icon: <FlightIcon/>,
                active: true,
            },
            {
                id: 'Machine learning',
                icon: <SettingsInputComponentIcon/>,
            },
        ],
    }
];

const item = {
    py: '2px',
    px: 3,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover, &:focus': {
        bgcolor: 'rgba(255, 255, 255, 0.08)',
    },
};

const itemCategory = {
    boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
    py: 1.5,
    px: 3,
};

export default function Navigator(props: DrawerProps) {
    const active = "Airbus A320";

    const {...other} = props;

    return (
        <Drawer variant="permanent" {...other}>
            <List disablePadding>
                <ListItem sx={{...item, ...itemCategory, fontSize: 22, color: '#fff'}}>
                    <Typography variant="handwriting">
                        Fabulous Flashcards
                    </Typography>
                </ListItem>
                <ListItem sx={{...item, ...itemCategory}}>
                    <ListItemIcon>
                        <HomeIcon/>
                    </ListItemIcon>
                    <ListItemText>Cards Overview</ListItemText>
                </ListItem>
                {categories.map(({id, children}) => (
                    <Box key={id}>
                        <ListItem sx={{py: 2, px: 3}}>
                            <ListItemText sx={{color: '#fff'}}>{id}</ListItemText>
                        </ListItem>
                        {children.map(({id: childId, icon}) => (
                            <ListItem disablePadding key={childId}>
                                <ListItemButton selected={childId === active} sx={item}>
                                    <ListItemIcon>{icon}</ListItemIcon>
                                    <ListItemText>{childId}</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <Divider sx={{mt: 2}}/>
                    </Box>
                ))}
            </List>
        </Drawer>
    );
}
