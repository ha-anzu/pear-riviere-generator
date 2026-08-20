import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { SavedConfig } from "./engine";

export type SavedPattern = {
  id: string;
  name: string;
  metal: string;
  lengthIn: number;
  config: SavedConfig;
  createdAt: string;
};

type PatternRow = {
  id: string;
  name: string;
  metal: string;
  length_in: number;
  config: SavedConfig | string;
  created_at: string;
};

function parseRow(row: PatternRow): SavedPattern {
  const config =
    typeof row.config === "string"
      ? (JSON.parse(row.config) as SavedConfig)
      : row.config;
  return {
    id: row.id,
    name: row.name,
    metal: row.metal,
    lengthIn: row.length_in,
    config,
    createdAt: row.created_at,
  };
}

export const listPatterns = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<PatternRow>`
      select id, name, metal, length_in, config, created_at
      from necklace_patterns
      where user_id = ${context.userId}
      order by updated_at desc
    `;
    return rows.map(parseRow);
  });

export const savePattern = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { name: string; config: SavedConfig }) => {
    const name = data.name.trim().slice(0, 80);
    if (!name) throw new Error("Name is required");
    return { name, config: data.config };
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const id = crypto.randomUUID();
    const payload = JSON.stringify(data.config);
    await sql.query(
      `insert into necklace_patterns (id, user_id, name, metal, length_in, config)
       values ($1, $2, $3, $4, $5, $6::jsonb)`,
      [
        id,
        context.userId,
        data.name,
        data.config.metal,
        data.config.lengthIn,
        payload,
      ],
    );
    return { id };
  });

export const deletePattern = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`
      delete from necklace_patterns
      where id = ${id} and user_id = ${context.userId}
    `;
    return { ok: true };
  });
