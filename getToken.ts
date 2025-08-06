 
import dotenv from "dotenv";
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
if (!GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN is not defined in environment variables.");
}

export async function getGitHubUsername(): Promise<string | null> {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      console.error("❌ Failed to fetch GitHub user:", await response.text());
      return null;
    }

    const data = await response.json();
    //@ts-ignore
    console.log(data.login);
    //@ts-ignore

    return data.login; // this is the GitHub username
  } catch (error) {
    console.error("❌ Error fetching GitHub username:", error);
    return null;
  }
}getGitHubUsername()

