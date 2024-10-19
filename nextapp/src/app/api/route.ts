import { NextResponse } from "next/server"
import connectDB from "@/lib/DB/connectDB"
export async function GET() {
    await connectDB();
    return NextResponse.json({ message: "Hello, World!" })
}