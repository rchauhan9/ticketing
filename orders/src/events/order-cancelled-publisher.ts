import {OrderCancelledEvent, Publisher, Subjects} from "@rc-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}