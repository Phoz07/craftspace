import { NextResponse } from "next/server";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  verifyPasscode,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passcode } = body;

    if (!passcode || !verifyPasscode(passcode)) {
      return NextResponse.json(
        {
          success: false,
          error: "รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบรหัสผ่านสตูดิโออีกครั้ง",
        },
        { status: 401 },
      );
    }

    // Passcode valid, issue signed session token
    const token = await createSessionToken();

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("[api/admin/login] Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
