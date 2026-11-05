import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const mediaAssets = sqliteTable('media_assets', {
 id:text('id').primaryKey(), section:text('section').notNull(), title:text('title').notNull(), alt:text('alt').notNull(),
 url:text('url').notNull(), publicId:text('public_id').notNull().unique(), bytes:integer('bytes').notNull(),
 createdAt:text('created_at').notNull(), createdBy:text('created_by').notNull(),
});
export const mediaAssignments = sqliteTable('media_assignments', {
 slot:text('slot').primaryKey(), assetId:text('asset_id').notNull().references(()=>mediaAssets.id), updatedAt:text('updated_at').notNull(),
});

export const adminSessions=sqliteTable('admin_sessions',{tokenHash:text('token_hash').primaryKey(),email:text('email').notNull(),expiresAt:integer('expires_at').notNull()});
export const loginAttempts=sqliteTable('login_attempts',{key:text('key').primaryKey(),count:integer('count').notNull(),expiresAt:integer('expires_at').notNull()});
