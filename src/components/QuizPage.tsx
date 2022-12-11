import React, {useEffect, useState} from "react";
import {Button, LinearProgress} from "@mui/material";
import {useLoaderData, useNavigate} from "react-router-dom";
import {PageHeader} from "./PageHeader";
import Grid from "@mui/material/Grid";
import {saveQuizzes} from "../supabase";
import {Card as CardsetCard} from "../model/Card";
import {Cardset} from "../model/Cardset";
import {Flashcard} from "./Flashcard";
import {AnswerWas, chooseNextCard, Quiz} from "../model/Quiz";
import {uuid} from "@supabase/supabase-js/dist/main/lib/helpers";
import {Auth} from "@supabase/auth-ui-react";
import EmptyView from "./atoms/EmptyView";
import Typography from "@mui/material/Typography";
import useUser = Auth.useUser;

export function QuizPage() {
    const navigate = useNavigate();
    const user = useUser();
    const {cardset} = useLoaderData() as { cardset: Cardset };
    const [card, setCard] = useState<CardsetCard | null>();
    const [answeredCards, setAnsweredCards] = useState<CardsetCard[]>([]);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(5);
    const [answers, setAnswers] = useState<Set<Quiz>>(new Set());

    const respond = (answerWas: AnswerWas) => {
        if (card) {
            const quiz = card.quiz?.at(0) ?? {
                id: uuid(),
                card_id: card.id,
                user_id: user!!.user!!.id,
                answers_were: []
            };

            // @ts-ignore ignore probably non-existing field created_at
            delete quiz["created_at"];

            // only allow 10 last answers in there
            quiz.answers_were = [...quiz.answers_were, answerWas].slice(-10);
            card.quiz = [quiz];

            setAnsweredCards([...answeredCards, card])
            setAnswers(new  Set([...answers, quiz]))
        }
    }

    useEffect(() => {
        if (cardset.cards) {
            setCard(chooseNextCard(cardset.cards, answeredCards));
            setProgress((100 / cardset.cards.length) * answeredCards.length);
            setIsFlipped(false);
        }
    }, [cardset, answeredCards]);

    useEffect(() => {
        if (card === null && answers.size > 0) {
            saveQuizzes(answers)
        }
    }, [card, answers]);

    // TODO: implement if a user took too long to answer!

    const quizFinished = <React.Fragment>
        <Grid container direction="column" alignContent="center">
            <Typography variant="caption" color="text.secondary" sx={{textAlign: "center"}}>Finished!</Typography>
            <Button variant="contained" onClick={() => navigate("/cardsets/" + cardset.id)} sx={{marginTop: "20px"}}>go
                back</Button>
        </Grid>
    </React.Fragment>

    return (<React.Fragment>
        <PageHeader title={"Quiz: " + cardset.name}/>

        <Grid container direction="column" sx={{padding: '20px'}} flex={10}>
            <EmptyView checkItems={card} emptyContent={quizFinished}>
                <Grid container item direction="column" justifyContent="space-between" flex={1}>
                    <Grid container item direction="column" alignItems="center" spacing={10}>
                        <Grid container item justifyContent="center" spacing={5}>
                            <Grid item xs={6}>
                                {card ? <Flashcard key={card.id} card={card}
                                                   onFlipped={(flipped) => setIsFlipped(flipped)}/> : null}
                            </Grid>
                        </Grid>

                        {isFlipped ? <Grid container item spacing={5} justifyContent="center">
                            <Grid item>
                                <Button variant="contained" color="error" size="large"
                                        onClick={() => respond('incorrect')}>wrong</Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="success" size="large"
                                        onClick={() => respond('correct')}>right</Button>
                            </Grid>
                        </Grid> : <Grid item>
                            <Button variant="outlined" size="large" onClick={() => respond('skipped')}>skip</Button>
                        </Grid>}
                    </Grid>

                    <LinearProgress variant="determinate" value={progress} />
                </Grid>
            </EmptyView>
        </Grid>
    </React.Fragment>);
}
