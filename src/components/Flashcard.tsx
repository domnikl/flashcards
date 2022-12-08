import React, {ReactNode, useState} from "react";
import {Card as CardsetCard} from "../model/Card";
import {Box, Card, CardActionArea, CardActions, CardContent, Grid, SxProps, Theme} from "@mui/material";
import Typography from "@mui/material/Typography";

export type FlashcardProps = {
    card: CardsetCard
    onFlipped?: (isFlipped: boolean) => void;
    actionsFront?: ReactNode;
    actionsBack?: ReactNode;
}

export function Flashcard(props: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState<boolean>(false);

    const flip = () => {
        setIsFlipped(!isFlipped);
        props.onFlipped?.apply(null, [!isFlipped]);
    }

    let cardSx: SxProps<Theme> = {
        cursor: "pointer",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        width: '100%',
        height: '100%',
        gridColumn: '1 / 1',
        gridRow: '1 / 1',
    }

    let cardInnerSx: SxProps<Theme> = {}

    if (isFlipped) {
        cardInnerSx = {...cardInnerSx, transform: 'rotateY(180deg)'}
    }

    return <Box sx={{perspective: '1000px', display: 'flex'}}>
        <Box sx={{
            width: '100%',
            transition: 'transform 0.8s',
            transformStyle: 'preserve-3d',
            display: 'grid',
            gridTemplate: '1fr / 1fr',
            placeItems: 'center',
            ...cardInnerSx
        }}>
            <Card
                sx={{...cardSx, zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <CardActionArea onClick={() => flip()} sx={{height: '100%', verticalAlign: 'top'}}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            {props.card.question}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                {props.actionsFront ? <CardActions>
                    <Grid container direction="row" justifyContent="end">
                        {props.actionsFront}
                    </Grid>
                </CardActions> : null}
            </Card>

            <Card sx={{
                ...cardSx,
                transform: 'rotateY(180deg)',
                backgroundColor: "primary.dark",
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <CardActionArea onClick={() => flip()} sx={{height: '100%', verticalAlign: 'top'}}>
                    <CardContent>
                        <Typography variant="caption" component="div" color="text.secondary"
                                    sx={{whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
                            {props.card.question}
                        </Typography>
                        <Typography variant="h6" component="div">
                            {props.card.answer}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                {props.actionsBack ? <CardActions>
                    <Grid container direction="row" justifyContent="end">
                        {props.actionsBack}
                    </Grid>
                </CardActions> : null}
            </Card>
        </Box>
    </Box>;
}
