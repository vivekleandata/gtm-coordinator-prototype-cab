import { Suspense } from "react";
import { PolicyBuilder } from "@/components/policy-builder";

export default function NewPolicyPage() {
  return (
    <Suspense fallback={null}>
      <PolicyBuilder mode="new" />
    </Suspense>
  );
}
