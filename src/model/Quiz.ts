import {Card} from "./Card";

export type AnswerWas = "correct" | "incorrect" | "too late" | "skipped";

export type Quiz = {
    readonly id: string;
    readonly card_id: string;
    readonly user_id: string;
    answers_were: AnswerWas[];
}

export function chooseNextCard(cards: Card[], answered: Card[]): Card {
    // TODO: implement more sophisticated algorithm for choosing cards
    // TODO: repeat some cards if they were answered wrongly
    const available = cards.filter(value => !answered.includes(value));
    const cardSelected = available[Math.floor(Math.random())];

    
    return cardSelected;
}
