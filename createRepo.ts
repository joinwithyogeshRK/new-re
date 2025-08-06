import dotenv from "dotenv";

import { getGitHubUsername } from "./getToken.js";

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const repoName = process.env.REPO;

if (!GITHUB_TOKEN || !repoName) {
  console.error("❌ GITHUB_TOKEN or REPO is missing in .env file");
  process.exit(1);
}
console.log(GITHUB_TOKEN , repoName)
export const createRepoIfNotExists = async () => {
  const username = await getGitHubUsername();

  const response = await fetch("https://api.github.com/user/repos", {
    method: "POST",
    headers: {
      //@ts-ignore
      Authorization: `Bearer ${GITHUB_TOKEN}`, // You were using `token`, `Bearer` is more standard now
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      name: repoName,
      private: false,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    if (
      response.status === 422 &&
      data?.errors?.[0]?.message === "name already exists on this account"
    ) {
      console.log("⚠️ Repo already exists. Continuing...");
      return {
        html_url: `https://github.com/${username}/${repoName}`,
      };
    }

    console.error("❌ Repo creation failed:", data?.message || "Unknown error");
    throw new Error(data?.message || "Repository creation failed");
  }

  console.log("✅ Repo created:", data.html_url);
  return data;
};

// ✅ Run/test
createRepoIfNotExists();
