import { AlertCircle } from "lucide-react";
import React from "react";

const Error = ({message}) => {
  return (
    <div>
      <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 my-4 p-3 rounded-md border border-destructive/20">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Error;
