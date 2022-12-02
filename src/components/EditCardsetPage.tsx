import React, {useState} from "react";
import {Box, Button, Grid, TextField, Typography} from "@mui/material";
import {Cardset} from "../model/Cardset";
import {Auth} from "@supabase/auth-ui-react";
import {saveCardset} from "../supabase";
import {uuid} from "@supabase/supabase-js/dist/main/lib/helpers";
import {useQueryClient} from "react-query";
import {useNavigate} from "react-router-dom";
import useUser = Auth.useUser;

type EditCardsetPageProps = {
    cardset?: Cardset | null;
}

export function EditCardsetPage(props: EditCardsetPageProps) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const user = useUser();
    const [id, setId] = useState<string>(props.cardset?.id ?? uuid());
    const [name, setName] = useState<string>(props.cardset?.name ?? "");
    const [nameError, setNameError] = useState<string|null>(null);

    // TODO: generic form validation?
    const validate = (name: string): boolean => {
        if (name.length < 3) {
            setNameError("is too short (min 3 chars)");
            return false;
        } else if (name.length > 70) {
            setNameError("is too long (max 70 chars)");
            return false;
        }

        setNameError(null);

        return true;
    }

    const handleSubmit = () => {
        if (!validate(name)) return;

        const cardset: Cardset = props.cardset ?? {
            id: id,
            name: name,
        }

        // TODO: what if supabase has an error?

        if (user?.user) {
            saveCardset(cardset, user!!.user!!.id).then((cardsets) => {
                setId(cardsets[0].id);
                queryClient.invalidateQueries('cardsets').then(() => navigate("/cardsets", {replace: true}))
            })
        }
    }

    return <React.Fragment>
        <Typography variant="h6" gutterBottom>
            {!props.cardset ? "Create" : "Edit"} cardset
        </Typography>

        <Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        error={!!nameError}
                        helperText={nameError}
                        id="name"
                        label="Name of the set"
                        fullWidth
                        autoComplete="name"
                        variant="standard"
                        onChange={(e) => {setName(e.target.value); }}
                        onBlur={() => validate(name)}
                        onKeyDown={(e) => e.key === "Enter" ? handleSubmit() : null}
                        autoFocus/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Button variant="contained" onClick={handleSubmit}>Save</Button>
                </Grid>
            </Grid>
        </Box>
    </React.Fragment>;
}
