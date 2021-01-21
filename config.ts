const githubToken = process.env.GITHUB_TOKEN;

if (!githubToken) {
  throw new Error("Missing environment variable GITHUB_TOKEN.");
}

export const config = {
  name: "Solirpa Fairyland",
  subtitle: "Code",
  birthday: "1995-06-06",
  githubUsername: "solirpa",
  githubToken,
};
