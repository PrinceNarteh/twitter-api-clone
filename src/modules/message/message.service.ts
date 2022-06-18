import prisma from "../../libs/prisma";
import { CreateMessageInput } from "./message.dto";

export async function createMessage({ body, userId }: CreateMessageInput) {
  return prisma.message.create({
    data: {
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function findMessages() {
  return prisma.message.findMany();
}
