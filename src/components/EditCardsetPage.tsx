import React, {useState} from "react";
import {Button, Container, Grid, TextField, Typography} from "@mui/material";
import {Cardset} from "../model/Cardset";
import {Auth} from "@supabase/auth-ui-react";
import {uuid} from "@supabase/supabase-js/dist/main/lib/helpers";
import {useQueryClient} from "react-query";
import {useNavigate} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import useUser = Auth.useUser;
import {saveCardset} from "../supabase";

type EditCardsetPageProps = {
    cardset?: Cardset | null;
}

export function EditCardsetPage(props: EditCardsetPageProps) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const user = useUser();
    const [id, setId] = useState<string>(props.cardset?.id ?? uuid());

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: props.cardset?.name ?? ""
        }
    });

    const onSubmit = ({ name }: { name: string }) => {
        const cardset: Cardset = props.cardset ?? {
            id: id,
            name: name,
            is_deleted: false,
        }

        // TODO: what if supabase has an error?

        if (user?.user) {
            saveCardset(cardset, user!!.user!!.id).then((cardsets) => {
                setId(cardsets[0].id);
                queryClient.invalidateQueries('cardsets').then(() => navigate("/cardsets/" + cardsets[0].id, {replace: true}))
            })
        }
    }

    return <React.Fragment>
        <Typography variant="h6" gutterBottom>
            {!props.cardset ? "Create" : "Edit"} cardset
        </Typography>

        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
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
                            variant="standard"
                            onKeyDown={(e) => e.key === "Enter" ? handleSubmit(onSubmit) : null}
                            autoFocus
                            {...field}/>}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Button variant="contained" onClick={handleSubmit(onSubmit)}>Save</Button>
                </Grid>
            </Grid>
        </Container>
    </React.Fragment>;
}
