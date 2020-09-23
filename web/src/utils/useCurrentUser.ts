import useSWR from "swr";
import { fetcher } from "./fetcher";

export const useCurrentUser = () => {
  const { data: user, error } = useSWR(
    `${process.env.REACT_APP_API_URL}/api/users/info`,
    fetcher
  );

  return {
    user: user,
    error: error,
    loading: !error && !user,
  };
};
