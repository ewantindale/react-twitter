import { useEffect } from "react";
import { useHistory } from "react-router";
import useSWR from "swr";
import { fetcher } from "./fetcher";

export const useIsAuthenticated = () => {
  const { data } = useSWR(`/api/users/info`, fetcher);
  const history = useHistory();

  useEffect(() => {
    if (data === null) {
      history.push("/login");
    }
  }, [data, history]);
};
