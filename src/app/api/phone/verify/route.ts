import { NextResponse } from "next/server";
import twilio from "twilio";

interface PhoneOtpPostData {
  phone: string;
  otp: string;
}

export async function POST(request: Request) {
  const data: PhoneOtpPostData = await request.json();

  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_SERVICE!)
      .verificationChecks.create({ code: data.otp, to: data.phone });

    if (verificationCheck.status === "approved") {
      // The verification code is valid
      return NextResponse.json(
        { message: "valid otp", phone: data.phone },
        { status: 200 }
      );
    } else {
      // The verification code is invalid
      return NextResponse.json(
        { message: "wrong otp", phone: data.phone },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.error();
  }
}
