import React, {useState} from "react";
import {Button, Container, Grid, TextField} from "@mui/material";
import {Auth} from "@supabase/auth-ui-react";
import {saveCard} from "../supabase";
import {uuid} from "@supabase/supabase-js/dist/main/lib/helpers";
import {useQueryClient} from "react-query";
import {Card} from "../model/Card";
import {useLoaderData, useNavigate} from "react-router-dom";
import {Cardset} from "../model/Cardset";
import {Controller, useForm} from "react-hook-form";
import {PageHeader} from "./PageHeader";
import useUser = Auth.useUser;

type EditCardPageProps = {
    card?: Card | null;
}

export function EditCardPage(props: EditCardPageProps) {
    const cardset = useLoaderData() as Cardset;
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = useUser();
    const [id, setId] = useState<string>(props.card?.id ?? uuid());

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            question: props.card?.question ?? "",
            answer: props.card?.answer ?? "",
            context: props.card?.context ?? "",
        }
    });

    const onSubmit = ({ question, answer, context }: { question: string, answer: string, context: string }) => {
        const card: Card = props.card ?? {
            id: id,
            question: question,
            answer: answer,
            context: context === "" ? null : context,
            cardset_id: cardset.id,
            is_deleted: false,
            user_id: user!!.user!!.id
        }

        // TODO: what if supabase has an error?

        if (user?.user) {
            saveCard(card, user!!.user!!.id).then((card) => {
                setId(card[0].id);
                queryClient.invalidateQueries('cards').then(() => {
                    navigate("/cardsets/" + cardset.id)
                })
            })
        }
    }

    return <React.Fragment>
        <PageHeader title={(!props.card ? "Create" : "Edit") + " card"} />

        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Controller
                        name="question"
                        control={control}
                        rules={{
                            required: { value: true, message: "is required" },
                            minLength: { value: 3, message: "is too short (3 chars min.)"},
                            maxLength: {value: 70, message: "is too long (70 chars max.)" }}}
                        render={({ field }) => <TextField
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
                            required: { value: true, message: "is required" },
                            minLength: { value: 3, message: "is too short (3 chars min.)"},
                            maxLength: {value: 70, message: "is too long (70 chars max.)" }}}
                        render={({ field }) => <TextField
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
                            maxLength: {value: 255, message: "is too long (255 chars max.)" }}}
                        render={({ field }) => <TextField
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
                        <Grid item sx={{ padding: '5px' }}>
                            <Button variant="outlined" onClick={() => navigate("/cardsets/" + cardset.id)}>Cancel</Button>
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
