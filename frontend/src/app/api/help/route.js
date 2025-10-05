import { readAppData, DEFAULT_DATA } from "../../../services/jsonapp";

export async function GET() {
  try {
    const data = await readAppData();
    // Asegura que todas las claves existan (mezcla con defaults)
    const help = {
      ...DEFAULT_DATA.help,
      ...(data.help || {})
    };
    help.emergencyNumbers ||= DEFAULT_DATA.help.emergencyNumbers;
    help.educational      ||= DEFAULT_DATA.help.educational;
    help.healthAdvice     ||= DEFAULT_DATA.help.healthAdvice;
    help.safePlaces       ||= DEFAULT_DATA.help.safePlaces;

    return Response.json(help, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    // fallback final
    return Response.json(DEFAULT_DATA.help, { headers: { "Cache-Control": "no-store" } });
  }
}
