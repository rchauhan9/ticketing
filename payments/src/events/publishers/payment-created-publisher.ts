import {PaymentCreatedEvent, Publisher, Subjects} from "@rc-tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
};