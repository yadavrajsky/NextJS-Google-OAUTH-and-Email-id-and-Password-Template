import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { NextApiRequest } from "next";
import connectToDB from "@/lib/db";
import userModal from "@/app/models/userModel";
import UserModel from "@/app/models/userModel";

export async function POST(request: any) {
  try {
    const db = await connectToDB();
    
    const { firstName, lastName, email, phone, password } = await request.json();
    
    const alreadyExistsEmail = await userModal.findOne({ email: email });
    if (alreadyExistsEmail) {
      return NextResponse.json(
        { message: "Email is already registered!" },
        { status: 409 }
      );
    }

    
    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully!" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
