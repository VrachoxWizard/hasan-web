const { spawnSync } = require("node:child_process");

function run(cmd, args) {
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

// Prisma will validate required env vars in schema.
// On Vercel, DATABASE_URL and DATABASE_URL_UNPOOLED are provided by your Postgres provider integration (e.g. Neon).
// Locally, you may not have DB configured during install (e.g. CI), so skip.
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL_UNPOOLED) {
  console.log(
    "[postinstall] Skipping prisma generate (DATABASE_URL / DATABASE_URL_UNPOOLED not set)."
  );
  process.exit(0);
}

run("npx", ["prisma", "generate"]);
