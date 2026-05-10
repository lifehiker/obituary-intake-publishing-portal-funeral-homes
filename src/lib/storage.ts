import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { slugify } from "./utils";

const uploadDir = path.join(process.cwd(), "public", "uploads");

export async function saveImageFile(file: File | null | undefined) {
  if (!file || file.size === 0) {
    return null;
  }

  await mkdir(uploadDir, { recursive: true });

  const extension = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${extension}`;
  const destination = path.join(uploadDir, fileName);
  const arrayBuffer = await file.arrayBuffer();

  await writeFile(destination, Buffer.from(arrayBuffer));

  return `/uploads/${fileName}`;
}
