import {Publisher, Subjects, TicketUpdatedEvent} from "@rc-tickets/common";
import {natsWrapper} from "../../nats-wrapper";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: "",
    price: 0,
    title: "",
    userId: "",
    version: 0,
    orderId: ""
})