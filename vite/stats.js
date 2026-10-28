// Regenerates src/data/stats.json (scripts/stats.mjs) when a build or the dev server starts,
// and hands the fresh numbers to the templates, so dist/ never shows a stale count. The
// README block is left to `npm run stats`; `npm run lint` fails while either is stale.
import { writeStats } from "../scripts/stats.mjs";

export default function stats(data) {
  return {
    name: "stats",
    async buildStart() {
      data.stats = await writeStats();
    },
  };
}
