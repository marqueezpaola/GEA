
import { readAppData } from "../../../services/jsonapp.js";

export async function GET() {
  try {
    const data = await readAppData();
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    // Siempre respondemos 200 con estructura vacía
    return Response.json({ profile: {}, alerts: [], help: {} }, { status: 200 });
  }
}
