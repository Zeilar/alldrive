/**
 * The purpose of this script is to add the process.env.FRONTEND_PORT variable to the start script.
 * I couldn't get the Dockerfile to use the env variable in the CMD command for whatever reason.
 */
const { readFile, writeFile } = require("fs/promises");
const { join } = require("path");

async function addPortToStartScript() {
  const { FRONTEND_PORT } = process.env;
  if (!process.env.FRONTEND_PORT) {
    throw new Error("Missing FRONTEND_PORT env.");
  }
  const path = join(__dirname, "package.json");
  const buffer = await readFile(path);
  const content = `${buffer}`;
  const modifiedContent = content.replace("next start", `next start -p ${FRONTEND_PORT}`);
  await writeFile(path, modifiedContent);
  console.log(`Added ${FRONTEND_PORT} to package.json Next start script.`);
}

addPortToStartScript();
