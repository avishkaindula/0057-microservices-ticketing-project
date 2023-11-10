export enum Subjects {
  TicketCreated = "ticket:created",
  OrderUpdated = "order:updated",
}
// enum is a TS feature that allows us to define a set of named constants. 
// In this case, we are defining a set of subjects that our events can have.
// We are using an enum instead of a string because it allows us to use TS to catch errors 
// when we try to reference a subject that doesn't exist. For example, if we tried to 
// reference Subjects.TicketCreatedd, TS would throw an error.
