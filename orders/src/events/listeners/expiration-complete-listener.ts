import { Message} from 'node-nats-streaming';
import {ExpirationCompleteEvent, Listener, OrderStatus, Subjects} from "@rc-tickets/common";
import {ordersService} from "./queue-group-name";

import { Order } from "../../models/order";
import {OrderCancelledPublisher} from "../publishers/order-cancelled-publisher";
import {natsWrapper} from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = ordersService;

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');
        if (!order) {
            throw new Error('Order not found');
        }

        order.set({
            status: OrderStatus.Cancelled
        });

        await order!.save();
        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            ticket: {
                id: order.ticket.id
            },
            version: order.version
        });

        msg.ack();
    }

}