import mongoose from 'mongoose';
import express, {Request, Response} from "express";
import {body} from 'express-validator';
import {BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest} from "@rc-tickets/common";

import {Ticket} from "../models/ticket";
import {Order} from "../models/order";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/orders', requireAuth, [
    body('ticketId')
        .notEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input)).
    withMessage('TickedId must be provided'),

], validateRequest, async (req: Request, res:Response) => {

    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new NotFoundError();
    }

    const ticketIsReserved = await ticket.isReserved();
    if (ticketIsReserved) {
        throw new BadRequestError("Ticket is already reserved");
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticket,
    });

    await order.save();

    res.status(201).send(order);
});

export { router as newOrderRouter }