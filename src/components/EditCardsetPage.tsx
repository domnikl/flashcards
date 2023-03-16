import React, {useState} from "react";
import {Button, Container, Grid, TextField} from "@mui/material";
import {Cardset} from "../model/Cardset";
import {Auth} from "@supabase/auth-ui-react";
import {uuid} from "@supabase/supabase-js/dist/main/lib/helpers";
import {useQueryClient} from "@tanstack/react-query";
import {useLoaderData, useNavigate} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {saveCardset} from "../supabase";
import {PageHeader} from "./PageHeader";
import useUser = Auth.useUser;


export function EditCardsetPage() {
    const loaderData = useLoaderData() as { cardset: Cardset | null } | undefined;
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const user = useUser();
    const [id, setId] = useState<string>(loaderData?.cardset?.id ?? uuid());

    const {control, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            name: loaderData?.cardset?.name ?? "",
            imageUrl: loaderData?.cardset?.image_url ?? "",
        }
    });

    // TODO: limit the amount of cardsets a user can create!

    const onSubmit = ({name, imageUrl}: { name: string, imageUrl: string | null }) => {
        const updated = {
            id, ...loaderData?.cardset, name, image_url: imageUrl, is_deleted: false
        }

        if (user?.user) {
            saveCardset(updated, user!!.user!!.id).then((cardsets) => {
                if (cardsets) {
                    setId(cardsets[0].id);

                    queryClient.invalidateQueries({queryKey: ['cardsets']}).then(() => navigate("/cardsets/" + cardsets[0].id, {replace: true}))
                }
            })
        }
    }

    return <React.Fragment>
        <PageHeader title={(!loaderData?.cardset ? "Create" : "Edit") + " cardset"}/>

        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            required: {value: true, message: "is required"},
                            minLength: {value: 3, message: "is too short (3 chars min.)"},
                            maxLength: {value: 70, message: "is too long (70 chars max.)"}
                        }}
                        render={({field}) => <TextField
                            required
                            id="name"
                            label="Name of the set"
                            error={!!errors?.name}
                            helperText={errors?.name?.message}
                            fullWidth
                            autoComplete="name"
                            variant="filled"
                            autoFocus
                            {...field}/>}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="imageUrl"
                        control={control}
                        rules={{
                            required: false,
                            minLength: {value: 3, message: "is too short (3 chars min.)"},
                            maxLength: {value: 255, message: "is too long (255 chars max.)"},
                            validate: async (v) => {
                                if (!v) return true;

                                //const response = await fetch(v);
                                //return response.ok;

                                // TODO: cors?!
                                return true;
                            }
                        }}
                        render={({field}) => <TextField
                            id="imageUrl"
                            label="URL to a set image"
                            error={!!errors?.imageUrl}
                            helperText={errors?.imageUrl?.message}
                            fullWidth
                            autoComplete="url"
                            variant="filled"
                            type="url"
                            {...field}/>}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Grid container direction="row" justifyContent="flex-end">
                        <Grid item sx={{padding: '5px'}}>
                            <Button variant="outlined" onClick={() => navigate("/cardsets")}>Cancel</Button>
                        </Grid>
                        <Grid item sx={{padding: '5px'}}>
                            <Button variant="contained" onClick={handleSubmit(onSubmit)}>Save</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    </React.Fragment>;
}
