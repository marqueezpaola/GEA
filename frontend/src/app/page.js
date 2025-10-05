// src/app/page.js
import { redirect } from "next/navigation";

export default function Home() {
  // redirige inmediatamente a la pestaña principal (Mapa)
  redirect("/tabs/map");
}
