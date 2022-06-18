import { User } from "@prisma/client";
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

export async function followOrUnfollowUser({
  userId,
  username,
}: {
  userId: string;
  username: string;
}): Promise<User> {
  let user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      followedBy: true,
    },
  });

  const followers = user?.followedBy.map((user) => user.username);

  if (followers?.includes(username)) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        following: {
          disconnect: {
            username,
          },
        },
      },
    });
  } else {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        following: {
          connect: {
            username,
          },
        },
      },
    });
  }
}

export async function getUsers() {
  return prisma.user.findMany();
}

export async function findUsersFollowing(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      following: true,
    },
  });
}

export async function findUsersFollowedBy(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      followedBy: true,
    },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}
