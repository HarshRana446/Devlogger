import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import puppeteer from "puppeteer"

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

    // Generate HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>DevLogger Export</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            h2 { color: #1e40af; margin-top: 30px; }
            .log { margin-bottom: 40px; page-break-inside: avoid; }
            .meta { color: #666; font-size: 14px; margin-bottom: 10px; }
            .tags { margin-top: 10px; }
            .tag { background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px; }
            pre { background: #f3f4f6; padding: 15px; border-radius: 5px; overflow-x: auto; }
            code { background: #f3f4f6; padding: 2px 4px; border-radius: 3px; }
          </style>
        </head>
        <body>
          <h1>DevLogger Export</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
          
          ${userLogs
            .map(
              (log) => `
            <div class="log">
              <h2>${log.title}</h2>
              <div class="meta">
                Created: ${new Date(log.createdAt).toLocaleDateString()}
                ${log.updatedAt !== log.createdAt ? ` | Updated: ${new Date(log.updatedAt).toLocaleDateString()}` : ""}
              </div>
              <div>${log.content.replace(/\n/g, "<br>")}</div>
              ${
                log.tags.length > 0
                  ? `
                <div class="tags">
                  ${log.tags.map((tag: string) => `<span class="tag">${tag}</span>`).join("")}
                </div>
              `
                  : ""
              }
            </div>
          `,
            )
            .join("")}
        </body>
      </html>
    `

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    const pdf = await page.pdf({
      format: "A4",
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    })
    await browser.close()

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="devlogger-export.pdf"',
      },
    })
  } catch (error) {
    console.error("PDF export error:", error)
    return NextResponse.json({ message: "Export failed" }, { status: 500 })
  }
}
