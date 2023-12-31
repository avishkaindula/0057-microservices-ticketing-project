import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes the properties
// that are required to create a new User.
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Document has.
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has.
interface UserModel extends mongoose.Model<UserDoc> {
  // extends will inherit all the properties that
  // a mongoose Model has.
  // The purpose of <UserDoc> is to tell TypeScript
  // that we are creating a new collection called User
  // and this collection will have documents of type UserDoc.
  build(attrs: UserAttrs): UserDoc;
  // this means that the build method will return
  // a User Document which is of type UserDoc by taking
  // in attrs which is of type UserAttrs.
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      // This is a reference to the String constructor function
      // provided by JavaScript. This is not a reference to the string type
      // inside of TypeScript. string in TypeScript starts with a simple letter.
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // This is a mongoose property that will be called when we try to send
      // the user document back to the client as a response.
      transform(doc, ret) {
        // doc is the user document that we are trying to send back to the client.
        // ret is the object that is going to be turned into JSON.
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        // We need to generalize the response object because we are going to use
        // this response object in different places. So we need to make sure that
        // the response object doesn't have any properties that are specific to
        // a particular database or a particular library.
      },
    },
  }
);

// This is a middleware function that will run before a user is saved.
// We cannot use an arrow function here because we need to use the this keyword.
// We need to use the function keyword because the value of this will be the
// document that is being saved. If we use an arrow function, the value of this
// will be the entire file.
userSchema.pre("save", async function (done) {
  // isModified is a mongoose function that will return true if the password
  // has been modified. This will return true also if the user is created for the
  // first time. So this hashing only happens when the password is modified.
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
    // this.get("password") will return the password property of the document.
    // this.set("password", hashed) will set the password property of the document.
  }
  done();
  // done is a built-in function that we need to call when we are done with the middleware.
});

// This is a static method that will be available on the User Model.
// We can use this method to create a new User.
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
// This custom build function is the one we use instead of mongoose.create() in order to 
// create new documents. This is because we want to make sure that we are creating a new
// document with the correct types.

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
// <UserDoc, UserModel> is a generic type. We are telling TypeScript that
// we are creating a new collection called User and this collection will
// have documents of type UserDoc and the User Model will have properties
// of type UserModel.

export { User };
