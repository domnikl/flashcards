import React, {useState} from "react";
import {Button, Container, Grid, TextField} from "@mui/material";
import {Auth} from "@supabase/auth-ui-react";
import {findCardById, saveCard} from "../supabase";
import {uuid} from "@supabase/supabase-js/dist/main/lib/helpers";
import {useQueryClient} from "react-query";
import {Card} from "../model/Card";
import {Params, useLoaderData, useNavigate} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {PageHeader} from "./PageHeader";
import {Cardset} from "../model/Cardset";
import useUser = Auth.useUser;

export async function cardLoader({params}: { params: Params }): Promise<{ card: Card | null } | Response | null> {
    if (!params.cardId) {
        return new Response("Not Found", {status: 404})
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return {card: await findCardById(params.cardId)} ?? new Response("Not Found", {status: 404});
}

export function EditCardPage() {
    const {card, cardset} = useLoaderData() as { card: Card | null, cardset: Cardset | null };
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = useUser();
    const [id, setId] = useState<string>(card?.id ?? uuid());

    const cardsetId = card?.cardset_id ?? cardset?.id;

    const {control, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            question: card?.question ?? "",
            answer: card?.answer ?? "",
            context: card?.context ?? "",
        }
    });

    const onSubmit = ({question, answer, context}: { question: string, answer: string, context: string }) => {
        const updated: Card = {
            ...card,
            id: id,
            question: question,
            answer: answer,
            context: context === "" ? null : context,
            cardset_id: cardsetId ?? "",
            is_deleted: false,
            user_id: user!!.user!!.id,
        }

        // TODO: what if supabase has an error?

        if (user?.user) {
            saveCard(updated).then((c) => {
                setId(c[0].id);
                queryClient.invalidateQueries('cards').then(() => {
                    navigate("/cardsets/" + cardsetId)
                })
            })
        }
    }

    return <React.Fragment>
        <PageHeader title={(!card ? "Create" : "Edit") + " card"}/>

        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Controller
                        name="question"
                        control={control}
                        rules={{
                            required: {value: true, message: "is required"},
                            maxLength: {value: 255, message: "is too long (255 chars max.)"}
                        }}
                        render={({field}) => <TextField
                            required
                            id="question"
                            label="What should be on the front of the card?"
                            error={!!errors?.question}
                            helperText={errors?.question?.message}
                            fullWidth
                            autoComplete="name"
                            variant="filled"
                            autoFocus
                            {...field}/>}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="answer"
                        control={control}
                        rules={{
                            required: {value: true, message: "is required"},
                            maxLength: {value: 255, message: "is too long (255 chars max.)"}
                        }}
                        render={({field}) => <TextField
                            required
                            id="answer"
                            label="What should be on the back?"
                            error={!!errors?.answer}
                            helperText={errors?.answer?.message}
                            fullWidth
                            autoComplete="name"
                            variant="filled"
                            {...field}/>}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="context"
                        control={control}
                        rules={{
                            maxLength: {value: 255, message: "is too long (255 chars max.)"}
                        }}
                        render={({field}) => <TextField
                            multiline
                            rows={3}
                            id="context"
                            label="some context"
                            error={!!errors?.context}
                            helperText={errors?.context?.message}
                            fullWidth
                            autoComplete="name"
                            variant="filled"
                            {...field}/>}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Grid container direction="row" justifyContent="flex-end">
                        <Grid item sx={{padding: '5px'}}>
                            <Button variant="outlined"
                                    onClick={() => navigate("/cardsets/" + cardsetId)}>Cancel</Button>
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
