import { useState } from "react";

export function JourneyItem({ item }) {
  const [active, setActive] = useState(false);

  const toggle = () => {
    setActive((current) => !current);
  };

  return (
    <li
      className={`journey-item ${active ? "journey-item-active" : ""}`}
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle();
        }
      }}
      tabIndex={0}
      role="button"
      aria-expanded={active}
    >
      <span className="journey-period">{item.period}</span>

      <div className="journey-content">
        <div className="journey-title-row">
          <h3>{item.title}</h3>

          <span className="journey-node" aria-hidden="true">
            {active ? "−" : "+"}
          </span>
        </div>

        <p>{item.detail}</p>

        <div className="journey-state">
          <span>
            {active ? "ACTIVE MILESTONE" : "VIEW MILESTONE"}
          </span>

          <span>{active ? "↑" : "↘"}</span>
        </div>
      </div>
    </li>
  );
}