"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { surveyRepo, companyToOrgId } from "./index";
import { blankOrganization, blankResponse } from "./defaults";
import {
  parseProfileForm,
  parseContextForm,
  applyProfilePatch,
  applyContextPatch,
} from "./context-form";

// The org being edited is the logged-in company's own, derived from the signed
// session — never from a client-supplied orgId/companyId form field.
function sessionOrgId(): string | null {
  const session = getSession();
  if (session?.kind !== "company" || !session.partyId) return null;
  return companyToOrgId(session.partyId);
}

// Section A: edit the organisation profile. Load-or-blank → overlay → persist.
export async function updateProfileAction(formData: FormData) {
  const orgId = sessionOrgId();
  if (!orgId) return; // identity guard — silent no-op

  const now = new Date().toISOString();
  const base = (await surveyRepo.getOrganization(orgId)) ?? blankOrganization(orgId, now);
  const merged = applyProfilePatch(base, parseProfileForm(formData));
  await surveyRepo.putOrganization(merged);

  revalidatePath("/report");
  redirect("/report");
}

// Sections C + D: edit self-report context. Load-or-blank → overlay → persist.
export async function updateContextAction(formData: FormData) {
  const orgId = sessionOrgId();
  const year = String(formData.get("year") ?? "2025").trim();
  if (!orgId) return; // identity guard — silent no-op

  const now = new Date().toISOString();
  const base = (await surveyRepo.getResponse(orgId, year)) ?? blankResponse(orgId, year, now);
  const merged = applyContextPatch(base, parseContextForm(formData));
  await surveyRepo.putResponse(merged);

  revalidatePath("/report");
  redirect("/report");
}
