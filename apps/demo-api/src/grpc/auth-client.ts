import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { config } from "../config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROTO_PATH = join(__dirname, "../../../../packages/grpc-auth/proto/auth.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition) as {
  auth: { AuthService: grpc.ServiceClientConstructor };
};

const authGrpcClient = new proto.auth.AuthService(
  config.AUTH_GRPC_ADDRESS,
  grpc.credentials.createInsecure()
);

export interface ValidateSessionResult {
  valid: boolean;
  userId: string;
  tenantId: string;
  role: string;
  error: string;
}

export interface GetUserByIdResult {
  found: boolean;
  userId: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
}

type AuthClient = grpc.Client & {
  validateSession(
    req: { sessionId: string },
    cb: (err: Error | null, res: ValidateSessionResult) => void
  ): void;
  getUserById(
    req: { userId: string },
    cb: (err: Error | null, res: GetUserByIdResult) => void
  ): void;
};

const client = authGrpcClient as AuthClient;

export function validateSession(sessionId: string): Promise<ValidateSessionResult> {
  return new Promise((resolve, reject) => {
    client.validateSession({ sessionId }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

export function getUserById(userId: string): Promise<GetUserByIdResult> {
  return new Promise((resolve, reject) => {
    client.getUserById({ userId }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

export function closeAuthGrpcClient(): Promise<void> {
  return new Promise((resolve) => {
    authGrpcClient.close();
    resolve();
  });
}
