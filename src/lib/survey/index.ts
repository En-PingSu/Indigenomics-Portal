// THE SURVEY SEAM — what the frontend imports. Frontend calls `surveyRepo`
// methods and never sees DynamoDB. Flip the backend with REPO_IMPL=dynamo
// (default = in-memory mock, so survey pages can be built without a database).
import type { SurveyRepo } from "./types";
import { mockSurveyRepo } from "./repo.mock";
import { dynamoSurveyRepo } from "./repo.dynamo";

export const surveyRepo: SurveyRepo =
  process.env.REPO_IMPL === "dynamo" ? dynamoSurveyRepo : mockSurveyRepo;

// Survey orgs are keyed `org-*`; portal companies are `c-*`. Map by prefix
// convention (c-cedartrust → org-cedartrust).
export const companyToOrgId = (companyId: string) => companyId.replace(/^c-/, "org-");

// re-export the types frontend will need for props/state
export type {
  Organization,
  SurveyResponse,
  SurveyRepo,
  Industry,
  RapType,
  Likert,
  Rating1to5,
  GovernanceStructure,
} from "./types";
