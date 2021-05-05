import {Message} from 'node-nats-streaming';
import {Listener, Subjects, TicketUpdatedEvent} from "@rc-tickets/common";
import {ordersService} from "./queue-group-name";
import {Ticket} from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {

    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName: string = ordersService;

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        const { title, price } = data
        const ticket = await Ticket.findByEvent(data);
        if (!ticket) {
            throw new Error("Ticket not found");
        }

        ticket.set({
            title, price
        });

        await ticket.save();
        msg.ack();
    }
}
