import { pgTable, serial, varchar, text, numeric, integer, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  description: text('description').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar('image_url', { length: 1024 }),
  stock: integer('stock').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});