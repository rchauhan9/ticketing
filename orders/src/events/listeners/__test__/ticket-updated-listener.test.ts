import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from "../../../nats-wrapper";
import {TicketUpdatedEvent} from "@rc-tickets/common";
import {Ticket} from "../../../models/ticket";
import {TicketUpdatedListener} from "../ticket-updated-listener";

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 20,
        title: "concert"
    });
    await ticket.save();

    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'concert edited',
        price: 15,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    };

    return { listener, data, ticket, message };
}

it('finds, updates and saves a ticket', async () => {
    const { listener, data, ticket, message } = await setup();

    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
    const { listener, data, message } = await setup();

    data.version = 10;
    try {
        await listener.onMessage(data, message);
    } catch (err) {}

    expect(message.ack).not.toHaveBeenCalled();
});