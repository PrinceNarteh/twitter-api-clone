import { ApolloError } from "apollo-server-core";
import argon2 from "argon2";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../../utils/buildContext";
import { LoginInput, RegisterUserInput, User } from "./user.dto";
import { createUser, findUserByEmailOrUsername } from "./user.service";

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

  @Mutation(() => String)
  async login(@Arg("input") input: LoginInput, @Ctx() ctx: Context) {
    const { usernameOrEmail, password } = input;

    const user = await findUserByEmailOrUsername(usernameOrEmail.toLowerCase());

    if (!user || !(await argon2.verify(user.password, password))) {
      throw new ApolloError("Invalid Credentials");
    }

    const token = await ctx.reply?.jwtSign({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    if (!token) {
      throw new ApolloError("Error signing token.");
    }

    ctx.reply?.setCookie("token", token, {
      domain: "localhost",
      path: "/",
      secure: false,
      httpOnly: true,
      sameSite: false,
    });

    return token;
  }
}

export default UserResolver;
