import React, {useEffect, useState} from 'react';
import './App.css';
import {ThemeProvider} from "@mui/material";
import {theme} from "./Theme";
import {Main} from "./components/Main";
import {Login} from "./components/Login";
import {Auth} from "@supabase/auth-ui-react";
import {supabase} from "./supabase";
import {User} from "@supabase/supabase-js";
import {QueryClient, QueryClientProvider} from "react-query";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {CardsetsPage} from "./components/CardsetsPage";
import ErrorPage from "./components/ErrorPage";
import {EditCardsetPage} from "./components/EditCardsetPage";
import UserContextProvider = Auth.UserContextProvider;

const queryClient = new QueryClient();

function App() {
    const [user, setUser] = useState<undefined | User>();

    useEffect(() => {
        supabase.auth.getSession().then((x) => {
            setUser(x.data.session?.user)
        })
    }, []);

    const router = createBrowserRouter([
        {
            path: "/",
            element: user ? <Main/> : <Login/>,
            errorElement: <ErrorPage/>,
            children: [
                {
                    index: true,
                    element: <CardsetsPage/>
                },
                {
                    path: "cardsets",
                    element: <CardsetsPage/>
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
