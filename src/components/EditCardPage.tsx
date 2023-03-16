import React, {useState} from "react";
import {Button, Container, Grid, Popover, TextField, Typography} from "@mui/material";
import {Auth} from "@supabase/auth-ui-react";
import {findCardById, saveCard} from "../supabase";
import {uuid} from "@supabase/supabase-js/dist/main/lib/helpers";
import {useQueryClient} from "@tanstack/react-query";
import {Card} from "../model/Card";
import {Params, useLoaderData, useNavigate} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {PageHeader} from "./PageHeader";
import {Cardset} from "../model/Cardset";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
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
        }
    });

    const onSubmit = ({question, answer}: { question: string, answer: string }) => {
        const updated: Card = {
            ...card,
            id: id,
            question: question,
            answer: answer,
            cardset_id: cardsetId ?? "",
            is_deleted: false,
            user_id: user!!.user!!.id,
        }

        // TODO: what if supabase has an error?

        if (user?.user) {
            saveCard(updated).then((c) => {
                if (c) {
                    setId(c[0].id);

                    queryClient.invalidateQueries({queryKey: ['cards']}).then(() => {
                        navigate("/cardsets/" + cardsetId)
                    })
                }
            })
        }
    }

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? 'simple-popover' : undefined;

    const actions = <React.Fragment>
        <Grid container>
            <Tooltip title="Help">
                <IconButton color="inherit" onClick={handleClick}>
                    <HelpIcon/>
                </IconButton>

            </Tooltip>
            <Popover
                id={popoverId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{p: 2}}>Add a question and an answer to the question. You can even use markdown
                    to format your cards!</Typography>
            </Popover>
        </Grid>
    </React.Fragment>

    return <React.Fragment>
        <PageHeader title={(!card ? "Create" : "Edit") + " card"} actions={actions}/>

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
                            multiline
                            rows={3}
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
                            multiline
                            rows={3}
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
