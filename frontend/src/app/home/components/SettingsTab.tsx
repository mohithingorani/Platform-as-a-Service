"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { UserSessionData } from "../types";

export default function SettingsTab({ user }: { user: UserSessionData | null }) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <div className="text-white font-semibold text-lg">Account Settings</div>

        <div className="mt-5 flex items-center gap-4">
          {user?.picture ? (
            <Image
              src={user.picture}
              alt={user?.name || "User"}
              width={56}
              height={56}
              className="w-14 h-14 rounded-2xl"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
              <span className="text-white font-semibold">{user?.name?.[0] || "U"}</span>
            </div>
          )}

          <div className="min-w-0">
            <div className="text-white font-medium truncate">{user?.name || "Account"}</div>
            <div className="text-sm text-zinc-400 truncate">@{user?.username || "user"}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
            <div className="text-xs text-zinc-500">Email</div>
            <div className="text-sm text-zinc-200 mt-1 break-all">{user?.email || ""}</div>
            <div className="text-xs text-zinc-500 mt-2">Connected via OAuth</div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
            <div className="text-xs text-zinc-500">OAuth</div>
            <div className="text-sm text-zinc-200 mt-1">Connected</div>
            <div className="text-xs text-zinc-500 mt-2">GitHub</div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button
            onClick={() => router.push("/api/auth/logout")}
            className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/40 text-zinc-200"
          >
            Sign out of your account
          </button>
        </div>
      </div>
    </div>
  );
}
