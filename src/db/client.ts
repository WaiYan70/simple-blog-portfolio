import "server-only";

import { neon } from "@neondatabase/serverless";

const getDatabaseUrl = (): string => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("Database Url is not configured or missing!");
  }

  return databaseUrl;
};

export const sql = neon(getDatabaseUrl());
