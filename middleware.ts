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
    const alg = "RS256";
    const pem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7j7fWEELZjI4kb7gxP5s
+cYHbbSHU575Bkxv1g9VKFj4u9b/+MEVzaJsAoIaAH2abr2FdHjsxDQagpXLCDxl
GrhAh3aV2V5C6ShZ0u6+hGMBYX2gHeh1KXU3vSgag1dPMfpCM1IhnHC8lCgbotRy
iIPcNph7Staw5IG4HCWmEeRFXMofYGm/RB6b94L3G4bXTGMFgf/nOy0BiK+WxUQq
UdaPrRTkdLgOAkejSvUc2PZaw/FhnODdlexXnJ+X/k1M4A8ICOtcGHUmiCH1Sdq+
edOm0jFy/f4CedHhqvSjnYLGZ+YyZEh7TFF1gtRs+9JaJjaYjFFEtY65dfATDE0o
YQIDAQAB
-----END PUBLIC KEY-----`;
    const publicKey = await jose.importSPKI(pem, alg);
    const { payload, protectedHeader } = await jose.jwtVerify(jwt, publicKey, {
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
