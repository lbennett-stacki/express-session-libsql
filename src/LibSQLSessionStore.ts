import { createClient } from "@libsql/client";
import type { Client } from "@libsql/core/api";
import { type SessionData, Store } from "express-session";
import { LibSQLSessionStoreOptions, SessionDataSerializer } from "./types";

export class LibSQLSessionStore extends Store {
  private readonly client: Client;
  private readonly serializer: SessionDataSerializer;

  constructor(options: LibSQLSessionStoreOptions) {
    super();

    if ("client" in options) {
      this.client = options.client;
    } else {
      this.client = createClient(options);
    }

    this.serializer = options.serializer ?? JSON;
  }

  async get(
    sid: string,
    callback: (error: unknown, session?: SessionData | null) => void,
  ): Promise<void> {
    try {
      const result = await this.client.execute({
        sql: "SELECT session FROM sessions WHERE sid = ?",
        args: [sid],
      });
      const row = result.rows[0];

      if (!row || !row.session || typeof row.session !== "string") {
        return callback(null, null);
      }

      const session: SessionData = this.serializer.parse(row.session);

      callback(null, session);
    } catch (error) {
      callback(error);
    }
  }

  async set(
    sid: string,
    session: SessionData,
    callback: (error?: unknown) => void,
  ): Promise<void> {
    try {
      await this.client.execute({
        sql: "REPLACE INTO sessions (sid, session) VALUES (?, ?)",
        args: [sid, this.serializer.stringify(session)],
      });

      callback();
    } catch (error) {
      callback(error);
    }
  }

  async destroy(
    sid: string,
    callback: (error?: unknown) => void,
  ): Promise<void> {
    try {
      await this.client.execute({
        sql: "DELETE FROM sessions WHERE sid = ?",
        args: [sid],
      });

      callback();
    } catch (error) {
      callback(error);
    }
  }
}
