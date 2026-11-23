/**
 * Server-side GitHub data. Everything here is fetched live from public APIs
 * and revalidated hourly; nothing is hard-coded or estimated. If a request
 * fails, the section renders without that block instead of inventing numbers.
 *
 * Optional: set GITHUB_TOKEN to raise API rate limits and use the official
 * GraphQL contribution calendar.
 */

const REVALIDATE = 3600;

export type Repo = {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  fork: boolean;
  pushedAt: string;
};

export type LanguageShare = { name: string; bytes: number; share: number };

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type GitHubData = {
  username: string;
  profile: { publicRepos: number; followers: number; avatarUrl: string; createdAt: string } | null;
  repos: Repo[];
  languages: LanguageShare[];
  contributions: { total: number; days: ContributionDay[] } | null;
};

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-site",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function getJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, { ...init, headers: { ...headers(), ...(init?.headers ?? {}) }, next: { revalidate: REVALIDATE } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type ApiRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  pushed_at: string;
  languages_url: string;
};

async function getContributions(username: string): Promise<GitHubData["contributions"]> {
  // Official GraphQL calendar when a token is available.
  if (process.env.GITHUB_TOKEN) {
    type Gql = {
      data?: {
        user?: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: number;
              weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[];
            };
          };
        };
      };
    };
    const levels: Record<string, ContributionDay["level"]> = {
      NONE: 0,
      FIRST_QUARTILE: 1,
      SECOND_QUARTILE: 2,
      THIRD_QUARTILE: 3,
      FOURTH_QUARTILE: 4,
    };
    const res = await getJson<Gql>("https://api.github.com/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`,
        variables: { login: username },
      }),
    });
    const cal = res?.data?.user?.contributionsCollection.contributionCalendar;
    if (cal) {
      return {
        total: cal.totalContributions,
        days: cal.weeks.flatMap((w) =>
          w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount, level: levels[d.contributionLevel] ?? 0 })),
        ),
      };
    }
  }
  // Public, token-free mirror of the GitHub contribution calendar.
  type Pub = { total: Record<string, number>; contributions: ContributionDay[] };
  const pub = await getJson<Pub>(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`);
  if (!pub || !Array.isArray(pub.contributions)) return null;
  return { total: pub.total?.lastYear ?? pub.contributions.reduce((s, d) => s + d.count, 0), days: pub.contributions };
}

export async function getGitHubData(username: string): Promise<GitHubData> {
  const [user, apiRepos, contributions] = await Promise.all([
    getJson<{ public_repos: number; followers: number; avatar_url: string; created_at: string }>(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
    ),
    getJson<ApiRepo[]>(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`),
    getContributions(username),
  ]);

  const repos: Repo[] = (apiRepos ?? [])
    // The profile README repo isn't a project.
    .filter((r) => r.name.toLowerCase() !== username.toLowerCase())
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      homepage: r.homepage || null,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      fork: r.fork,
      pushedAt: r.pushed_at,
    }));

  // Language distribution across original (non-fork) public repos, by bytes.
  const langTotals = new Map<string, number>();
  const ownRepos = (apiRepos ?? []).filter((r) => !r.fork);
  const langResults = await Promise.all(ownRepos.map((r) => getJson<Record<string, number>>(r.languages_url)));
  for (const res of langResults) {
    if (!res) continue;
    for (const [lang, bytes] of Object.entries(res)) langTotals.set(lang, (langTotals.get(lang) ?? 0) + bytes);
  }
  const totalBytes = [...langTotals.values()].reduce((a, b) => a + b, 0);
  const languages: LanguageShare[] = [...langTotals.entries()]
    .map(([name, bytes]) => ({ name, bytes, share: totalBytes ? bytes / totalBytes : 0 }))
    .sort((a, b) => b.bytes - a.bytes);

  return {
    username,
    profile: user
      ? { publicRepos: user.public_repos, followers: user.followers, avatarUrl: user.avatar_url, createdAt: user.created_at }
      : null,
    repos,
    languages,
    contributions,
  };
}
