import { useEffect, useRef, useState } from "react";
import {
  profile,
  skillGroups,
  projects,
  education,
  achievements,
  achievementsEmptyState,
  learningJourney,
  extracurriculars,
} from "./data";
import { ProjectCard } from "./components/ProjectCard";
import { SkillCard } from "./components/SkillCard";
import { SearchDialog } from "./components/SearchDialog";
import { AISheet } from "./components/AISheet";
import { JourneyItem } from "./components/JourneyItem";
import "./navigation.css";
import "./hero.css";
import "./boot.css";

const nav = [
  "About",
  "Skills",
  "Projects",
  "Journey",
  "Education",
  "Achievements",
  "Extra",
  "Contact",
];

const sectionId = (value) =>
  value.toLowerCase().replace(" ", "-");

export default function App() {
  const [booting, setBooting] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [projectsActive, setProjectsActive] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const aiTriggerRef = useRef(null);
  const projectsRef = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBooting(false);
    }, 3400);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const shortcut = (event) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", shortcut);

    return () => {
      window.removeEventListener("keydown", shortcut);
    };
  }, []);

  useEffect(() => {
    const sections = [
      "home",
      ...nav.map((item) => sectionId(item)),
    ]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio -
              a.intersectionRatio
          );

        if (visibleEntries.length) {
          setActiveSection(
            visibleEntries[0].target.id
          );
        }
      },
      {
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0.05, 0.2, 0.4, 0.7],
      }
    );

    sections.forEach((section) =>
      observer.observe(section)
    );

    return () => observer.disconnect();
  }, []);

  const openAI = (event) => {
    aiTriggerRef.current =
      event.currentTarget;

    setAiOpen(true);
    setMenuOpen(false);
  };

  const closeAI = () => {
    setAiOpen(false);

    window.setTimeout(() => {
      aiTriggerRef.current?.focus();
    }, 0);
  };

  const openProjects = (event) => {
    event.preventDefault();

    setProjectsActive(true);
    setMenuOpen(false);
    setActiveSection("projects");

    projectsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.setTimeout(() => {
      setProjectsActive(false);
    }, 1100);
  };

  const handleNavClick = (id) => {
    setActiveSection(id);
    setMenuOpen(false);
  };

  const totalSkills = skillGroups.reduce(
    (total, group) =>
      total + group.items.length,
    0
  );

  return (
    <>
      {booting && (
        <div
          className="cinematic-intro"
          aria-hidden="true"
        >
          <div className="intro-space" />
          <div className="intro-stars" />
          <div className="intro-horizon" />

          <div className="intro-floor">
            <div className="floor-lines" />
          </div>

          <div className="intro-light intro-light-left" />
          <div className="intro-light intro-light-right" />

          <div className="flythrough">
            <div className="world-layer world-one">
              <div className="world-frame">
                <span className="world-corner top-left" />
                <span className="world-corner top-right" />
                <span className="world-corner bottom-left" />
                <span className="world-corner bottom-right" />

                <div className="world-number">01</div>

                <div className="world-title">
                  ENGINEERING
                  <br />
                  <em>WORLD</em>
                </div>

                <div className="world-subtitle">
                  ENTERING DIGITAL SPACE
                </div>
              </div>
            </div>

            <div className="world-layer world-two">
              <div className="world-frame">
                <span className="world-corner top-left" />
                <span className="world-corner top-right" />
                <span className="world-corner bottom-left" />
                <span className="world-corner bottom-right" />

                <div className="world-number">02</div>

                <div className="world-title">
                  SOFTWARE
                  <br />
                  <em>DEPARTMENT</em>
                </div>

                <div className="world-subtitle">
                  SYSTEMS · CODE · DEVELOPMENT
                </div>
              </div>
            </div>

            <div className="world-layer world-three">
              <div className="world-frame">
                <span className="world-corner top-left" />
                <span className="world-corner top-right" />
                <span className="world-corner bottom-left" />
                <span className="world-corner bottom-right" />

                <div className="world-number">03</div>

                <div className="world-title bca-title">
                  BCA
                </div>

                <div className="world-subtitle">
                  BACHELOR OF COMPUTER APPLICATIONS
                </div>
              </div>
            </div>

            <div className="identity-layer">
              <div className="identity-ring ring-one" />
              <div className="identity-ring ring-two" />

              <div className="identity-core">
                <span>SP</span>
              </div>

              <div className="identity-line" />

              <strong>SANDIPAN PAUL</strong>

              <small>
                STUDENT · DEVELOPER · LEARNER
              </small>
            </div>
          </div>

          <div className="intro-topbar">
            <span>SYSTEM / PORTFOLIO</span>
            <span>2026</span>
          </div>

          <div className="intro-corner intro-left">
            <span>ADAMAS UNIVERSITY</span>
            <span>BCA · SEMESTER 05</span>
          </div>

          <div className="intro-corner intro-right">
            <span>INITIALIZING</span>
            <span>PERSONAL INTERFACE</span>
          </div>

          <div className="intro-progress">
            <span />
          </div>
        </div>
      )}

      <header
        className={`site-header ${
          menuOpen
            ? "site-header-menu-open"
            : ""
        }`}
      >
        <a
          className="brand"
          href="#home"
          aria-label={`${profile.name} home`}
          onClick={() => {
            setActiveSection("home");
            setMenuOpen(false);
          }}
        >
          <span>S</span>{" "}
          {profile.displayName}
        </a>

        <nav
          className={menuOpen ? "open" : ""}
          aria-label="Main navigation"
        >
          <div className="nav-system-line">
            <span>SYSTEM NAVIGATION</span>
            <span>ONLINE</span>
          </div>

          {nav.map((item, index) => {
            const id = sectionId(item);
            const isActive =
              activeSection === id;

            return (
              <a
                key={item}
                href={`#${id}`}
                className={
                  isActive
                    ? "nav-active"
                    : ""
                }
                onClick={() =>
                  handleNavClick(id)
                }
                style={{
                  "--nav-index": index,
                }}
              >
                <span className="nav-index">
                  0{index + 1}
                </span>

                <span className="nav-name">
                  {item}
                </span>

                <span
                  className="nav-status"
                  aria-hidden="true"
                >
                  {isActive
                    ? "●"
                    : "○"}
                </span>
              </a>
            );
          })}
        </nav>

        <div className="header-actions">
          <button
            className="search-trigger"
            onClick={() =>
              setSearchOpen(true)
            }
          >
            ⌕ <span>Search</span>
            <kbd>⌘ K</kbd>
          </button>

          <button
            className={`menu-button ${
              menuOpen
                ? "menu-button-active"
                : ""
            }`}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() =>
              setMenuOpen(
                (current) => !current
              )
            }
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        <section
          id="home"
          className="hero container"
        >
          <div className="hero-copy">
            <p className="eyebrow">
              {profile.role} · Building in public
            </p>

            <h1>
              Hi, I’m{" "}
              <em>{profile.displayName}.</em>
              <br />
              I make learning visible.
            </h1>

            <p className="lead">
              {profile.bio}
            </p>

            <div className="hero-actions">
              <a
                className="button"
                href="#projects"
                onClick={openProjects}
              >
                Explore projects{" "}
                <span>→</span>
              </a>

              <button
                className="text-button"
                onClick={() =>
                  setSearchOpen(true)
                }
              >
                Browse knowledge base
              </button>
            </div>
          </div>

          <aside className="hero-hud">
            <div className="hero-hud-top">
              <span>PROFILE / SYSTEM</span>

              <span className="hud-live">
                <i /> LIVE
              </span>
            </div>

            <div className="hud-core">
              <div className="hud-orbit hud-orbit-one" />
              <div className="hud-orbit hud-orbit-two" />

              <div className="hud-crosshair">
                <span />
              </div>

              <div className="hud-core-label">
                <strong>SP</strong>
                <small>DEVELOPER</small>
              </div>
            </div>

            <div className="hero-hud-data">
              <div className="hud-data-row">
                <span>IDENTITY</span>
                <strong>
                  {profile.displayName}
                </strong>
              </div>

              <div className="hud-data-row">
                <span>PROGRAM</span>
                <strong>BCA</strong>
              </div>

              <div className="hud-data-row">
                <span>SEMESTER</span>
                <strong>05</strong>
              </div>

              <div className="hud-data-row">
                <span>SKILLS INDEX</span>
                <strong>
                  {String(totalSkills).padStart(
                    2,
                    "0"
                  )}
                </strong>
              </div>
            </div>

            <div className="hero-hud-footer">
              <span>ADAMAS UNIVERSITY</span>
              <span>
                BUILD / LEARN / IMPROVE
              </span>
            </div>
          </aside>

          <aside className="profile-note">
            <span className="presence" />{" "}
            {profile.availability}

            <div>
              <strong>01</strong>

              <p>
                A portfolio built as a
                growing, searchable record
                of work and learning.
              </p>
            </div>
          </aside>
        </section>

        <section
          id="about"
          className="container split-section"
        >
          <div>
            <p className="eyebrow">About</p>

            <h2>
              A developer identity, built
              one useful thing at a time.
            </h2>
          </div>

          <div className="body-copy">
            <p>{profile.about}</p>

            <p className="placeholder-note">
              Personal bio, interests, and
              location can be added in{" "}
              <code>
                src/data/profile.js
              </code>
              .
            </p>
          </div>
        </section>

        <section
          id="skills"
          className="container section"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                Capabilities
              </p>

              <h2>
                Skills, with room to grow.
              </h2>
            </div>

            <p>
              Maintained as structured data,
              ready for search and future AI
              answers.
            </p>
          </div>

          <div className="skill-grid">
            {skillGroups.map((group) => (
              <SkillCard
                key={group.category}
                group={group}
              />
            ))}
          </div>
        </section>

        <section
          id="projects"
          ref={projectsRef}
          className={`container section projects-section ${
            projectsActive
              ? "projects-section-active"
              : ""
          }`}
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                Selected work
              </p>

              <h2>
                Projects that tell the
                story.
              </h2>
            </div>

            <a
              className="inline-link"
              href="#contact"
              onClick={() =>
                handleNavClick("contact")
              }
            >
              Have an opportunity?
              Get in touch →
            </a>
          </div>

          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project.title}
                project={project}
              />
            ))}
          </div>
        </section>

        <section
          id="journey"
          className="container section"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                Learning journey
              </p>

              <h2>
                Progress, documented.
              </h2>
            </div>
          </div>

          <ol className="timeline">
            {learningJourney.map((item) => (
              <JourneyItem
                key={item.title}
                item={item}
              />
            ))}
          </ol>
        </section>

        <section
          id="education"
          className="container section compact"
        >
          <p className="eyebrow">
            Education
          </p>

          {education.map((item) => (
            <article
              className="detail-row"
              key={item.title}
            >
              <div>
                <h3>{item.title}</h3>
                <p>{item.institution}</p>
              </div>

              <div>
                <strong>{item.period}</strong>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </section>

        <section
          id="extra"
          className="container section compact"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                Extra-curricular
              </p>

              <h2>
                Beyond the screen.
              </h2>
            </div>

            <p>
              A few things that keep the
              journey creative and balanced.
            </p>
          </div>

          <div className="extra-grid">
            {extracurriculars.map((item) => (
              <article
                className="detail-row extra-card"
                key={item.title}
              >
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <span className="extra-mark">
                  ↗
                </span>
              </article>
            ))}
          </div>
        </section>

        <section
          id="achievements"
          className="container section compact"
        >
          <p className="eyebrow">
            Achievements & certifications
          </p>

          {achievements.length ? (
            achievements.map((item) => (
              <article
                className="detail-row"
                key={item.title}
              >
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.issuer}</p>
                </div>

                <strong>{item.date}</strong>
              </article>
            ))
          ) : (
            <article className="detail-row">
              <div>
                <h3>
                  {achievementsEmptyState.title}
                </h3>

                <p>
                  {achievementsEmptyState.detail}
                </p>
              </div>
            </article>
          )}
        </section>

        <section
          id="resume"
          className="container resume-card"
        >
          <div>
            <p className="eyebrow">
              Resume
            </p>

            <h2>
              A concise view of the
              journey so far.
            </h2>

            <p>
              The resume link is
              intentionally inactive until{" "}
              {profile.displayName} adds a
              verified file.
            </p>
          </div>

          <a
            className="button muted"
            aria-disabled="true"
          >
            Resume coming soon
          </a>
        </section>

        <section
          className="container ai-panel"
          aria-labelledby="ai-title"
        >
          <div>
            <p className="eyebrow">
              Portfolio intelligence
            </p>

            <h2 id="ai-title">
              Meet Sandipan AI
            </h2>

            <p>
              Ask questions using
              Sandipan’s verified portfolio
              information without leaving
              the portfolio.
            </p>
          </div>

          <div className="ai-samples">
            <span>
              Verified portfolio data
            </span>

            <span>
              Conversation-ready
            </span>

            <span>
              Clear knowledge boundaries
            </span>
          </div>

          <button
            className="button"
            onClick={openAI}
          >
            Open Sandipan AI{" "}
            <span>→</span>
          </button>
        </section>

        <section
          id="contact"
          className="container contact"
        >
          <p className="eyebrow">
            Contact
          </p>

          <h2>
            Let’s build something
            worthwhile.
          </h2>

          <p>
            For collaborations,
            internships, or a conversation
            about technology.
          </p>

          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
            >
              {profile.email}
            </a>
          ) : (
            <p className="placeholder-note">
              {profile.contactPlaceholder}
            </p>
          )}

          {(profile.links.github ||
            profile.links.linkedin) && (
            <div className="socials">
              {profile.links.github && (
                <a
                  href={profile.links.github}
                >
                  GitHub
                </a>
              )}

              {profile.links.linkedin && (
                <a
                  href={profile.links.linkedin}
                >
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </section>
      </main>

      <footer>
        <span>
          © {new Date().getFullYear()}{" "}
          {profile.name}
        </span>

        <span>
          Designed as an evolving
          developer knowledge base.
        </span>
      </footer>

      <nav
        className="ai-fab-wrap"
        aria-label="Portfolio assistant"
      >
        <button
          className="ai-fab"
          onClick={openAI}
          aria-label="Open Sandipan AI"
        >
          <span aria-hidden="true">
            ✦
          </span>

          <span className="ai-fab-label">
            Sandipan AI
          </span>
        </button>
      </nav>

      <SearchDialog
        open={searchOpen}
        onClose={() =>
          setSearchOpen(false)
        }
      />

      <AISheet
        open={aiOpen}
        onClose={closeAI}
      />
    </>
  );
}