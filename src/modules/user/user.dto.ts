import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID, { nullable: false })
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  password: string;
}
