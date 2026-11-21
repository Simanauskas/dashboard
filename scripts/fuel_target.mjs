// Prints the Fuel card's targets as JSON, by loading src/App.jsx through Vite's SSR
// loader and calling the same fuelPlan() the dashboard uses — so MyFitnessPal and
// the dashboard cannot disagree.
//   TZ=Europe/Vilnius node scripts/fuel_target.mjs [days=7] [start=today]
// Output: [{date, kcal, carbs, protein, fat, carbGkg, kg, load, why}, ...]
import { createServer } from "vite";

const days = Number(process.argv[2] || 7);
const start = process.argv[3] || new Date().toLocaleDateString("sv-SE");
const shift = (d, n) => { const x = new Date(d + "T12:00:00Z"); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };

const server = await createServer({
  server: { middlewareMode: true, hmr: false }, appType: "custom", logLevel: "error",
  optimizeDeps: { noDiscovery: true, include: [] },
});
try {
  const app = await server.ssrLoadModule("/src/App.jsx");
  const out = Array.from({ length: days }, (_, i) => app.fuelTargetFor(shift(start, i)));
  process.stdout.write(JSON.stringify(out) + "\n");
} finally {
  await server.close();
}
