import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PolicyBuilder } from "@/components/policy-builder";
import { POLICIES } from "@/lib/fixtures";

export default async function EditPolicyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const policy = POLICIES.find((p) => p.id === id);
  if (!policy) notFound();
  return (
    <Suspense fallback={null}>
      <PolicyBuilder mode="edit" policyId={id} />
    </Suspense>
  );
}
