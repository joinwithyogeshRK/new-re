import simpleGit from "simple-git";
import { fileURLToPath } from "url";
import { getGitHubUsername } from "./getToken.js";
import dotenv from "dotenv";
import path from "path";
import { createRepoIfNotExists } from "./createRepo.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN = process.env.GITHUB_TOKEN!;
const REPO = process.env.REPO!;
const distPath = path.join(__dirname, "..", "src");
//@ts-ignore
const git = simpleGit(distPath);

async function upload() {
  try {
    const username = await getGitHubUsername();
    if (!username) throw new Error("Failed to get GitHub username.");

    const REPO_URL = `https://${username}:${TOKEN}@github.com/${username}/${REPO}.git`;

    
    

    
    await git.init();

    // STEP 3: Ensure correct remote is set
    const remotes = await git.getRemotes(true);
    //@ts-ignore
    const origin = remotes.find((r) => r.name === "origin");

    if (!origin) {
      await git.addRemote("origin", REPO_URL);
    } else if (origin.refs.fetch !== REPO_URL) {
      await git.remote(["set-url", "origin", REPO_URL]);
    }

    // STEP 4: Commit and push
    await git.add(".");
    await git.commit("🚀 Upload dist folder");
    await git.branch(["-M", "main"]);
    await git.push("origin", "main", { "--force": null });

    console.log("✅ Upload complete!");
  } catch (err) {
    console.error("❌ Upload failed:", err);
  }
}

upload();
