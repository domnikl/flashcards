import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";
import {Button, Card, CardContent, Container, Fab} from "@mui/material";
import {Add, Delete, Edit} from "@mui/icons-material";
import {Params, useLoaderData, useNavigate} from "react-router-dom";
import {Cardset} from "../model/Cardset";
import {findAllCardsByCardset, saveCardset, useCardset} from "../supabase";
import {Card as CardsetCard} from "../model/Card";
import {useQuery, useQueryClient} from "react-query";
import IsLoading from "./atoms/IsLoading";
import EmptyView from "./atoms/EmptyView";
import {PageHeader} from "./PageHeader";
import {Auth} from "@supabase/auth-ui-react";
import useUser = Auth.useUser;
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import Tooltip from "@mui/material/Tooltip";

export async function cardsetLoader({ params }: { params: Params }): Promise<Cardset|Response|null> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return await useCardset(params.cardsetId) ?? new Response("Not Found", { status: 404 });
}

export function CardsetPage() {
    const cardset = useLoaderData() as Cardset;
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = useUser();

    // @ts-ignore
    const {
        data: cards,
        isLoading: isLoadingCards
    } = useQuery<CardsetCard[]>(['cards', cardset.id], () => findAllCardsByCardset(cardset))

    const handleDelete = () => {
        if (window.confirm("Are you sure? This can not be reverted.")) {
            cardset.is_deleted = true;
            saveCardset(cardset, user!!.user!!.id)
                .then(() => queryClient.invalidateQueries("cards"))
                .then(() => navigate("/cardsets"))
        }
    }

    const handleEdit = () => {
        navigate("/cardsets/" + cardset.id + "/edit")
    }

    const navigateToCreate = () => navigate("/cardsets/" + cardset.id + "/cards/create", {replace: true});

    const emptyView = <React.Fragment>
        <Grid container direction="column" alignContent="center">
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>You don't have any cards in here yet.</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>Fancy creating your first one?</Typography>

            <Button variant="outlined" onClick={navigateToCreate} sx={{ marginTop: "20px" }}>add a card</Button>
        </Grid>
    </React.Fragment>;

    const actions = <React.Fragment>
        <Grid container>
            <Button onClick={() => handleEdit()}><Edit /></Button>
            <Button onClick={() => handleDelete()}><Delete /></Button>
            <Tooltip title="Help">
                <IconButton color="inherit">
                    <HelpIcon/>
                </IconButton>
            </Tooltip>
        </Grid>
    </React.Fragment>

    return (<React.Fragment>
        <PageHeader title={cardset.name} actions={actions}/>

        <Container sx={{ padding: '20px' }}>
            <IsLoading isFetching={isLoadingCards}>
                <EmptyView checkItems={cards} emptyContent={emptyView}>
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
                                        <Typography variant="h6" component="div">
                                            {card.question}
                                        </Typography>
                                        <Typography variant="handwriting" sx={{ fontSize: '1em' }} color="text.secondary" gutterBottom>
                                            {card.context}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </EmptyView>
            </IsLoading>
        </Container>

        <Fab sx={{position: 'absolute', bottom: 32, right: 32}} color="primary" aria-label="add"
             onClick={navigateToCreate}>
            <Add/>
        </Fab>
    </React.Fragment>);
}
