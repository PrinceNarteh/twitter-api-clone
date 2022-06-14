import "reflect-metadata";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloServer } from "apollo-server-fastify";
import fastify from "fastify";
import { buildSchema } from "type-graphql";
import UserResolver from "../modules/user/user.resolver";
import { buildContext } from "./buildContext";

const app = fastify();

export async function createServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer: app.server })],
    context: buildContext(),
  });

  return {
    app,
    server,
  };
}
