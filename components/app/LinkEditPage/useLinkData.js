// useLinkData.js
import useSWR from "swr";
import api from "@/lib/api";

const fetcher = async (url) => {
  const res = await api.get(url);
  return res.data;
};

// Export BASE_URL for external use (e.g., in the form component)
export const BASE_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "https://turbolink.superstuff.online";

export const useLinkData = (shortUrl) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/url/${shortUrl}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  );

  return {
    link: data,
    error,
    isLoading,
    mutate,
  };
};
