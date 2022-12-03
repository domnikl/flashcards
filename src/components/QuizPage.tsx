import React, {useEffect, useState} from "react";
import {Button, Container} from "@mui/material";
import {useLoaderData} from "react-router-dom";
import {PageHeader} from "./PageHeader";
import IsLoading from "./atoms/IsLoading";
import Grid from "@mui/material/Grid";
import {useQuery} from "react-query";
import {findAllCardsByCardset, findQuizzesByUserId, saveQuiz} from "../supabase";
import {Card as CardsetCard} from "../model/Card";
import {Cardset} from "../model/Cardset";
import {Flashcard} from "./Flashcard";
import {AnswerWas, Quiz} from "../model/Quiz";
import {uuid} from "@supabase/supabase-js/dist/main/lib/helpers";
import {Auth} from "@supabase/auth-ui-react";
import useUser = Auth.useUser;

export function QuizPage() {
    const user = useUser();
    const cardset = useLoaderData() as Cardset;
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

            quiz.answers_were = [...quiz.answers_were, answerWas];

            saveQuiz(quiz).then(() => setAnsweredCards([...answeredCards, card]))
        }
    }

    useEffect(() => {
        if (cards) {
            const available = cards.filter(value => !answeredCards.includes(value));
            // TODO: what if there is nothing left?

            // TODO: implement more sophisticated algorithm for choosing cards
            setCard(available[Math.floor(Math.random() * available.length)]);
            setIsFlipped(false);
        }
    }, [cards, answeredCards]);

    // TODO: implement if a user took too long to answer

    return (<React.Fragment>
        <PageHeader title={"Quiz: " + cardset.name}/>

        <Container sx={{padding: '20px'}}>
            <IsLoading isFetching={isLoading || isLoadingQuizzes}>
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
            </IsLoading>
        </Container>
    </React.Fragment>);
}
