import {Message} from 'node-nats-streaming';
import {Listener, Subjects, TicketCreatedEvent} from "@rc-tickets/common";
import {ordersService} from "./queue-group-name";
import {Ticket} from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {

    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName: string = ordersService;

    async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
        const {id, title, price} = data;
        const ticket = Ticket.build({
            id, title, price
        });

        await ticket.save();
        msg.ack();
    }
}
