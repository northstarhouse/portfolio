import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message:
        "Checkout is not connected yet. Next step: create a Stripe Checkout session and return its URL."
    },
    { status: 501 }
  );
}
