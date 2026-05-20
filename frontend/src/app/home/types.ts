export interface UserSessionData {
  id: string;
  name: string;
  username: string;
  picture: string;
  email?: string;
  authProvider?: "oauth" | "email";
}

export interface Deployment {
  id: string;
  repoUrl: string;
  status: "deployed" | "failed" | "building" | "pending";
  createdAt: string;
  url?: string;
  branch?: string;
  commitSha?: string;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  failureReason?: string;
  rawStatus?: string;
}
