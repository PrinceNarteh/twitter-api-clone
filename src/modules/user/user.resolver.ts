import { Query, Resolver } from "type-graphql";
import { User } from "./user.dto";

@Resolver(() => User)
class UserResolver {
  @Query(() => User)
  user() {
    return {
      id: 1,
      username: "JDoe",
      email: "john.doe@email.com",
    };
  }
}

export default UserResolver;
