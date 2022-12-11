import {Quiz} from "./Quiz";

export type Card = {
    readonly id: string;
    readonly question: string;
    readonly answer: string;
    readonly cardset_id: string;
    readonly is_deleted: boolean;
    readonly user_id: string;
    quiz?: Quiz[];
}

export function successRate(card: Card): number | null {
    if (!card.quiz || card.quiz.length === 0) {
        return null;
    }

    const correct = card.quiz[0].answers_were.filter(x => x === "correct").length
    return (100 / card.quiz[0].answers_were.length) * correct
}
