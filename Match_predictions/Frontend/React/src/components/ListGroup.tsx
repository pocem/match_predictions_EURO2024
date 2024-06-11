import "../App.css";
import { useState } from "react";
import useWindowSize from "./WindowSize"; // Import the custom hook

function ParticipantsListGroup() {
  const countriesFbAssociations = {
    Albania: "https://fshf.org/en/",
    Austria: "https://www.oefb.at/oefb",
    Belgium: "https://www.rbfa.be/en",
    Croatia: "https://hns-cff.hr/",
    Czechia: "https://facr.fotbal.cz/en",
    Denmark: "https://www.dbu.dk/",
    England: "https://www.thefa.com/",
    France: "https://www.fff.fr/",
    Georgia: "https://gff.ge/en",
    Germany: "https://www.dfb.de/",
    Hungary: "https://en.mlsz.hu/",
    Italy: "https://www.figc.it/en/",
    Netherlands: "https://www.knvb.com/",
    Poland: "https://www.pzpn.pl/en/",
    Portugal: "https://www.fpf.pt/",
    Romania: "https://www.frf.ro/",
    Scotland: "https://www.scottishfa.co.uk/",
    Serbia: "https://www.fss.rs/",
    Slovakia: "https://www.futbalsfz.sk/en",
    Slovenia: "https://www.nzs.si/",
    Spain: "https://www.rfef.es/",
    Switzerland: "https://www.football.ch/",
    Turkey: "https://www.tff.org/",
    Ukraine: "https://en.uaf.ua/",
  };

  const [isMinimized, setIsMinimized] = useState(false);
  const { width } = useWindowSize(); // Get the window width

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };

  // Do not render the component if the screen width is less than 768px
  if (width < 768) {
    return null;
  }

  return (
    <>
      <div className="white-color-text">
        <h2>
          Participants{" "}
          <button
            className="btn btn-link btn-sm"
            onClick={toggleMinimized}
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? "▼" : "▲"}
          </button>
        </h2>
      </div>
      <div
        className={`list-group fly-in ${
          isMinimized ? "minimized" : ""
        } list-group-scroll `}
      >
        {Object.entries(countriesFbAssociations).map(([country, website]) => (
          <a
            key={country}
            className="list-group-item list-group-item-action button-hover"
            onClick={() => window.open(website, "_blank")}
          >
            {country}
          </a>
        ))}
      </div>
    </>
  );
}

export default ParticipantsListGroup;
