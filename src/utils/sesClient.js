// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
import { SESClient } from "@aws-sdk/client-ses";
const REGION = "us-east-1";
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
export { sesClient };
