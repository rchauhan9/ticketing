import { Subjects } from "./types/subjects";

export interface Event {
    subject: Subjects;
    data: any;
}