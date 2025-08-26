import { NextResponse } from "next/server"
import { createConnection } from "mysql2/promise"

export const runtime = "nodejs"

export async function POST() {
  try {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      return NextResponse.json({ ok: false, error: "Missing DATABASE_URL" }, { status: 500 })
    }

    const connection = await createConnection(databaseUrl)
    const [rows] = await connection.query("SELECT 1 AS ok")
    await connection.end()

    return NextResponse.json({ ok: true, result: rows[0] })
  } catch (error: any) {
    // Return 200 with ok:false so the client can display the error without a network error
    return NextResponse.json({
      ok: false,
      error: error?.message || "Unknown error",
      code: error?.code,
      errno: error?.errno,
    })
  }
}


