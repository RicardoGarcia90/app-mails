import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const form = new formidable.IncomingForm();

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);

      // Extraindo os campos e garantindo que sejam strings
      const parsedFields = {};
      for (const key in fields) {
        parsedFields[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
      }

      resolve({ fields: parsedFields, files });
    });
  });

  // Verifica se o arquivo existe
  if (!files.file) {
    return NextResponse.json({ error: 'File not found' }, { status: 400 });
  }

  const file = files.file;

  const uploadDir = path.join(process.cwd(), 'public/imagem-upload');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const data = fs.readFileSync(file.filepath);
  const filePath = path.join(uploadDir, file.originalFilename || 'image');

  fs.writeFileSync(filePath, data);

  return NextResponse.json({ filePath: `/imagem-upload/${file.originalFilename}` });
}
