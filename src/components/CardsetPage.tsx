import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import React from "react";
import {Box, Button, Card, CardContent, Container, Fab} from "@mui/material";
import {Add} from "@mui/icons-material";
import {Params, useLoaderData, useNavigate} from "react-router-dom";
import {Cardset} from "../model/Cardset";
import {findAllCardsByCardset, useCardset} from "../supabase";
import {Card as CardsetCard} from "../model/Card";
import {useQuery} from "react-query";
import IsLoading from "./atoms/IsLoading";
import EmptyView from "./atoms/EmptyView";

export async function cardsetLoader({ params }: { params: Params }): Promise<Cardset|Response|null> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return await useCardset(params.cardsetId) ?? new Response("Not Found", { status: 404 });
}

export function CardsetPage() {
    const cardset = useLoaderData() as Cardset;
    const navigate = useNavigate();

    // @ts-ignore
    const {
        data: cards,
        isLoading: isLoadingCards
    } = useQuery<CardsetCard[]>(['cards', cardset.id], () => findAllCardsByCardset(cardset))

    const navigateToCreate = () => navigate("/cardsets/" + cardset.id + "/cards/create", {replace: true});

    return (<React.Fragment>
        <AppBar
            component="div"
            color="primary"
            position="static"
            elevation={0}
            sx={{zIndex: 0}}
        >
            <Toolbar>
                <Grid container alignItems="center" spacing={1}>
                    <Grid item xs>
                        <Typography color="inherit" variant="h5" component="h1">
                            {cardset.name}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Tooltip title="Help">
                            <IconButton color="inherit">
                                <HelpIcon/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>

        <IsLoading isFetching={isLoadingCards}>
            <EmptyView checkItems={cards} emptyContent={<Container><Box>You don't have any cards in here yet.</Box><Box>Fancy creating your first one?</Box><Button variant="outlined" onClick={navigateToCreate}>add a card</Button></Container>}>
                <Grid container alignItems="stretch" spacing={2} justifyItems="stretch">
                    <Grid item xs={4} alignItems="stretch" justifyContent="stretch">
                        <Card>
                            <Button fullWidth color="inherit" onClick={navigateToCreate}>
                                <Add />
                            </Button>
                        </Card>
                    </Grid>

                    {cards?.map((card) => (
                        <Grid item xs={4} key={card.id}>
                            <Card sx={{ height: 'fill-parent' }}>
                                <CardContent>
                                    <Typography variant="handwriting" sx={{ fontSize: '1em' }} color="text.secondary" gutterBottom>
                                        {card.context}
                                    </Typography>
                                    <Typography variant="h6" component="div">
                                        {card.question}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </EmptyView>
        </IsLoading>

        <Fab sx={{position: 'absolute', bottom: 32, right: 32}} color="primary" aria-label="add"
             onClick={navigateToCreate}>
            <Add/>
        </Fab>
    </React.Fragment>);
}
