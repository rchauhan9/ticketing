import { Message } from 'node-nats-streaming';
import {Listener, OrderCreatedEvent, Subjects} from "@rc-tickets/common";
import {expirationService} from "./queue-group-name";
import {expirationQueue} from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = expirationService;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('Waiting this many ms to process job:', delay)
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay: delay,
        });

        msg.ack();
    }

}