export enum OrderStatus {
    Created = 'created', // when order created but ticket not yet reserved
    Cancelled = 'cancelled', // the ticket the order is trying to reserve has been reserved or when user cancels order or order expires before payment
    AwaitingPayment = 'awaiting:payment', // order has reserved ticket
    Complete = 'complete' // order has reserved ticket and user has paid succesfully
}