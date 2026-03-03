import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ folder: string }> }
) {
  const { folder } = await params;

  // フォルダ名のサニタイズ（ディレクトリトラバーサル対策）
  if (!/^[a-zA-Z0-9_-]+$/.test(folder)) {
    return NextResponse.json({ images: [] });
  }

  const dirPath = path.join(process.cwd(), 'public', 'img', folder);

  try {
    if (!fs.existsSync(dirPath)) {
      return NextResponse.json({ images: [] });
    }

    const files = fs.readdirSync(dirPath);
    const images = files
      .filter(f => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort()
      .map(f => `/img/${folder}/${f}`);

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
