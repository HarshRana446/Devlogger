import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const log = await logs.findOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(decoded.userId),
    })

    if (!log) {
      return NextResponse.json({ message: "Log not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...log,
      _id: log._id.toString(),
      userId: log.userId.toString(),
    })
  } catch (error) {
    console.error("Get log error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const client = await clientPromise
    const db = client.db("devlogger")
    const logs = db.collection("logs")

    const result = await logs.updateOne(
      {
        _id: new ObjectId(params.id),
        userId: new ObjectId(decoded.userId),
      },
      {
        $set: {
          title,
          content,
          tags: tags || [],
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Log not found" }, { status: 404 })
    }

    const updatedLog = await logs.findOne({
      _id: new ObjectId(params.id),
    })

    return NextResponse.json({
      ...updatedLog,
      _id: updatedLog!._id.toString(),
      userId: updatedLog!.userId.toString(),
    })
  } catch (error) {
    console.error("Update log error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const result = await logs.deleteOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(decoded.userId),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Log not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Log deleted successfully" })
  } catch (error) {
    console.error("Delete log error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
