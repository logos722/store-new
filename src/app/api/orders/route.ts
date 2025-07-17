import { NextResponse } from 'next/server';

/**
 * Proxy endpoint for creating orders.
 * Receives the order payload from the frontend and forwards it to the Express backend.
 */
export async function POST(request: Request) {
  try {
    // Read JSON body from the incoming request
    const orderPayload = await request.json();

    // Forward to backend
    const res = await fetch(`${process.env.API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
      cache: 'no-store',
    });

    const data = await res.json();
    // Propagate status and body
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Order proxy error:', err);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 },
    );
  }
}
