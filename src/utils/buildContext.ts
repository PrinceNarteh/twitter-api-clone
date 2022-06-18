import { User } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "./createServer";

type CtxUser = Omit<User, "password">;

export async function buildContext({
  request,
  reply,
  connectionParams,
}: {
  request?: FastifyRequest;
  reply?: FastifyReply;
  connectionParams: {
    Authorization: string;
  };
}) {
  if (connectionParams || !request) {
    try {
      return {
        user: app.jwt.verify<CtxUser>(connectionParams?.Authorization || ""),
      };
    } catch (error) {
      return { user: null };
    }
  }

  try {
    const user = await request.jwtVerify<User>();
    return { request, reply, user };
  } catch (error) {
    return {
      request,
      reply,
      user: null,
    };
  }
}

export type Context = Awaited<ReturnType<typeof buildContext>>;
