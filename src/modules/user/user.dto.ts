import { IsEmail, Length } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";

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

@InputType()
export class RegisterUserInput {
  @Field({ nullable: false })
  username: string;

  @Field({ nullable: false })
  @IsEmail()
  email: string;

  @Field({ nullable: false })
  @Length(6, 32)
  password: string;
}
