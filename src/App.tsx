import React, {useEffect, useState} from 'react';
import './App.css';
import {ThemeProvider} from "@mui/material";
import {theme} from "./Theme";
import {Main} from "./components/Main";
import {Login} from "./components/Login";
import {Auth} from "@supabase/auth-ui-react";
import {supabase} from "./supabase";
import {User} from "@supabase/supabase-js";
import UserContextProvider = Auth.UserContextProvider;

function App() {
    const [user, setUser] = useState<undefined | User>();

    useEffect(() => {
        supabase.auth.getSession().then((x) => {
            setUser(x.data.session?.user)
        })
    }, []);

    return (
        <UserContextProvider supabaseClient={supabase}>
            <ThemeProvider theme={theme}>
                {user ? <Main/> : <Login/>}
            </ThemeProvider>
        </UserContextProvider>
    );
}

export default App;
