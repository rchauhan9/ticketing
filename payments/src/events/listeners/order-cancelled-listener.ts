import {Message} from 'node-nats-streaming';
import {Listener, OrderCancelledEvent, Subjects} from "@rc-tickets/common";
import {paymentsService} from "./queue-group-name";
import {Order} from "../../models/order";
import {OrderStatus} from "../../../../common/src";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = paymentsService;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        msg.ack();
    }

}