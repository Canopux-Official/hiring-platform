import axios from "axios";

/**
 * Safely extracts the most specific error message from an unknown error,
 * especially handling Axios errors returned from our backend.
 */
export function getErrorMessage(error: unknown, defaultMessage = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    // If our backend returns { success: false, message: "..." }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    // If it's a validation error array or other shape
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    // Network or CORS errors where response is undefined
    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return defaultMessage;
}
