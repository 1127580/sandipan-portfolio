import { useState } from "react";

export function SkillCard({ group }) {
  const [expanded, setExpanded] = useState(false);

  const skills = Array.isArray(group.items)
    ? group.items
    : [];

  return (
    <article
      className={`skill-card ${
        expanded ? "skill-card-expanded" : ""
      }`}
      onClick={() =>
        setExpanded((current) => !current)
      }
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          setExpanded((current) => !current);
        }
      }}
    >
      <div className="skill-card-header">
        <p className="eyebrow">
          {group.category}
        </p>

        <span
          className="skill-card-toggle"
          aria-hidden="true"
        >
          {expanded ? "−" : "+"}
        </span>
      </div>

      <div className="skill-list">
        {skills.map((skill, index) => {
          const name =
            typeof skill === "string"
              ? skill
              : skill?.name ||
                skill?.title ||
                "";

          const level =
            typeof skill === "object" &&
            skill !== null
              ? skill.level
              : group.level;

          return (
            <span
              key={`${name}-${index}`}
            >
              {name}
              {level ? ` · ${level}` : ""}
            </span>
          );
        })}
      </div>

      <div className="skill-card-footer">
        <span>
          {expanded
            ? "Collapse interface"
            : "Explore capability"}
        </span>

        <span>
          {expanded ? "↙" : "↗"}
        </span>
      </div>
    </article>
  );
}