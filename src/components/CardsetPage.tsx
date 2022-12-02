import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import React from "react";
import {Fab} from "@mui/material";
import {Add} from "@mui/icons-material";
import {Params, useLoaderData, useNavigate} from "react-router-dom";
import {Cardset} from "../model/Cardset";
import {findCardsetById} from "../supabase";

export async function cardsetLoader({ params }: { params: Params }): Promise<Cardset|null> {
    if (params.cardsetId) {
        return findCardsetById(params.cardsetId);
    }

    return null;
}

export function CardsetPage() {
    const cardset = useLoaderData() as Cardset;

    console.log({ cardset })

    const navigate = useNavigate();

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

        <Fab sx={{position: 'absolute', bottom: 32, right: 32}} color="primary" aria-label="add"
             onClick={() => navigate("/cardsets/create", {replace: true})}>
            <Add/>
        </Fab>
    </React.Fragment>);
}
