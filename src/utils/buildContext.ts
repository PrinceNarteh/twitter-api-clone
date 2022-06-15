import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "./createServer";

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
        user: app.jwt.verify(connectionParams?.Authorization || ""),
      };
    } catch (error) {
      return { user: null };
    }
  }

  try {
    const user = await request.jwtVerify();
    return { request, reply, user };
  } catch (error) {
    return {
      request,
      reply,
      user: null,
    };
  }
}
