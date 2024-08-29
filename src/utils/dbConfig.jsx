
import {neon} from '@neondatabase/serverless';
import {drizzle} from 'drizzle-orm/neon-http';

import * as schema from './schema';

const sql = neon(
    "postgresql://auth-masterclass_owner:vIZ45ARiTGDU@ep-holy-math-a1puy4es.ap-southeast-1.aws.neon.tech/ai-doctor?sslmode=require",
);

export const db = drizzle(sql, {schema})