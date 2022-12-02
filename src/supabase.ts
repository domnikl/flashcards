import {createClient, User} from '@supabase/supabase-js'
import {Cardset} from "./model/Cardset";
import {Card} from "./model/Card";

const supabaseUrl = 'https://fsexihplnswtlgywhxkp.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY!!
export const supabase = createClient(supabaseUrl, supabaseKey)

// TODO: better error handling for all queries

export async function findAllCardsByCardset(cardset: Cardset): Promise<Array<Card>> {
    return supabase
        .from("cards")
        .select()
        .eq("cardset_id", cardset?.id)
        .eq("is_deleted", false)
        .then(({data}: { data: Card[] | null }) => {
            return data!!
        });
}

export async function findAllCardsetsByUser(user: User | null): Promise<Array<Cardset>> {
    return supabase
        .from("cardsets")
        .select()
        .eq("user_id", user?.id)
        .eq("is_deleted", false)
        .then(({data}: { data: Cardset[] | null }) => {
            return data!!
        });
}

export async function findCardsetById(id: string): Promise<Cardset|null> {
    return supabase
        .from("cardsets")
        .select()
        .eq("id", id)
        .eq("is_deleted", false)
        .then(({data}: { data: Cardset[] | null }) => {
            return data?.at(0) ?? null;
        });
}

export async function saveCardset(cardset: Cardset, user_id: string) {
    return supabase
        .from("cardsets")
        .upsert([{...cardset, user_id: user_id}])
        .select()
        .then(({data}: { data: Cardset[] | null }) => {
            return data!!;
        });
}


export async function saveCard(card: Card, user_id: string) {
    return supabase
        .from("cards")
        .upsert([{...card, user_id: user_id}])
        .select()
        .then(({data}: { data: Card[] | null }) => {
            return data!!;
        });
}

export async function useCardset(id: string|undefined): Promise<Cardset|null> {
    return id ? await findCardsetById(id) ?? null : null;
}
