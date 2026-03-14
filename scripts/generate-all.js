const { spawnSync } = require("child_process");

const commands = [
  ["node", ["generators/iphone.js"]],
  ["node", ["generators/ipad-portrait.js"]],
  ["node", ["generators/ipad-landscape.js"]],
  ["node", ["generators/mac.js"]]
];

for (const [command, args] of commands) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: { ...process.env, CI: "true" }
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
