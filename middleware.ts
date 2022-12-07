import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: "/api/profile",
};

export async function middleware(request: NextRequest) {
  try {
    const requestHeaders = new Headers(request.headers);
    const [_, jwt] = requestHeaders.get("authorization").split(" ");
    const alg = "HS256";
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const { payload, protectedHeader } = await jose.jwtVerify(jwt, secret, {
      issuer: "urn:supplist:api",
      audience: "urn:supplist:app",
    });

    if (!payload) {
      // Call our authentication function to check the request
      // Respond with JSON indicating an error message
      return NextResponse.json(
        {
          success: false,
          message: "Auth failed",
        },
        {
          status: 401,
        }
      );
    }
 } catch (err) {
    return NextResponse.json(
      {
        message: err.message,
      },
      {
        status: 403,
      }
    );
  }
}
