import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../../utils/buildContext";
import { RegisterUserInput, User } from "./user.dto";
import { createUser } from "./user.service";

@Resolver(() => User)
class UserResolver {
  @Mutation(() => User)
  async register(@Arg("input") input: RegisterUserInput) {
    try {
      const user = await createUser(input);
    } catch (error) {
      throw error;
    }
  }

  @Query(() => User)
  me(@Ctx() ctx: Context) {
    return ctx.user;
  }
}

export default UserResolver;
