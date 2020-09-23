import useSWR from "swr";
import { fetcher } from "./fetcher";

export const usePosts = () => {
  const { data, error } = useSWR(
    `${process.env.REACT_APP_API_URL}/api/posts`,
    fetcher
  );

  return {
    posts: data,
    error: error,
    loading: !error && !data,
  };
};
