import { PutObjectCommand } from "@aws-sdk/client-s3";
import { fileKey, s3Client } from "./utils";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function handler(event) {
  const { fileName } = JSON.parse(event.body);

  if (!fileName) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "File name is required",
      }),
    };
  }

  const s3command = new PutObjectCommand({
    Bucket: "nome do bucket",
    Key: `${fileKey}-${fileName}`,
  });

  const signedUrl = getSignedUrl(s3Client, s3command, { expiresIn: 60 }); //60 seconds

  return {
    statusCode: 201,
    body: JSON.stringify({
      signedUrl,
    }),
  };
}
