import {Card, successRate} from "./Card";

export type AnswerWas = "correct" | "incorrect" | "too late" | "skipped";

export type Quiz = {
    readonly id: string;
    readonly card_id: string;
    readonly user_id: string;
    answers_were: AnswerWas[];
}

export function chooseNextCard(cards: Card[], answered: Card[]): Card | null {
    // the quiz is over, no next card available
    if (answered.length >= cards.length) {
        return null;
    }

    let available: Card[] = [];
    const lastAnswered = answered[answered.length - 1];
    const cardsWithoutLast = cards.filter(card => card !== lastAnswered);
    const probability = Math.floor(Math.random() * 100);

    // 90% chance for new cards
    if (probability <= 90) {
        available = cardsWithoutLast.filter((card) => successRate(card) === null)
    }

    // 10% chance to answer a card again which has been answered right only <=20% of the time
    if (available.length === 0 && probability <= 10) {
        available = cardsWithoutLast.filter((card) => successRate(card) ?? 100 <= 20)
    }

    if (available.length === 0) {
        // just choose a random card
        available = cardsWithoutLast.filter(value => !answered.includes(value));
    }

    return available[Math.floor(Math.random()) * available.length];
}
