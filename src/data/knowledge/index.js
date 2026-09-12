import {
  profile,
  skillGroups,
  projects,
  education,
  achievements,
  learningJourney,
  extracurriculars,
} from "../index.js";

// AI-ready knowledge layer.
// This imports the main portfolio data so there is only one source of truth.

const safeText = (value) =>
  value === undefined || value === null
    ? ""
    : String(value);

const safeLower = (value) =>
  safeText(value).toLowerCase();

export const knowledgeBase = {
  profile: [
    {
      title: "Official name",
      text: safeText(profile.name),
      keywords: ["name", "who", "sandipan"],
    },
    {
      title: "Display name",
      text: safeText(profile.displayName),
      keywords: ["name", "display", "sandipan"],
    },
    {
      title: "Role",
      text: safeText(profile.role),
      keywords: ["role", "student", "developer", "learner"],
    },
    {
      title: "About",
      text: safeText(profile.about),
      keywords: ["about", "introduction", "profile", "background"],
    },
    {
      title: "Bio",
      text: safeText(profile.bio),
      keywords: ["bio", "about", "developer", "student"],
    },
    {
      title: "Availability",
      text: safeText(profile.availability),
      keywords: ["availability", "available", "currently"],
    },
  ],

  education: education.map((item) => ({
    title: safeText(item.title),
    text: `${safeText(item.institution)}. ${safeText(
      item.detail
    )}`,
    keywords: [
      "education",
      "university",
      "college",
      "bca",
      "study",
      "studying",
      safeLower(item.title),
      safeLower(item.institution),
    ].filter(Boolean),
  })),

  skills: skillGroups.flatMap((group) =>
    group.items
      .map((skill) =>
        typeof skill === "string"
          ? skill
          : skill?.name || skill?.title || ""
      )
      .filter(Boolean)
      .map((skill) => ({
        title: safeText(skill),
        text: `${safeText(skill)} - ${safeText(
          group.level
        )} (${safeText(group.category)})`,
        keywords: [
          "skill",
          "skills",
          "technology",
          "technologies",
          "know",
          "learned",
          "learning",
          safeLower(group.category),
          safeLower(skill),
        ].filter(Boolean),
      }))
  ),

  projects: projects.map((project) => ({
    title: safeText(project.title),
    text: `${safeText(project.summary)} Status: ${safeText(
      project.status
    )}. ${safeText(project.description)}`,
    keywords: [
      "project",
      "projects",
      "working",
      "work",
      "portfolio",
      "building",
      ...(
        Array.isArray(project.stack)
          ? project.stack
          : []
      ).map(safeText),
    ].filter(Boolean),
  })),

  learning: learningJourney.map((item) => ({
    title: safeText(item.title),
    text: safeText(
      item.description || item.detail
    ),
    keywords: [
      "learning",
      "learn",
      "currently",
      "focus",
      "journey",
      safeLower(item.period),
      safeLower(item.title),
    ].filter(Boolean),
  })),

  achievements: achievements.map((item) => ({
    title: safeText(item.title),
    text: `${safeText(item.issuer)}. ${safeText(
      item.date
    )}`,
    keywords: [
      "achievement",
      "achievements",
      "certificate",
      "certificates",
      "certification",
      safeLower(item.title),
    ].filter(Boolean),
  })),

  extracurriculars: extracurriculars.map((item) => ({
    title: safeText(item.title),
    text: safeText(item.description),
    keywords: [
      "extracurricular",
      "hobby",
      "interest",
      safeLower(item.title),
    ].filter(Boolean),
  })),

  certificates: [],
  experience: [],
  contact: [],
};

export const knowledgePolicy = {
  scope:
    "Answer only from the verified portfolio knowledge base.",

  unavailable:
    "That information is not currently documented in Sandipan's verified portfolio data.",

  prohibited: [
    "projects",
    "internships",
    "companies",
    "skills",
    "certificates",
    "achievements",
    "grades",
    "contact information",
    "personal claims",
  ],
};