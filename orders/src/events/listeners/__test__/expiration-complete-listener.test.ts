import {Message} from 'node-nats-streaming';
import mongoose from "mongoose";
import {OrderStatus, ExpirationCompleteEvent} from "@rc-tickets/common";

import {ExpirationCompleteListener} from "../expiration-complete-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {Order} from "../../../models/order";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticketId = mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        id: ticketId,
        price: 20,
        title: "concert"
    });
    await ticket.save();

    const order = Order.build({
        expiresAt: new Date(),
        status: OrderStatus.Created,
        ticket: ticket,
        userId: mongoose.Types.ObjectId().toHexString()
    });

    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, order, data, msg };

}

it('updates the order status to cancelled', async () => {
    const { listener, order, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
    const { listener, order, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});