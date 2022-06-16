import argon2 from "argon2";
import prisma from "../../libs/prisma";
import { LoginInput, RegisterUserInput } from "./user.dto";

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

export async function findUserByEmailOrUsername(
  input: LoginInput["usernameOrEmail"]
) {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: input }, { username: input }],
    },
  });
}
