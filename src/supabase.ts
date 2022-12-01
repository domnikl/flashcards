import {createClient, PostgrestError, User} from '@supabase/supabase-js'
import {Cardset} from "./model/Cardset";

const supabaseUrl = 'https://fsexihplnswtlgywhxkp.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY!!
export const supabase = createClient(supabaseUrl, supabaseKey)

export async function findAllCardsetsByUser(user: User | null): Promise<Array<Cardset>> {
    return supabase
        .from("cardsets")
        .select()
        .eq("user_id", user?.id)
        .then(({data, error}: { data: Cardset[] | null, error: PostgrestError | null }) => {
            // TODO: error handling!
            if (error != null) {
                throw error;
            }

            return data!!
        });
}

export async function saveCardset(cardset: Cardset, user_id: string) {
    return supabase
        .from("cardsets")
        .upsert([{...cardset, user_id: user_id}])
        .select()
        .then(({data, error}: { data: Cardset[] | null, error: PostgrestError | null }) => {
            if (error != null) {
                throw error;
            }

            return data!!;
        });
}
