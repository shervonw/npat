import { useMemo } from "react";
import { useAsync } from "react-use";
import { supabase } from "../client/supabase-client";
import { User, useReducerContext, useUsers } from "../context";

export const useUserManagement = () => {
  const [state] = useReducerContext();
  const [, setUsers] = useUsers();
  const userKeys = useMemo(() => state.userKeys, [state]);

  useAsync(async () => {
    if (userKeys) {
      const response = await supabase
        .from("npat_users")
        .select()
        .in("user_id", userKeys);

      setUsers(response.data as User[]);
    }
  }, [userKeys]);
};
