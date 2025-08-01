import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("devlogger")
    const logs = db.collection("logs")

    const userLogs = await logs
      .find({ userId: new ObjectId(decoded.userId) })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(
      userLogs.map((log) => ({
        ...log,
        _id: log._id.toString(),
        userId: log.userId.toString(),
      })),
    )
  } catch (error) {
    console.error("Get logs error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { title, content, tags } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ message: "Title and content are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("devlogger")
    const logs = db.collection("logs")

    const result = await logs.insertOne({
      title,
      content,
      tags: tags || [],
      userId: new ObjectId(decoded.userId),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const newLog = await logs.findOne({ _id: result.insertedId })

    return NextResponse.json({
      ...newLog,
      _id: newLog!._id.toString(),
      userId: newLog!.userId.toString(),
    })
  } catch (error) {
    console.error("Create log error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
