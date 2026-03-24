#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROTO_DIR="$SCRIPT_DIR/../proto"
OUT_DIR="$SCRIPT_DIR/../src/generated"

mkdir -p "$OUT_DIR"

grpc_tools_node_protoc \
  --js_out=import_style=commonjs,binary:"$OUT_DIR" \
  --grpc_out=grpc_js:"$OUT_DIR" \
  --ts_out=grpc_js:"$OUT_DIR" \
  --proto_path="$PROTO_DIR" \
  "$PROTO_DIR/auth.proto"

echo "Proto generation complete → $OUT_DIR"
