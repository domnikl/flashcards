import {supabase} from "../supabase";
import {Auth} from "@supabase/auth-ui-react";
import {theme} from "../Theme";

export function Login() {
    return <Auth supabaseClient={supabase}
                 appearance={{
                     variables: {
                         default: {
                             colors: {
                                 brand: theme.palette.primary.main,
                                 brandAccent: theme.palette.success.main
                             }
                         }
                     }
                 }}
                 onlyThirdPartyProviders
                 providers={["github"]}
    ></Auth>
}
