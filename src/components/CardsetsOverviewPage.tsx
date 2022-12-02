import React from "react";
import {Fab} from "@mui/material";
import {Add} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {PageHeader} from "./PageHeader";

export function CardsetsOverviewPage() {
    const navigate = useNavigate();

    return (<React.Fragment>
        <PageHeader title="Cardsets overview" />

        <Fab sx={{position: 'absolute', bottom: 32, right: 32}} color="primary" aria-label="add"
             onClick={() => navigate("/cardsets/create", {replace: true})}>
            <Add/>
        </Fab>
    </React.Fragment>);
}
