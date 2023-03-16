import React, {useEffect, useState} from 'react';
import './App.css';
import {ThemeProvider} from "@mui/material";
import {theme} from "./Theme";
import {Main} from "./components/Main";
import {Login} from "./components/Login";
import {Auth} from "@supabase/auth-ui-react";
import {supabase} from "./supabase";
import {User} from "@supabase/supabase-js";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createHashRouter, RouterProvider} from "react-router-dom";
import {CardsetsOverviewPage} from "./components/CardsetsOverviewPage";
import ErrorPage from "./components/ErrorPage";
import {EditCardsetPage} from "./components/EditCardsetPage";
import {cardsetLoader, CardsetPage} from "./components/CardsetPage";
import {cardLoader, EditCardPage} from "./components/EditCardPage";
import {QuizPage} from "./components/QuizPage";
import UserContextProvider = Auth.UserContextProvider;

const queryClient = new QueryClient();

function App() {
    const [user, setUser] = useState<undefined | User>();

    useEffect(() => {
        supabase.auth.getSession().then((x) => {
            setUser(x.data.session?.user)
        })
    }, []);

    const router = createHashRouter([
        {
            path: "/",
            element: user ? <Main/> : <Login/>,
            errorElement: <ErrorPage/>,
            children: [
                {
                    index: true,
                    element: <CardsetsOverviewPage/>
                },
                {
                    path: "cardsets/:cardsetId/cards/create",
                    element: <EditCardPage/>,
                    loader: cardsetLoader
                },
                {
                    path: "cardsets/:cardsetId/cards/:cardId/edit",
                    element: <EditCardPage/>,
                    loader: cardLoader
                },
                {
                    path: "cardsets/:cardsetId/edit",
                    element: <EditCardsetPage/>,
                    loader: cardsetLoader
                },
                {
                    path: "cardsets/:cardsetId/quiz",
                    element: <QuizPage/>,
                    loader: cardsetLoader
                },
                {
                    path: "cardsets/:cardsetId",
                    element: <CardsetPage/>,
                    loader: cardsetLoader
                },
                {
                    path: "cardsets",
                    element: <CardsetsOverviewPage/>
                },
                {
                    path: "cardsets/create",
                    element: <EditCardsetPage/>
                }
            ]
        }
    ]);

    return (
        <UserContextProvider supabaseClient={supabase}>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router}/>
                </QueryClientProvider>
            </ThemeProvider>
        </UserContextProvider>
    );
}

export default App;
