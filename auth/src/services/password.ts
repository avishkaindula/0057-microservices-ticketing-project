import{ scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
// scrypt is a hashing algorithm that is used to hash passwords.
// promisify is a utility function that converts a callback-based function such as scrypt
// into a promise-based function. This allows us to use async/await syntax with scrypt.

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    // randomBytes is a function that generates a random string of characters.

    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    // The split method splits a string into an array of substrings.

    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }

  // print() {}
}

// Password.hash("123456")
// Password.compare("123456", "123456")
// new Password().print()
// This is the difference between static and instance methods.
// Static methods are called on the class itself, whereas instance methods are called 
// on an instance of the class. In other words, static methods can be called without 
// the new keyword, whereas instance methods cannot.
