import React, {useEffect, useState} from "react";
import {Button, Container} from "@mui/material";
import {useLoaderData, useNavigate} from "react-router-dom";
import {PageHeader} from "./PageHeader";
import IsLoading from "./atoms/IsLoading";
import Grid from "@mui/material/Grid";
import {useQuery} from "react-query";
import {findAllCardsByCardset, findQuizzesByUserId, saveQuiz} from "../supabase";
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

    // @ts-ignore
    const {
        data: cards,
        isLoading
    } = useQuery<CardsetCard[]>(['cards'], () => findAllCardsByCardset(cardset));

    // @ts-ignore
    const {
        data: quizzes,
        isLoading: isLoadingQuizzes
    } = useQuery<Quiz[]>(['quizzes'], () => findQuizzesByUserId(user!!.user!!.id));

    const respond = (answerWas: AnswerWas) => {
        if (card && cards) {
            const quiz = quizzes?.filter(quiz => quiz.card_id === card.id)?.at(0) ?? {
                id: uuid(),
                card_id: card.id,
                user_id: user!!.user!!.id,
                answers_were: []
            };

            // only allow 10 last answers in there
            quiz.answers_were = [...quiz.answers_were, answerWas].slice(-10);

            saveQuiz(quiz).then(() => setAnsweredCards([...answeredCards, card]))
        }
    }

    useEffect(() => {
        if (cards) {
            setCard(chooseNextCard(cards, answeredCards));
            setIsFlipped(false);
        }
    }, [cards, answeredCards]);

    // TODO: implement if a user took too long to answer

    const quizFinished = <React.Fragment>
        <Grid container direction="column" alignContent="center">
            <Typography variant="caption" color="text.secondary" sx={{textAlign: "center"}}>Finished!</Typography>
            <Button variant="contained" onClick={() => navigate("/cardsets/" + cardset.id)} sx={{marginTop: "20px"}}>go
                back</Button>
        </Grid>
    </React.Fragment>

    return (<React.Fragment>
        <PageHeader title={"Quiz: " + cardset.name}/>

        <Container sx={{padding: '20px'}}>
            <IsLoading isFetching={isLoading || isLoadingQuizzes}>
                <EmptyView checkItems={card} emptyContent={quizFinished}>
                    <Grid container direction="column" alignItems="center" spacing={10}>
                        <Grid container item xs={12} justifyContent="center">
                            <Grid item xs={6}>
                                {card ? <Flashcard key={card.id} card={card}
                                                   onFlipped={(flipped) => setIsFlipped(flipped)}/> : null}
                            </Grid>
                        </Grid>
                        {isFlipped ? <Grid container item xs={6} spacing={5} justifyContent="center">
                            <Grid item>
                                <Button variant="contained" color="error"
                                        onClick={() => respond('incorrect')}>wrong</Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="success"
                                        onClick={() => respond('correct')}>right</Button>
                            </Grid>
                        </Grid> : <Grid item xs={6}>
                            <Button variant="outlined" onClick={() => respond('skipped')}>skip</Button>
                        </Grid>}
                    </Grid>
                </EmptyView>
            </IsLoading>
        </Container>
    </React.Fragment>);
}
