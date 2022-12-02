import React, {useState} from "react";
import {Button, Container, Grid, TextField} from "@mui/material";
import {Cardset} from "../model/Cardset";
import {Auth} from "@supabase/auth-ui-react";
import {uuid} from "@supabase/supabase-js/dist/main/lib/helpers";
import {useQueryClient} from "react-query";
import {useLoaderData, useNavigate} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {saveCardset} from "../supabase";
import {PageHeader} from "./PageHeader";
import useUser = Auth.useUser;


export function EditCardsetPage() {
    let cardset = useLoaderData() as Cardset | null;
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const user = useUser();
    const [id, setId] = useState<string>(cardset?.id ?? uuid());

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: cardset?.name ?? ""
        }
    });

    // TODO: limit the amount of cardsets a user can create

    const onSubmit = ({ name }: { name: string }) => {
        const updated = {id, ...cardset, name, is_deleted: false}

        if (user?.user) {
            saveCardset(updated, user!!.user!!.id).then((cardsets) => {
                setId(cardsets[0].id);
                queryClient.invalidateQueries('cardsets').then(() => navigate("/cardsets/" + cardsets[0].id, {replace: true}))
            })
        }
    }

    return <React.Fragment>
        <PageHeader title={(!cardset ? "Create" : "Edit") + " cardset"} />

        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            required: { value: true, message: "is required" },
                            minLength: { value: 3, message: "is too short (3 chars min.)"},
                            maxLength: {value: 70, message: "is too long (70 chars max.)" }}}
                        render={({ field }) => <TextField
                            required
                            id="name"
                            label="Name of the set"
                            error={!!errors?.name}
                            helperText={errors?.name?.message}
                            fullWidth
                            autoComplete="name"
                            variant="filled"
                            onKeyDown={(e) => e.key === "Enter" ? handleSubmit(onSubmit) : null}
                            autoFocus
                            {...field}/>}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Grid container direction="row" justifyContent="flex-end">
                        <Grid item sx={{ padding: '5px' }}>
                            <Button variant="outlined" onClick={() => navigate("/cardsets")}>Cancel</Button>
                        </Grid>
                        <Grid item sx={{ padding: '5px' }}>
                            <Button variant="contained" onClick={handleSubmit(onSubmit)}>Save</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    </React.Fragment>;
}
