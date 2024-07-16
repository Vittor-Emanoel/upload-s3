import { S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
export const s3Client = new S3Client();

export const fileKey = randomUUID();
