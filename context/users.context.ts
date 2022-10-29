import { createStateContext } from "react-use";

export type User = {
  user_id: string;
  name: string;
  is_leader: boolean;
}

const [useUsers, UsersProvider] = createStateContext<User[]>([]);

export { useUsers, UsersProvider };
