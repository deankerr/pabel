import { createClient } from '@libsql/client'
import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'

dotenv.config({ path: '.env.local' })

export const client = createClient({
  url: process.env.TURSO_DB_URL as string,
  authToken: process.env.TURSO_DB_AUTH_TOKEN as string,
})

export const migrateDb = drizzle(client)

async function main() {
  try {
    await migrate(migrateDb, {
      migrationsFolder: 'drizzle/migrations',
    })
    console.log('Tables migrated!')
    process.exit(0)
  } catch (error) {
    console.error('Error performing migration: ', error)
    process.exit(1)
  }
}

main()
