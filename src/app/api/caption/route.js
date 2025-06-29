import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import FormData from 'form-data';
import axios from 'axios';
import { VisionEncoderDecoderModel } from transformers 

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    // Create temp path to save file
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempFilePath = path.join('/tmp', `${uuidv4()}_${file.name}`);
    await writeFile(tempFilePath, buffer);

    // Prepare multipart/form-data for Hugging Face
    const hfForm = new FormData();
    hfForm.append('file', buffer, {
      filename: file.name,
      contentType: file.type,
    });

    const hfRes = await axios.post(
      'nlpconnect/vit-gpt2-image-captioning',
      hfForm,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          ...hfForm.getHeaders(),
        },
      }
    );

    const caption = hfRes.data[0]?.generated_text || 'No caption returned';
    return NextResponse.json({ caption });
  } catch (error) {
    console.error('Error in /api/caption:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Caption generation failed.' }, { status: 500 });
  }
}
