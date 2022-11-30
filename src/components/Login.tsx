import {supabase} from "../supabase";
import {Auth, ThemeSupa} from "@supabase/auth-ui-react";
import React from "react";
import {theme} from "../Theme";

export function Login() {
    return <Auth supabaseClient={supabase}
                 appearance={{
                     theme: ThemeSupa,
                     variables: {
                         default: {
                             colors: {
                                 brand: theme.palette.primary.main,
                                 brandAccent: theme.palette.success.main
                             }
                         }
                     }
                 }}
                 theme="dark"
                 onlyThirdPartyProviders
                 providers={["github"]}
    ></Auth>
}
