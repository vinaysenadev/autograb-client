import { useState } from "react";

import { API_END_POINT, DEV_API_END_POINT } from "../../../constants";

type UploadData = {
  make: string;
  model: string;
  badge: string;
  fileContent: string | null;
};

export type VehicleResponse = {
  success: boolean;
  vehicle: {
    make: string;
    model: string;
    badge: string;
  };
  logbook: string;
};

export const useVehicleUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VehicleResponse | null>(null);

  const uploadVehicle = async (uploadData: UploadData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${DEV_API_END_POINT}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      });
      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(result?.error || "Failed to upload vehicle data");
      }
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again later.",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadVehicle, isLoading, error, data };
};
