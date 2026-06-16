import { neon } from "@neondatabase/serverless";
import { argon2id, hash } from "argon2";
import { randomUUID } from "node:crypto";

const databaseUrl = process.env.NEON_DATABASE_URL;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!databaseUrl) {
  throw new Error("NEON_DATABASE_URL is missing");
}

if (!adminEmail) {
  throw new Error("ADMIN_EMAIL is missing");
}

if (!adminPassword) {
  throw new Error("ADMIN_PASSWORD is missing");
}

const sql = neon(databaseUrl);

const passwordHash = await hash(adminPassword, {
  type: argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
});

await sql`
  insert into users (
    id,
    email,
    password_hash,
    role
  )
  values (
    ${randomUUID()},
    ${adminEmail.trim().toLowerCase()},
    ${passwordHash},
    'admin'
  )
  on conflict (email)
  do update set
    password_hash = excluded.password_hash,
    updated_at = now()
`;

console.log("Admin user seeded.");
