import { sql } from "drizzle-orm";
import {
    integer,
    varchar,
    pgTable,
    serial,
    text
} from 'drizzle-orm/pg-core';

export const Users = pgTable('users', {
    id:serial('id').primaryKey(),
    username: varchar('username').notNull(),
    age: integer('age').notNull(),
    location: varchar('location').notNull(),
    createBy: varchar('created_by').notNull(),

})
export const Records = pgTable('records', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => Users.id).notNull(),
    recordName: varchar('record_name').notNull(),
    analysisResult: varchar('analysis_result').notNull(),  // singular
    kanbanRecords: varchar('kanban_records').notNull(),  // corrected field name
    createBy: varchar('create_by').notNull(),
})
