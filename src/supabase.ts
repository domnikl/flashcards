import {createClient, User} from '@supabase/supabase-js'
import {Cardset} from "./model/Cardset";
import {Card} from "./model/Card";
import {Quiz} from "./model/Quiz";

const supabaseUrl = 'https://fsexihplnswtlgywhxkp.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY!!
export const supabase = createClient(supabaseUrl, supabaseKey)

// TODO: better error handling for all queries

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

export async function findCardsetById(id: string): Promise<Cardset | null> {
    return supabase
        .from("cardsets")
        .select(`id, name, is_deleted, image_url, user_id, cards (*)`)
        .eq("id", id)
        .eq("is_deleted", false)
        .eq("cards.is_deleted", false)
        .then(({data}: { data: Cardset[] | null }) => {
            console.log(data);

            return data?.at(0) ?? null;
        });
}

export async function findCardById(id: string): Promise<Card | null> {
    return supabase
        .from("cards")
        .select()
        .eq("id", id)
        .eq("is_deleted", false)
        .then(({data}: { data: Card[] | null }) => {
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

export async function saveCard(card: Card) {
    return supabase
        .from("cards")
        .upsert([{...card}])
        .select()
        .then(({data}: { data: Card[] | null }) => {
            return data!!;
        });
}

export async function findQuizzesByUserId(user_id: string): Promise<Quiz[]> {
    return supabase
        .from("quiz")
        .select()
        .eq("user_id", user_id)
        .then(({data}: { data: Quiz[] | null }) => {
            return data ?? [];
        });
}

export async function saveQuiz(quiz: Quiz) {
    return supabase
        .from("quiz")
        .upsert([{...quiz}])
        .select()
        .then(({data}: { data: Card[] | null }) => {
            return data!!;
        });
}
