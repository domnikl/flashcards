import React, {useState} from "react";
import {Button, Container, Grid, TextField, Typography} from "@mui/material";
import {Auth} from "@supabase/auth-ui-react";
import {saveCard} from "../supabase";
import {uuid} from "@supabase/supabase-js/dist/main/lib/helpers";
import {useQueryClient} from "react-query";
import {Card} from "../model/Card";
import {useLoaderData} from "react-router-dom";
import {Cardset} from "../model/Cardset";
import useUser = Auth.useUser;

type EditCardPageProps = {
    card?: Card | null;
}

export function EditCardPage(props: EditCardPageProps) {
    const cardset = useLoaderData() as Cardset;
    const queryClient = useQueryClient();
    const user = useUser();
    const [id, setId] = useState<string>(props.card?.id ?? uuid());
    const [question, setQuestion] = useState<string>(props.card?.question ?? "");
    const [questionError, setQuestionError] = useState<string|null>(null);

    // TODO: generic form validation?
    const validate = (name: string): boolean => {
        if (name.length < 3) {
            setQuestionError("is too short (min 3 chars)");
            return false;
        } else if (name.length > 70) {
            setQuestionError("is too long (max 70 chars)");
            return false;
        }

        setQuestionError(null);

        return true;
    }

    const handleSubmit = () => {
        if (!validate(question)) return;

        // TODO: what if there is an update?
        const card: Card = props.card ?? {
            id: id,
            question: question,
            answer: "", // TODO: fill all the fields
            context: "", // TODO: fill all the fields
            cardset_id: cardset.id,
            is_deleted: false,
        }

        // TODO: what if supabase has an error?

        if (user?.user) {
            saveCard(card, user!!.user!!.id).then((card) => {
                setId(card[0].id);
                queryClient.invalidateQueries('cards')
            })
        }
    }

    return <React.Fragment>
        <Typography variant="h6" gutterBottom>
            {!props.card ? "Create" : "Edit"} card
        </Typography>

        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        error={!!questionError}
                        helperText={questionError}
                        id="name"
                        label="question"
                        fullWidth
                        autoComplete="name"
                        variant="standard"
                        onChange={(e) => {setQuestion(e.target.value); }}
                        onBlur={() => validate(question)}
                        onKeyDown={(e) => e.key === "Enter" ? handleSubmit() : null}
                        autoFocus/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Button variant="contained" onClick={handleSubmit}>Save</Button>
                </Grid>
            </Grid>
        </Container>
    </React.Fragment>;
}
