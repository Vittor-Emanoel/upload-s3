import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

const s3Client = new S3Client();
const dynamoClient = new DynamoDBClient();

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

  const fileKey = `${randomUUID()}-${fileName}`;

  const s3command = new PutObjectCommand({
    Bucket: "adwwad",
    Key: fileKey,
  });

  const dynamoCommand = new PutItemCommand({
    TableName: "awdawdaw",
    Item: {
      fileKey: { S: fileKey },
      originalFileName: { S: fileName },
    },
  });

  const signedUrl = await getSignedUrl(s3Client, s3command, { expiresIn: 60 }); //60 seconds
  await dynamoClient.send(dynamoCommand);

  return {
    statusCode: 201,
    body: JSON.stringify({
      signedUrl,
    }),
  };
}
