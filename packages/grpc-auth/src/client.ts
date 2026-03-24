import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { join } from "node:path";

const PROTO_PATH = join(__dirname, "../proto/auth.proto");

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

export type AuthClient = grpc.Client & {
  validateSession(
    req: { sessionId: string },
    cb: (err: Error | null, res: ValidateSessionResult) => void
  ): void;
  getUserById(
    req: { userId: string },
    cb: (err: Error | null, res: GetUserByIdResult) => void
  ): void;
};

export function createAuthGrpcClient(address: string): AuthClient {
  return new proto.auth.AuthService(
    address,
    grpc.credentials.createInsecure()
  ) as unknown as AuthClient;
}
