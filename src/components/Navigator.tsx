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
import {Button, Link, Typography} from "@mui/material";
import {Auth} from "@supabase/auth-ui-react";
import {findAllCardsetsByUser} from "../supabase";
import {useQuery} from "react-query";
import {Cardset} from "../model/Cardset";
import IsLoading from './atoms/IsLoading';
import EmptyView from "./atoms/EmptyView";
import useUser = Auth.useUser;

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
    const user = useUser();

    // @ts-ignore
    const {
        data: cardsets,
        isLoading: isLoadingCardsets
    } = useQuery<Array<Cardset>>('cardsets', () => findAllCardsetsByUser(user.user))

    // TODO: mark the active one (if any)
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
                    <ListItemText>
                        <Link href="/" color="inherit" underline="none"> Cards Overview</Link>
                    </ListItemText>
                </ListItem>
                <IsLoading isFetching={isLoadingCardsets}>
                    <Box>
                        <ListItem sx={{py: 2, px: 3}}>
                            <ListItemText sx={{color: '#fff'}}>Flashcard Sets</ListItemText>
                        </ListItem>
                        <EmptyView checkItems={cardsets}
                                   emptyContent={<ListItem><Button variant="outlined" href="/cardsets/create">Add your
                                       first
                                       cardset</Button></ListItem>}>
                            {cardsets?.map((cardset) => (
                                <ListItem disablePadding key={cardset.id}>
                                    <ListItemButton selected={cardset.id === "1"} sx={item}>
                                        <ListItemText>
                                            <Link underline="none" color="inherit" href={"/cardsets/" + cardset.id}>{cardset.name}</Link>
                                        </ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </EmptyView>
                        <Divider sx={{mt: 2}}/>
                    </Box>
                </IsLoading>
            </List>
        </Drawer>
    );
}
