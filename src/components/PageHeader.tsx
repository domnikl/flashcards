import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import React, {ReactNode} from "react";

export type PageHeaderProps = {
    title: string;
    actions?: ReactNode
}

export function PageHeader(props: PageHeaderProps) {
    return <React.Fragment>
        <AppBar
            component="div"
            color="primary"
            position="sticky"
            elevation={0}
            sx={{zIndex: 0}}
        >
            <Toolbar>
                <Grid container alignItems="center" spacing={1}>
                    <Grid item xs>
                        <Typography color="inherit" variant="h5" component="h1" sx={{ whiteSpace: 'nowrap', textOverflow: "ellipsis"}}>
                            {props.title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        {props.actions}
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>

        <Divider sx={{ marginBottom: "20px" }} />
    </React.Fragment>
}
