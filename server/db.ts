import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// Create a SQL client with the Neon client
const sql = neon(process.env.DATABASE_URL!);

// Create the Drizzle client
export const db = drizzle(sql, { schema });