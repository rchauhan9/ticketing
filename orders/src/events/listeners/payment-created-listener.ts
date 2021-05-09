import {Listener, PaymentCreatedEvent, Subjects, OrderStatus} from "@rc-tickets/common";
import { Message } from 'node-nats-streaming';
import {ordersService} from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = ordersService;

    async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        order.set({status: OrderStatus.Complete});
        order.save();

        msg.ack();
    }

}