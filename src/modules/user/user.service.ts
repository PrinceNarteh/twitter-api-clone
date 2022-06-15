import argon2 from "argon2";
import prisma from "../../libs/prisma";
import { RegisterUserInput } from "./user.dto";

export async function createUser(input: RegisterUserInput) {
  const { email, password } = input;

  const hashedPassword = await argon2.hash(password);

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      username: input.username.toLowerCase(),
      password: hashedPassword,
    },
  });

  return user;
}
