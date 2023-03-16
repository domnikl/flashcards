import React from "react";
import {Button, Card, CardContent, CardMedia, Container, Fab} from "@mui/material";
import {Add} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {PageHeader} from "./PageHeader";
import IsLoading from "./atoms/IsLoading";
import EmptyView from "./atoms/EmptyView";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {useQuery} from "@tanstack/react-query";
import {findAllCardsetsByUser} from "../supabase";
import {Cardset} from "../model/Cardset";
import {Auth} from "@supabase/auth-ui-react";
import useUser = Auth.useUser;

export function CardsetsOverviewPage() {
    const navigate = useNavigate();
    const user = useUser();

    // @ts-ignore
    const {
        data: cardsets,
        isLoading
    } = useQuery<Cardset[]>(['cardsets'], () => findAllCardsetsByUser(user!!.user!!));

    const navigateToCreate = () => navigate("/cardsets/create", {replace: true});

    const emptyView = <React.Fragment>
        <Grid container direction="column" alignContent="center">
            <Typography variant="caption" color="text.secondary" sx={{textAlign: "center"}}>You don't have any cardsets
                yet.</Typography>
            <Typography variant="caption" color="text.secondary" sx={{textAlign: "center"}}>Fancy creating your first
                one?</Typography>

            <Button variant="outlined" onClick={navigateToCreate} sx={{marginTop: "20px"}}>create a set</Button>
        </Grid>
    </React.Fragment>;

    return (<React.Fragment>
        <PageHeader title="Cardsets overview"/>

        <Container sx={{padding: '20px'}}>
            <IsLoading isFetching={isLoading}>
                <EmptyView checkItems={cardsets} emptyContent={emptyView}>
                    <Grid container alignItems="stretch" spacing={2} justifyItems="stretch">
                        <Grid item xs={4} alignItems="stretch" justifyContent="stretch">
                            <Card>
                                <Button sx={{minHeight: '100px'}} fullWidth color="inherit"
                                        onClick={navigateToCreate}>
                                    <Add/>
                                </Button>
                            </Card>
                        </Grid>

                        {cardsets?.map((cardset) => (
                            <Grid item xs={4} key={cardset.id}>
                                <Card sx={{height: 'fill-parent', minHeight: '100px', cursor: 'pointer'}}
                                      onClick={() => navigate("/cardsets/" + cardset.id)}>
                                    {cardset.image_url ?
                                        <CardMedia component="img" image={cardset.image_url} height="200"
                                                   alt={cardset.name}/> : null}
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {cardset.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </EmptyView>
            </IsLoading>
        </Container>

        <Fab sx={{position: 'fixed', bottom: 32, right: 32}} color="primary" aria-label="add"
             onClick={() => navigate("/cardsets/create", {replace: true})}>
            <Add/>
        </Fab>
    </React.Fragment>);
}
