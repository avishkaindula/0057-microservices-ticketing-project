import { Subjects } from "./subjects";

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
// This interface defines the structure of the event data that will be published
// when a ticket is created. We are using an interface instead of a class because
// we don't need to create an instance of this data. We are just using it to
// enforce a structure on the data that will be published.
