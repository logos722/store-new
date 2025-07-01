import { NextResponse } from 'next/server'
import type { ProductDetail } from '../../types'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/api/product/${encodeURIComponent(id)}`,
      { cache: 'no-store' }
    )
    if (!res.ok) {
      return NextResponse.json({ error: `Product ${id} not found` }, { status: res.status })
    }
    const product: ProductDetail = await res.json()
    return NextResponse.json(product)
  } catch (err) {
    console.error('Product proxy error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
