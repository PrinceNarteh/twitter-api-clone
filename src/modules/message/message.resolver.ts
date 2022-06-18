import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { Context } from "../../utils/buildContext";
import { findUserById } from "../user/user.service";
import { CreateMessageInput, Message } from "./message.dto";
import { createMessage, findMessages } from "./message.service";

@Resolver(Message)
export class MessageResolver {
  @Authorized()
  @Mutation(() => Message)
  async createMessage(
    @Arg("input") input: CreateMessageInput,
    @Ctx() ctx: Context,
    @PubSub() pubSub: PubSubEngine
  ) {
    const result = await createMessage({ ...input, userId: ctx.user?.id! });
    await pubSub.publish("NEW_MESSAGE", result);
    return result;
  }

  @Query(() => [Message])
  async messages() {
    return findMessages();
  }

  @FieldResolver()
  async user(@Root() message: Message) {
    return findUserById(message.userId);
  }

  @Subscription(() => Message, {
    topics: "NEW_MESSAGE",
  })
  newMessage(@Root() message: Message) {
    return message;
  }
}
