import { ProcessingOptions, AkkasProject } from "../types";

export const transcribeAudio = async (
  file: File,
  options: ProcessingOptions
): Promise<AkkasProject> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify(options));

    console.log(`Sending request to /api/process... Method: POST, File: ${file.name}, Size: ${file.size}`);
    const response = await fetch("/api/process", {
      method: "POST",
      body: formData,
    });

    const status = response.status;
    const statusText = response.statusText;
    const contentType = response.headers.get("content-type");
    console.log(`Response received. Status: ${status} ${statusText}, Content-Type: ${contentType}`);

    if (!response.ok) {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${status}`);
      } else {
        const errorText = await response.text();
        console.error("Non-JSON error response body:", errorText.substring(0, 500));
        throw new Error(`Server returned error ${status}: ${errorText.substring(0, 100)}...`);
      }
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON response:", text.substring(0, 500));
      throw new Error(`Invalid JSON response from server. Status: ${status}. Content starts with: ${text.substring(0, 100)}`);
    }
  } catch (error) {
    console.error("Akkas Engine error:", error);
    throw error;
  }
};
