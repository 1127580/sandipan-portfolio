export { profile } from "./profile.js";
export { skillGroups } from "./skills.js";
export { projects } from "./projects.js";
export { education } from "./education.js";
export { achievements } from "./achievements.js";
export { achievementsEmptyState } from "./achievements.js";
export { learningJourney } from "./learning.js";

export const extracurriculars = [
  {
    title: "Guitar",
    description:
      "Playing guitar as a creative break from technical work and studies. It adds a creative side to the technical learning journey.",
  },
  {
    title: "Gaming",
    description:
      "Gaming as a form of entertainment and interactive experience, with an interest in technology, design, systems, and user interaction.",
  },
];

import { skillGroups } from "./skills.js";
import { projects } from "./projects.js";
import { education } from "./education.js";
import { achievements } from "./achievements.js";
import { learningJourney } from "./learning.js";

const entries = (type, records) =>
  records.map((record) => ({
    type,
    ...record,
  }));

const normalizeSkill = (item) => {
  if (typeof item === "string") {
    return item;
  }

  if (item && typeof item === "object") {
    return item.name || item.title || "";
  }

  return "";
};

export const searchableContent = [
  ...skillGroups.flatMap((group) =>
    group.items
      .map(normalizeSkill)
      .filter(Boolean)
      .map((item) => ({
        type: "Skill",
        title: item,
        summary: `${group.category} - ${group.level}`,
      }))
  ),

  ...entries("Project", projects).map(
    ({ title, summary, stack, ...rest }) => ({
      ...rest,
      title: title || "",
      summary: summary || "",
      keywords: Array.isArray(stack) ? stack : [],
    })
  ),

  ...entries("Education", education).map(
    ({ title, institution, detail, ...rest }) => ({
      ...rest,
      title: title || "",
      summary: `${institution || ""} - ${detail || ""}`,
    })
  ),

  ...entries("Achievement", achievements).map(
    ({ title, issuer, date, ...rest }) => ({
      ...rest,
      title: title || "",
      summary: `${issuer || ""} - ${date || ""}`,
    })
  ),

  ...entries("Learning", learningJourney).map(
    ({ title, description, detail, ...rest }) => ({
      ...rest,
      title: title || "",
      summary: description || detail || "",
    })
  ),

  ...entries("Extracurricular", extracurriculars).map(
    ({ title, description, ...rest }) => ({
      ...rest,
      title: title || "",
      summary: description || "",
    })
  ),
];