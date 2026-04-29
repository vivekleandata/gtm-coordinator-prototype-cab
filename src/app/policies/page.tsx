import { Suspense } from "react";
import { POLICIES, POLICY_CATEGORIES } from "@/lib/fixtures";
import { PoliciesClient } from "./policies-client";

export default function PoliciesPage() {
  return (
    <Suspense fallback={null}>
      <PoliciesClient policies={POLICIES} categories={POLICY_CATEGORIES} />
    </Suspense>
  );
}
