import { NextRequest } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { isAdmin } from "@/lib/auth";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function requireAdmin() {
  const ok = await isAdmin();
  if (!ok) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function POST(request: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) {
    return Response.json(
      { error: "R2 configuration missing" },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  const providerId = formData.get("providerId");
  if (!providerId || typeof providerId !== "string" || !providerId.trim()) {
    return Response.json({ error: "Missing providerId" }, { status: 400 });
  }

  const files = formData.getAll("files[]");
  const fileList = files.filter((f): f is File => f instanceof File);
  if (fileList.length === 0) {
    const single = formData.get("file");
    if (single instanceof File) fileList.push(single);
  }
  if (fileList.length === 0) {
    return Response.json({ error: "No files provided" }, { status: 400 });
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const addedKeys: string[] = [];
  const urls: string[] = [];
  const base = providerId.trim();
  const timestamp = Date.now();
  const baseUrl = publicBaseUrl.replace(/\/$/, "");

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const mime = file.type;
    if (!ALLOWED_TYPES.includes(mime)) {
      return Response.json(
        { error: `File ${i + 1}: Invalid type. Use JPEG, PNG or WebP.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return Response.json(
        { error: `File ${i + 1}: Too large. Max 5 MB.` },
        { status: 400 }
      );
    }

    const ext = EXT_MAP[mime] ?? "jpg";
    const imageKey = `providers/${base}/gallery/${timestamp}-${i}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: imageKey,
          Body: buffer,
          ContentType: mime,
          CacheControl: "public, max-age=31536000, immutable",
        })
      );
    } catch (e) {
      console.error("R2 upload error:", e);
      return Response.json(
        { error: "Upload failed" },
        { status: 500 }
      );
    }

    addedKeys.push(imageKey);
    urls.push(`${baseUrl}/${imageKey}`);
  }

  return Response.json({ addedKeys, urls });
}
