import { createClient, User } from "@supabase/supabase-js";
import { Cardset } from "./model/Cardset";
import { Card } from "./model/Card";
import { Quiz } from "./model/Quiz";

const supabaseUrl = "https://fsexihplnswtlgywhxkp.supabase.co";
// @ts-ignore
const supabaseKey = window.__env__.REACT_APP_SUPABASE_KEY!!;
export const supabase = createClient(supabaseUrl, supabaseKey);

// TODO: better error handling for all queries

export async function findAllCardsetsByUser(
  user: User | null
): Promise<Array<Cardset>> {
  return supabase
    .from("cardsets")
    .select()
    .eq("user_id", user?.id)
    .eq("is_deleted", false)
    .then(({ data }) => {
      return data!! as Cardset[];
    });
}

export async function findCardsetById(id: string): Promise<Cardset | null> {
  return supabase
    .from("cardsets")
    .select(`id, name, is_deleted, image_url, user_id, cards (*, quiz (*))`)
    .eq("id", id)
    .eq("is_deleted", false)
    .eq("cards.is_deleted", false)
    .then(({ data }) => {
      return (data?.at(0) ?? null) as Cardset | null;
    });
}

export async function findCardById(id: string): Promise<Card | null> {
  return supabase
    .from("cards")
    .select()
    .eq("id", id)
    .eq("is_deleted", false)
    .then(({ data }) => {
      return (data?.at(0) ?? null) as Card | null;
    });
}

export async function saveCardset(cardset: Cardset, user_id: string) {
  return supabase
    .from("cardsets")
    .upsert([{ ...cardset, user_id: user_id }])
    .select()
    .then(({ data }) => {
      return data!! as Cardset[] | null;
    });
}

export async function saveCard(card: Card) {
  return supabase
    .from("cards")
    .upsert([{ ...card }])
    .select()
    .then(({ data }) => {
      return data!! as Card[] | null;
    });
}

export async function saveQuizzes(quizzes: Set<Quiz>) {
  return supabase
    .from("quiz")
    .upsert([...quizzes])
    .select()
    .then(({ data }) => {
      return data!! as Card[] | null;
    });
}
