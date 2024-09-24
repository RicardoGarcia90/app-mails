import fs from "fs";
import path from "path";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file"); // O campo deve ser 'file'

  if (!file) {
    return new Response(JSON.stringify({ error: "No file uploaded." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Defina o caminho onde a imagem será salva
  const uploadsDir = path.join(process.cwd(), "public", "imagens");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); // Cria o diretório se não existir
  }

  // Salve a imagem na pasta public/imagens
  const filePath = path.join(uploadsDir, file.name);

  // Crie um fluxo de escrita e salve o arquivo
  const writableStream = fs.createWriteStream(filePath);
  writableStream.write(await file.arrayBuffer());
  writableStream.end();

  return new Response(
    JSON.stringify({ message: "Image uploaded successfully." }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
