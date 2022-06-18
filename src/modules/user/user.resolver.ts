import { ApolloError } from "apollo-server-core";
import argon2 from "argon2";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Context } from "../../utils/buildContext";
import {
  FollowerUserInput,
  LoginInput,
  RegisterUserInput,
  User,
  UserFollowers,
} from "./user.dto";
import {
  createUser,
  findUserByEmailOrUsername,
  followUser,
  getUsers,
} from "./user.service";

@Resolver(() => User)
class UserResolver {
  @Query(() => [User])
  async users() {
    return getUsers();
  }

  @Query(() => User)
  me(@Ctx() ctx: Context) {
    return ctx.user;
  }

  @Mutation(() => User)
  async register(@Arg("input") input: RegisterUserInput) {
    try {
      const user = await createUser(input);
    } catch (error) {
      throw error;
    }
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

  @Mutation(() => User)
  async followUser(
    @Arg("input") input: FollowerUserInput,
    @Ctx() ctx: Context
  ) {
    try {
      const result = await followUser({ ...input, userId: ctx.user?.id! });
      return result;
    } catch (error: any) {
      throw new ApolloError(error);
    }
  }

  @FieldResolver(() => UserFollowers)
  followers() {
    return {
      count: 0,
      items: [],
    };
  }

  @FieldResolver(() => UserFollowers)
  following() {
    return {
      count: 0,
      items: [],
    };
  }
}

export default UserResolver;
