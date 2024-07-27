import type { SessionData } from "express-session";
import type { Config, Client } from "@libsql/core/api";

export interface SessionDataSerializer {
  stringify: (obj: SessionData) => string;
  parse: (str: string) => SessionData;
}

export type ConnectionOptions = { client: Client } | Config;

export type StoreOptions = {
  serializer?: SessionDataSerializer;
};

export type LibSQLSessionStoreOptions = ConnectionOptions & StoreOptions;
