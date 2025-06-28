import { NextResponse } from 'next/server'
import FormData from 'form-data'

export async function POST(req) {
  const data = await req.formData()
  const file = data.get('image')

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const formData = new FormData()
  formData.append('image', buffer, {
    filename: file.name,
    contentType: file.type,
  })

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
        body: formData,
      }
    )

    const result = await response.json()
    console.log("HuggingFace result:", result)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ caption: result[0].generated_text })
  } catch (error) {
    console.error("Server Error:", error)
    return NextResponse.json({ error: 'Failed to get caption' }, { status: 500 })
  }
}
