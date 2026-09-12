import { useEffect, useState } from "react";

export function ProjectCard({ project }) {
  const [open, setOpen] = useState(false);

  const stack = Array.isArray(project.stack)
    ? project.stack
    : [];

  const codeLink =
    project.links?.code || project.github || "";

  const demoLink =
    project.links?.demo || project.demo || "";

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);

  return (
    <>
      <article
        className={`project-card ${
          open ? "project-card-open" : ""
        }`}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <div className="card-topline">
          <span className="status">
            {project.status}
          </span>
          <span aria-hidden="true">↗</span>
        </div>

        <h3>{project.title}</h3>

        <p>{project.summary}</p>

        {stack.length > 0 && (
          <div className="tags">
            {stack.map((item, index) => (
              <span key={`${item}-${index}`}>
                {item}
              </span>
            ))}
          </div>
        )}

        {(codeLink || demoLink) && (
          <div
            className="card-links"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {codeLink && (
              <a
                href={codeLink}
                target="_blank"
                rel="noreferrer"
              >
                Source
              </a>
            )}

            {demoLink && (
              <a
                href={demoLink}
                target="_blank"
                rel="noreferrer"
              >
                Live preview
              </a>
            )}
          </div>
        )}

        <span className="project-open-hint">
          Open project <span>↗</span>
        </span>
      </article>

      {open && (
        <div
          className="project-dialog-backdrop"
          onClick={() => setOpen(false)}
        >
          <div
            className="project-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} details`}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="project-dialog-top">
              <span>PROJECT / DETAILS</span>

              <button
                className="project-dialog-close"
                onClick={() => setOpen(false)}
                aria-label="Close project details"
              >
                ×
              </button>
            </div>

            <div className="project-dialog-content">
              <p className="eyebrow">
                {project.status}
              </p>

              <h2>{project.title}</h2>

              <p className="project-dialog-summary">
                {project.description ||
                  project.summary}
              </p>

              {stack.length > 0 && (
                <div className="project-dialog-stack">
                  <span className="project-dialog-label">
                    TECHNOLOGY
                  </span>

                  <div className="tags">
                    {stack.map((item, index) => (
                      <span
                        key={`${item}-${index}`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(codeLink || demoLink) && (
                <div className="project-dialog-links">
                  {codeLink && (
                    <a
                      className="button"
                      href={codeLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View source <span>↗</span>
                    </a>
                  )}

                  {demoLink && (
                    <a
                      className="text-button"
                      href={demoLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live preview →
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="project-dialog-footer">
              <span>ESC</span>
              <span>Close interface</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}