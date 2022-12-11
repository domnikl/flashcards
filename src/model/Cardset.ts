import {Card} from "./Card";

export type Cardset = {
    readonly id: string;
    readonly name: string;
    readonly image_url: string | null;
    is_deleted: boolean;
    cards?: Card[];
}
