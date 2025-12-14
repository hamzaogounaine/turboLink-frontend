"use client";
import useSWR from "swr";
import api from "@/lib/api";
import React from "react";
import LinkCard from "./LinkCard";
import { Loader2, AlertTriangle, Frown } from "lucide-react";
import { Button } from "@/components/ui/button";

const fetcher = async (url) => {
  // You must add proper error handling here instead of just letting it throw
  const res = await api.get(url);
  return res.data;
};

const LinksComponent = () => {
  const {
    data: links,
    error,
    isLoading,
    mutate,
  } = useSWR("/url/me", fetcher, {
    revalidateIfStale: false,
    shouldRetryOnError: false,
  }); // Add 'mutate' for easy refresh

  // 1. **Modern Loading State**: Use a spinner and muted text
  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="mt-3 text-lg font-medium">Fetching your links...</p>
        <p className="text-sm text-gray-400">
          Hold tight, this shouldn't take long.
        </p>
      </div>
    );

  // 2. **Modern Error State**: Clear error message with a recovery button
  if (error)
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-red-300 bg-red-50 rounded-lg">
        <AlertTriangle className="w-8 h-8 text-red-500" />
        <p className="mt-3 text-xl font-semibold text-red-800">API FAILED.</p>
        <p className="text-sm text-red-600 text-center">
          Status: {error.response?.status || "Network Error"}. Fix your
          endpoint.
        </p>
        <Button onClick={() => mutate()} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );

  // 3. **Modern Empty State**: Encouraging call-to-action
  if (!links || links.length === 0)
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-300 bg-gray-50 rounded-xl">
        <Frown className="w-8 h-8 text-gray-400" />
        <h2 className="mt-3 text-xl font-semibold text-gray-700">
          No links found.
        </h2>
        <p className="text-gray-500 text-center">
          Your history is empty. Time to create your first short link.
        </p>
        {/* Placeholder for 'Create Link' button */}
        <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">
          + New Link
        </Button>
      </div>
    );

  // 4. **Rendered List**: Clean container and header
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6 border-b pb-3">
        <h1 className="text-3xl font-extrabold  tracking-tight">
          Your Short Links ({links.length})
        </h1>
        <p className="">Manage all your shortened URLs and view analytics.</p>
      </header>

      <div className="space-y-4">
        {" "}
        {/* Use space utility for vertical gap */}
        {links.map((link) => (
          <LinkCard key={link._id} link={link} mutate={mutate}/>
        ))}
      </div>
    </div>
  );
};

export default LinksComponent;
