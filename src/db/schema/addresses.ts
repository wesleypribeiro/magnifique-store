import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const addresses = pgTable('addresses', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  fullName: text('full_name').notNull(),
  cpf: text('cpf').notNull(),
  phone: text('phone').notNull(),
  zipCode: text('zip_code').notNull(),
  address: text('address').notNull(),
  number: text('number').notNull(),
  complement: text('complement'),
  neighborhood: text('neighborhood').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  createdAt: text('created_at').default('now()'),
  updatedAt: text('updated_at').default('now()'),
});

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
