import React, {useState} from "react";
import {Card as CardsetCard} from "../model/Card";
import {Card, CardContent, Grid, SxProps, Theme} from "@mui/material";
import Typography from "@mui/material/Typography";

export type FlashcardProps = {
    card: CardsetCard
    onFlipped?: (isFlipped: boolean) => void;
}

export function Flashcard(props: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState<boolean>(false);

    const flip = () => {
        setIsFlipped(!isFlipped);
        props.onFlipped?.apply(null, [!isFlipped]);
    }

    let cardSx: SxProps<Theme> = {
        perspective: '1000px',
    }

    let cardContentSx: SxProps<Theme> = {
        cursor: "pointer",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        position: 'absolute',
        width: '100%',
        height: '100%',
    }

    let cardInnerSx: SxProps<Theme> = {}

    if (isFlipped) {
        cardInnerSx = {...cardInnerSx, transform: 'rotateY(180deg)'}
    }

    return <Card sx={{minHeight: '100px', ...cardSx}}>
        <Grid container sx={{
            position: 'relative',
            width: '100%',
            height: '100px',
            transition: 'transform 0.8s',
            transformStyle: 'preserve-3d',
            ...cardInnerSx
        }}>
            <CardContent onClick={() => flip()} sx={{...cardContentSx}}>
                <Typography variant="h6" component="div">
                    {props.card.question}
                </Typography>
                <Typography variant="handwriting" sx={{fontSize: '1em'}} color="text.secondary"
                            gutterBottom>
                    {props.card.context}
                </Typography>
            </CardContent>
            <CardContent onClick={() => flip()}
                         sx={{...cardContentSx, transform: 'rotateY(180deg)', backgroundColor: "primary.dark"}}>
                <Typography variant="caption" component="div" color="text.secondary"
                            sx={{whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
                    {props.card.question}
                </Typography>
                <Typography variant="h6" component="div">
                    {props.card.answer}
                </Typography>
                <Typography variant="handwriting" sx={{fontSize: '1em'}} color="text.secondary"
                            gutterBottom>
                    {props.card.context}
                </Typography>
            </CardContent>
        </Grid>
    </Card>;
}
