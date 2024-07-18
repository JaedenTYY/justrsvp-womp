import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    // Handle error objects
    console.error(`Error: ${error.message}`, error);
    throw new Error(error.message);
  } else if (typeof error === "string") {
    // Handle string errors
    console.error(`Error: ${error}`);
    throw new Error(error);
  } else if (typeof error === "object" && error !== null) {
    // Handle object errors
    const errorMessage = JSON.stringify(error);
    console.error(`Error: ${errorMessage}`);
    throw new Error(errorMessage);
  } else {
    // Handle unknown errors
    console.error("An unknown error occurred", error);
    throw new Error("An unknown error occurred");
  }
};

// In @/lib/utils.ts
export function formatDateTime(date: Date | string): { dateTime: string } {
  const d = new Date(date);
  return {
    dateTime: d.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string;
}) {
  const searchParams = new URLSearchParams(params);
  searchParams.set(key, value);
  return `?${searchParams.toString()}`;
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: {
  params: string;
  keysToRemove: string[];
}) {
  const searchParams = new URLSearchParams(params);
  keysToRemove.forEach((key) => searchParams.delete(key));
  return `?${searchParams.toString()}`;
}
  
export const convertFileToUrl = (file: File) => URL.createObjectURL(file)

export const formatPrice = (price: string) => {
  const amount = parseFloat(price)
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)

  return formattedPrice
}





