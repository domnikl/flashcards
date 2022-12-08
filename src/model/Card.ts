export type Card = {
    readonly id: string;
    readonly question: string;
    readonly answer: string;
    readonly cardset_id: string;
    readonly is_deleted: boolean;
    readonly user_id: string;
}
