import { createServer } from "./utils/createServer";

async function main() {
  const { app, server } = await createServer();

  // starting GraphQL server
  await server.start();

  app.register(
    server.createHandler({
      cors: false,
    })
  );

  const address = await app.listen({ port: 4000 });

  console.log(`🚀 Server running on ${address}${server.graphqlPath}`);
}

main();
