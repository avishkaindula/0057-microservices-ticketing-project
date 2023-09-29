import mongoose from "mongoose";

// An interface that describes the properties
// that are required to create a new User.
interface UserAttrs {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String, 
    // This is a reference to the String constructor function
    // provided by JavaScript. This is not a reference to the string type
    // inside of TypeScript. string in TypeScript starts with a simple letter.
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model("User", userSchema);

// This is a function that creates a new User.
const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
}

// buildUser({
//   email: "test@test.com",
//   password: "password",
//   // test: "test"
//   // This will throw an error because the buildUser function only accepts the 
//   // attributes defined in the UserAttrs interface.
// });
// We create a new User by calling the buildUser function instead of calling
// the new User constructor function directly. This is because we want to make sure
// that the user we are creating has the correct properties defined in the
// UserAttrs interface. If we call the User constructor function directly, then
// we can pass any properties we want to the constructor function and it will
// not throw any errors. This is because the User constructor function is
// provided by mongoose and it doesn't know anything about the UserAttrs
// interface.

export { User, buildUser };
