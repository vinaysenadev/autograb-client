import { useState } from "react";

type UploadData = {
  make: string;
  model: string;
  badge: string;
  fileContent: string | null;
};

export const useVehicleUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const uploadVehicle = async (uploadData: UploadData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("https://autograb-server.onrender.com/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      });

      if (!res.ok) {
        throw new Error("Failed to upload vehicle data");
      }

      const result = await res.json();
      setData(result);
      return result;
    } catch (err: any) {
      setError("An unexpected error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadVehicle, isLoading, error, data };
};
