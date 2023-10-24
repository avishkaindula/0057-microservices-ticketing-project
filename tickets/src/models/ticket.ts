import mongoose from 'mongoose';

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties that a Ticket Document has
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// This is a function that is going to create a new ticket document
// by taking in the ticket attributes.
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};
// This custom build function is the one we use instead of mongoose.create() in order to 
// create new documents. This is because we want to make sure that we are creating a new
// document with the correct types.

// This is how we create a new collection called Ticket
// and this collection will have documents of type TicketDoc.
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };

