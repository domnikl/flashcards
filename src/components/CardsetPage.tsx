import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";
import { Box, Button, Card, Container, Fab } from "@mui/material";
import { Add, Delete, Edit, PlayArrow } from "@mui/icons-material";
import { Params, useLoaderData, useNavigate } from "react-router-dom";
import { Cardset } from "../model/Cardset";
import { findCardsetById, saveCardset } from "../supabase";
import { useQueryClient } from "@tanstack/react-query";
import EmptyView from "./atoms/EmptyView";
import { PageHeader } from "./PageHeader";
import { Auth } from "@supabase/auth-ui-react";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import Tooltip from "@mui/material/Tooltip";
import { Flashcard } from "./Flashcard";
import useUser = Auth.useUser;

export async function cardsetLoader({
  params,
}: {
  params: Params;
}): Promise<{ cardset: Cardset | null } | Response | null> {
  if (!params.cardsetId) {
    return new Response("Not Found", { status: 404 });
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (
    { cardset: await findCardsetById(params.cardsetId) } ??
    new Response("Not Found", { status: 404 })
  );
}

export function CardsetPage() {
  const { cardset } = useLoaderData() as { cardset: Cardset };
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useUser();

  const handleDelete = () => {
    if (window.confirm("Are you sure? This can not be reverted.")) {
      cardset.is_deleted = true;
      delete cardset.cards;

      saveCardset(cardset, user!!.user!!.id)
        .then(() => queryClient.invalidateQueries({ queryKey: ["cards"] }))
        .then(() => navigate("/cardsets"));
    }
  };

  const handleEdit = () => {
    navigate("/cardsets/" + cardset.id + "/edit");
  };

  const navigateToCreate = () =>
    navigate("/cardsets/" + cardset.id + "/cards/create", { replace: true });

  const emptyView = (
    <React.Fragment>
      <Grid container direction="column" alignContent="center">
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          You don't have any cards in here yet.
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          Fancy creating your first one?
        </Typography>

        <Button
          variant="outlined"
          onClick={navigateToCreate}
          sx={{ marginTop: "20px" }}
        >
          add a card
        </Button>
      </Grid>
    </React.Fragment>
  );

  const actions = (
    <React.Fragment>
      <Grid container>
        <Button onClick={() => handleEdit()}>
          <Edit />
        </Button>
        <Button onClick={() => handleDelete()}>
          <Delete />
        </Button>
        <Tooltip title="Help">
          <IconButton color="inherit">
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <PageHeader title={cardset.name} actions={actions} />

      <Container sx={{ padding: "20px" }}>
        <EmptyView checkItems={cardset.cards} emptyContent={emptyView}>
          <Box
            sx={{
              columnCount: "auto",
              columnWidth: "300px",
              columnFill: "balance",
            }}
          >
            <Box
              sx={{
                display: "inline-block",
                width: "100%",
                paddingBottom: "10px",
              }}
            >
              <Card>
                <Button
                  sx={{ height: "100px" }}
                  fullWidth
                  color="inherit"
                  onClick={navigateToCreate}
                >
                  <Add />
                </Button>
              </Card>
            </Box>

            {cardset.cards?.map((card) => (
              <Box
                key={card.id}
                sx={{
                  display: "inline-block",
                  width: "100%",
                  paddingBottom: "10px",
                }}
              >
                <Flashcard
                  card={card}
                  actionsFront={
                    <IconButton
                      onClick={() =>
                        navigate(
                          "/cardsets/" +
                            cardset.id +
                            "/cards/" +
                            card.id +
                            "/edit"
                        )
                      }
                    >
                      <Edit />
                    </IconButton>
                  }
                  actionsBack={
                    <IconButton
                      onClick={() =>
                        navigate(
                          "/cardsets/" +
                            cardset.id +
                            "/cards/" +
                            card.id +
                            "/edit"
                        )
                      }
                    >
                      <Edit />
                    </IconButton>
                  }
                />
              </Box>
            ))}
          </Box>
        </EmptyView>
      </Container>

      <Fab
        sx={{ position: "fixed", bottom: 32, right: 32 }}
        color="primary"
        aria-label="add"
        onClick={() => navigate("/cardsets/" + cardset.id + "/quiz")}
      >
        <PlayArrow />
      </Fab>
    </React.Fragment>
  );
}
