import UserModel from "@/app/models/userModel";
import connectToDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest,response: NextResponse) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Response.json({ error: 'You must be logged in.' }, { status: 401 })
    }
    const db = await connectToDB();
    
    const users = await UserModel.find();

    return NextResponse.json(
      { users: users },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
