
import { readAppData } from "../../../../services/jsonapp.js";


export async function GET() {
  try {
    const { alerts = [] } = await readAppData();
    return Response.json({ count: alerts.length }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ count: 0 }, { status: 200 });
  }
}
