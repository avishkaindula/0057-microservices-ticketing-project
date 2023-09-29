import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes the properties
// that are required to create a new User.
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has.
interface UserModel extends mongoose.Model<UserDoc> {
  // extends will inherit all the properties that
  // a mongoose Model has.
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has.
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
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
});

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

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
// <UserDoc, UserModel> is a generic type. We are telling TypeScript that
// we are creating a new collection called User and this collection will
// have documents of type UserDoc and the User Model will have properties
// of type UserModel.

export { User };
