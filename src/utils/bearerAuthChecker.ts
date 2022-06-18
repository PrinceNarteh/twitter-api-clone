import { AuthChecker } from "type-graphql";
import { Context } from "./buildContext";

export const bearerAuthChecker: AuthChecker<Context> = ({ context }) => {
  if (context.user) {
    return true;
  }
  return false;
};
