import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { IDatabase } from "../db/interface.js";

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
  auth: {
    AuthService: grpc.ServiceClientConstructor & {
      service: grpc.ServiceDefinition;
    };
  };
};

export function startGrpcServer(port: number, db: IDatabase): grpc.Server {
  const server = new grpc.Server();

  server.addService(proto.auth.AuthService.service, {
    validateSession: async (
      call: grpc.ServerUnaryCall<{ sessionId: string }, unknown>,
      callback: grpc.sendUnaryData<unknown>
    ) => {
      try {
        const { sessionId } = call.request;
        const session = await db.sessions.findById(sessionId);
        const now = new Date();

        if (!session || new Date(session.expiresAt) < now) {
          return callback(null, {
            valid: false,
            userId: "",
            tenantId: "",
            role: "",
            error: "Invalid or expired session",
          });
        }

        callback(null, {
          valid: true,
          userId: session.userId,
          tenantId: session.tenantId ?? "",
          role: session.userRole,
          error: "",
        });
      } catch (err) {
        callback(err as Error);
      }
    },

    getUserById: async (
      call: grpc.ServerUnaryCall<{ userId: string }, unknown>,
      callback: grpc.sendUnaryData<unknown>
    ) => {
      try {
        const { userId } = call.request;
        const user = await db.users.findById(userId);

        if (!user) {
          return callback(null, {
            found: false,
            userId: "",
            email: "",
            name: "",
            role: "",
            tenantId: "",
          });
        }

        callback(null, {
          found: true,
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId ?? "",
        });
      } catch (err) {
        callback(err as Error);
      }
    },
  });

  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, boundPort) => {
      if (err) throw err;
      console.log(`gRPC server listening on port ${boundPort}`);
    }
  );

  return server;
}
