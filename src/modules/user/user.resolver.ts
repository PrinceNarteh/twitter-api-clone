import { Mutation, Resolver } from "type-graphql";
import { User } from "./user.dto";

@Resolver(() => User)
class UserResolver {
  @Mutation()
  async register() {}
}

export default UserResolver;
