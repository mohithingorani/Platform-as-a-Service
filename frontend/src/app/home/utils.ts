export function deploymentHostUrl(id: string) {
  return `http://${id}.deploy.mohit.systems`;
}

export function repoSlug(repoUrl: string) {
  try {
    return repoUrl.replace("https://github.com/", "");
  } catch {
    return repoUrl;
  }
}

export function timeAgo(iso: string) {
  const t = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - t);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function formatDuration(ms?: number) {
  if (!ms || !Number.isFinite(ms) || ms <= 0) return undefined;
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}
