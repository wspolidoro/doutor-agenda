import { Client } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as schema from "./schema";

const client = new Client(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });
