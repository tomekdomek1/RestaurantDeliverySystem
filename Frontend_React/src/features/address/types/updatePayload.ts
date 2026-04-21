import type { Guid } from "./guid";

export interface UpdatePayload<TPayload> {
    id: Guid;
    data: TPayload;
}