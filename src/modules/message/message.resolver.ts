import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
} from "type-graphql";
import { Context } from "../../utils/buildContext";
import { findUserById } from "../user/user.service";
import { CreateMessageInput, Message } from "./message.dto";
import { createMessage } from "./message.service";

@Resolver(Message)
export class MessageResolver {
  @Authorized()
  @Mutation(() => Message)
  async createMessage(
    @Arg("input") input: CreateMessageInput,
    @Ctx() ctx: Context
  ) {
    const result = await createMessage({ ...input, userId: ctx.user?.id! });
    return result;
  }

  @FieldResolver()
  async user(@Root() message: Message) {
    return findUserById(message.userId);
  }
}
