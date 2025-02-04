import axios from "axios";

export async function getPresignedURL(file: File) {
  const { data } = await axios.post<{ signedUrl: string }>(
    "awdwada",
    { fileName: file.name },
    {
      headers: { "Content-Type": "application/json" },
    },
  );

  return data.signedUrl;
}
