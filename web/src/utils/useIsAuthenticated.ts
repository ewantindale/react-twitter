import { useEffect } from "react";
import { useHistory } from "react-router";
import { useCurrentUser } from "./useCurrentUser";

export const useIsAuthenticated = () => {
  const { error } = useCurrentUser();
  const history = useHistory();

  useEffect(() => {
    if (error) {
      history.push("/login");
    }
  }, [error, history]);
};
