import React, {ReactNode, useState} from "react";
import {Card as CardsetCard} from "../model/Card";
import {Card, CardActionArea, CardActions, CardContent, Grid, SxProps, Theme} from "@mui/material";
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

    let cardContentSx: SxProps<Theme> = {
        cursor: "pointer",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        position: 'absolute',
        width: '100%',
    }

    let cardInnerSx: SxProps<Theme> = {}

    if (isFlipped) {
        cardInnerSx = {...cardInnerSx, transform: 'rotateY(180deg)'}
    }

    return <Grid container sx={{minHeight: '100px', perspective: '1000px'}}>
        <Grid container sx={{
            position: 'relative',
            width: '100%',
            transition: 'transform 0.8s',
            transformStyle: 'preserve-3d',
            ...cardInnerSx
        }}>
            <Card sx={{...cardContentSx}}>
                <CardActionArea onClick={() => flip()}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            {props.card.question}
                        </Typography>
                        <Typography variant="handwriting" sx={{fontSize: '1em'}} color="text.secondary"
                                    gutterBottom>
                            {props.card.context}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                {props.actionsFront ? <CardActions>
                    <Grid container direction="row" justifyContent="end">
                        {props.actionsFront}
                    </Grid>
                </CardActions> : null}
            </Card>
            <Card sx={{...cardContentSx, transform: 'rotateY(180deg)', backgroundColor: "primary.dark"}}>
                <CardActionArea onClick={() => flip()}>
                    <CardContent>
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
                </CardActionArea>
                {props.actionsBack ? <CardActions>
                    <Grid container direction="row" justifyContent="end">
                        {props.actionsBack}
                    </Grid>
                </CardActions> : null}
            </Card>
        </Grid>
    </Grid>;
}
