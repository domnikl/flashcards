export type Card = {
    readonly id: string;
    readonly question: string;
    readonly answer: string;
    readonly context: string | null;
    readonly cardset_id: string;
    readonly is_deleted: boolean;
}
