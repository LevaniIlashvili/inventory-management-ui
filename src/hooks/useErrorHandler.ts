import { useState } from "react";

export default function useErrorHandler() {
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: any) => {
    console.log(err);

    if (err?.response?.data?.message) {
      setError(err.response.data.error);
    } else if (err?.message) {
      setError(err.message);
    } else {
      setError("An unknown error occurred.");
    }
  };

  const clearError = () => setError(null);

  return { error, handleError, clearError };
}
