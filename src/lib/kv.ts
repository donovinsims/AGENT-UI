import { TablesDB, ID, Permission, Role, Query } from 'appwrite'
import { client, DATABASE_ID, TABLE_ID } from './appwrite'

// Client-side KV store adapter backed by an Appwrite TablesDB table.
// Each row uses the string key as its row ID ($id), so lookups by key
// are direct and need no index. The `value` column stores
// JSON.stringify(value) (text column, max 16K chars). All rows carry
// explicit read/write permissions for any guest/client so the SPA can
// read and write without a user session.
const tables = new TablesDB(client)

// Set stores a key-value pair in the database (upsert, so repeated
// calls with the same key update the row instead of failing).
export const set = async (key: string, value: any): Promise<void> => {
  await tables.upsertRow(
    DATABASE_ID,
    TABLE_ID,
    key,
    { key, value: JSON.stringify(value) },
    [Permission.read(Role.any()), Permission.write(Role.any())],
  )
}

// Get retrieves a key-value pair from the database, or null when the
// row is missing (or its value cannot be parsed).
export const get = async (key: string): Promise<any> => {
  try {
    const row = await tables.getRow(DATABASE_ID, TABLE_ID, key)
    return JSON.parse(row.value)
  } catch {
    return null
  }
}

// Delete deletes a key-value pair from the database (no-op if missing).
export const del = async (key: string): Promise<void> => {
  try {
    await tables.deleteRow(DATABASE_ID, TABLE_ID, key)
  } catch {
    // Row does not exist — nothing to do.
  }
}

// Sets multiple key-value pairs in the database.
export const mset = async (keys: string[], values: any[]): Promise<void> => {
  await Promise.all(keys.map((key, i) => set(key, values[i])))
}

// Gets multiple key-value pairs from the database.
export const mget = async (keys: string[]): Promise<any[]> => {
  return Promise.all(keys.map((key) => get(key)))
}

// Deletes multiple key-value pairs from the database.
export const mdel = async (keys: string[]): Promise<void> => {
  await Promise.all(keys.map((key) => del(key)))
}

// Search for key-value pairs by key prefix.
export const getByPrefix = async (prefix: string): Promise<any[]> => {
  const { rows } = await tables.listRows(DATABASE_ID, TABLE_ID, [
    Query.startsWith('key', prefix),
  ])
  return rows.map((row) => JSON.parse(row.value))
}