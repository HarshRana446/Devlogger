import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

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

    const { logs: logIds } = await request.json()

    const client = await clientPromise
    const db = client.db("devlogger")
    const logs = db.collection("logs")

    const userLogs = await logs
      .find({
        _id: { $in: logIds.map((id: string) => new ObjectId(id)) },
        userId: new ObjectId(decoded.userId),
      })
      .sort({ createdAt: -1 })
      .toArray()

    // Generate Markdown content
    const markdownContent = `# DevLogger Export

Generated on ${new Date().toLocaleDateString()}

---

${userLogs
  .map(
    (log) => `
## ${log.title}

**Created:** ${new Date(log.createdAt).toLocaleDateString()}${log.updatedAt !== log.createdAt ? ` | **Updated:** ${new Date(log.updatedAt).toLocaleDateString()}` : ""}

${log.content}

${log.tags.length > 0 ? `**Tags:** ${log.tags.join(", ")}` : ""}

---
`,
  )
  .join("\n")}
`

    return new NextResponse(markdownContent, {
      headers: {
        "Content-Type": "text/markdown",
        "Content-Disposition": 'attachment; filename="devlogger-export.md"',
      },
    })
  } catch (error) {
    console.error("Markdown export error:", error)
    return NextResponse.json({ message: "Export failed" }, { status: 500 })
  }
}
