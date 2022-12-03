export type AnswerWas = "correct" | "incorrect" | "too late" | "skipped";

export type Quiz = {
    readonly id: string;
    readonly card_id: string;
    readonly user_id: string;
    answers_were: AnswerWas[];
}
