import {ExpirationCompleteEvent, Publisher, Subjects} from "@rc-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}