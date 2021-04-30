import {OrderCreatedEvent, Publisher, Subjects} from "@rc-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}