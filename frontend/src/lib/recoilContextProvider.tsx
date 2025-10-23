"use client"; // This component must be a client component

import { RecoilRoot } from "recoil";
import React from "react";

export default function RecoilContextProvider({ children }: { children: React.ReactNode }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}

