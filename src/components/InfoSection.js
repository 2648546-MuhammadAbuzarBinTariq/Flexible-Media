import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/info.css";

const subsections = {           //Content categories used in the accordion info-box
  History: "history",
  People: "biography",
  Culture: "culture",
  Travel: "tourism",
  Feedback: "feedback",
};

const customContent = {         // Custom information for each cue type
  
  "University of Dundee": {
    History: "Founded in 1881 as University College, Dundee through the philanthropy of Mary Ann Baxter and her cousin John Boyd Baxter, the institution joined the University of St Andrews in 1897 before gaining full independence by Royal Charter in 1967. Since then Dundee has grown into a research-intensive university, especially renowned in Life Sciences and Medicine, with global recognition for areas like drug discovery, pharmacology and biological sciences.",
    Culture: "Campus culture revolves around an active students’ union and a busy public-facing arts scene. University Museums run exhibitions in the Tower Foyer and Lamb Galleries and maintain the D’Arcy Thompson Zoology Museum. Across the road you’ve got Dundee Contemporary Arts (DCA) and the city’s wider arts venues, which the University frequently collaborates with via talks, exhibitions and outreach.",
    Travel: "City Campus sits between Perth Road and the River Tay. From the Tower Building you’re a short walk to Magdalen Green, the V&A Dundee on the Waterfront, Verdant Works and Dundee Science Centre. The main rail station (Dundee) and frequent bus links make the campus walkable; most teaching buildings cluster around the Geddes Quadrangle, Dalhousie Building and Small’s Wynd."
  },

  "University of Dundee Museum": {
    History: "University Museum Services care for hundreds of artefacts, artworks and specimens built up since the University’s 1880s origins. The main public spaces are the Tower Foyer Gallery (ground floor) and the Lamb Gallery (first floor) in the Tower Building, plus the D’Arcy Thompson Zoology Museum in the Carnelley Building.",
    Culture: "Rotating exhibitions mix art, science and University history, alongside talks, tours and occasional 3D/virtual displays. Collections range from fine art to scientific instruments, medical teaching models and zoological specimens tied to Dundee’s research heritage.",
    Travel: "Tower Building (Nethergate) houses the Tower Foyer and Lamb Galleries; the Zoology Museum is in the Carnelley Building basement (City Campus). Opening hours vary by venue, with regular weekday access to the Tower/Lamb and scheduled openings for the Zoology Museum."
  },

  "University of Dundee College Hall": {
    History: "College Hall is a longstanding University venue just off College Green, used for formal gatherings for decades and closely tied to the transition from University College/Queen’s College to the modern University of Dundee.",
    Culture: "Today it’s a flexible events space for receptions, ceremonies, lectures and student activities—often used alongside nearby outdoor space at College Green.",
    Travel: "Located behind the Tower Building on the City Campus, near College Green and DUSA. It’s a short walk to the Enquiry Hub, Dalhousie Building and the Geddes Quadrangle."
  },

  "University of Dundee Carnelley Building": {
    History: "Opened in 1883 as University College Dundee’s original purpose-built academic building, funded with Mary Ann Baxter’s endowment and named for chemist Thomas Carnelley. It housed early chemistry labs and set high standards for scientific teaching at the new college.",
    Culture: "The building connects science and culture: it hosts the D’Arcy Thompson Zoology Museum—a teaching and public space curated by University Museums—and supports teaching linked to Life Sciences.",
    Travel: "Carnelley sits just west of the Main Library and close to the Tower and Bonar Hall. It’s easily reached from Perth Road via the campus lanes; the Zoology Museum entrance is in the basement."
  },

  "Dundee Training College": {
    History: "Established in 1906 as Dundee Training College (teacher education) without its own premises, the College initially shared the Technical Institute on Small’s Wynd. A dedicated Park Place building opened in 1921. In 1975 the College moved to new premises at West Ferry (Gardyne Road). In 1987 the Aberdeen and Dundee colleges merged to form Northern College, and in 2001 teacher education in Dundee transferred into the University as the (now) School of Education & Social Work. The former Park Place buildings were taken over by the University (e.g., Scrymgeour Building and the Dental School/Teaching complex).",
    Culture: "Dundee Training College pioneered modern teacher education locally—model schools, demonstration teaching and strong community links—and its legacy continues through University teacher-education programmes and public-engagement work.",
    Travel: "Historic sites are clustered on Park Place: opposite the Tower Building and near the Dental School. Today, Education teaching and student services are concentrated on City Campus (e.g., Dalhousie Building), minutes from the Geddes Quadrangle and Perth Road bus links."
  },

  "Dundee Fleming Gym": {
    History: "The Fleming Gymnasium at the University of Dundee, opened in 1905 and funded by Dundee-born financier Robert Fleming, was originally built as a center for physical education. Designed by John Donald Mills and Godfrey D. B. Shepherd, the building features early 20th-century architectural elements, including a two-storey fives court, stugged and snecked ashlar walls, and distinctive round-arched windows. The building later pivoted from sport to research and is now part of Dundee’s forensic-science cluster.",
    Culture: "Today the Fleming Gym Building houses the Leverhulme Research Centre for Forensic Science and is closely associated with CAHID (Centre for Anatomy & Human Identification) activity across Small’s Wynd, reflecting Dundee’s international profile in forensic science and anatomy.",
    Travel: "On Small’s Wynd in the City Campus research quarter, a short walk from the Tower, Carnelley and the Old Medical School. The lanes connect quickly to Perth Road and to the Riverside paths."
  },

  "Carnegie Building Dundee": {
    History: "Built in 1909 as the University’s physics laboratory with support from Andrew Carnegie’s philanthropy, the building became a hub for mid-20th-century X-ray crystallography at Dundee (notably 1950s–80s) and underpins the city’s long arc from physics to today’s life-sciences discovery.",
    Culture: "Carnegie’s heritage is celebrated in campus heritage trails and guides, linking historical physics research to current strengths in biomedical science and drug discovery.",
    Travel: "Located on the Geddes Quadrangle just off Perth Road, a few steps from the Carnelley and Tower Buildings and Bonar Hall—ideal for exploring the historic heart of City Campus."
  },

  "Airlie Place Dundee": {
    History: "A mid-19th-century terrace linking Perth Road to the campus core. The row is B-listed and many houses have been adapted over time for University offices, student accommodation and some private residences, while retaining their Victorian façades.",
    Culture: "Airlie Place is a quiet, leafy cut-through used for small meetings, project spaces and occasional photo/film shoots. Its domestic scale supports small-group teaching and staff offices within easy reach of main teaching blocks.",
    Travel: "It’s the pedestrian link between Perth Road and the Geddes Quadrangle/Tower Building area, close to the Main Library and DUSA. From here you can continue to Magdalen Green, the Waterfront and the Seabraes viewpoint."
  },

  "Hawkhill House Dundee": {
    History: "An 18th-century residence and the oldest building on the University’s campus. It has hosted the University Herbarium and now houses University Museums’ stores and offices. The house is also associated with Sir James Alfred Ewing’s early life in Dundee.",
    Culture: "Hawkhill House features in Doors Open Days with guided tours showcasing stored collections of art, science and natural history. It anchors the University’s behind-the-scenes museum work and occasional public events.",
    Travel: "Tucked behind DJCAD off Hawkhill Place, a short walk from Perth Road and the DCA. Visitors usually approach via the pedestrian paths linking Old Hawkhill, Miller’s Wynd and the core campus."
  }
};




const customPeopleContent = {
  "Sir David Baxter, 1st Baronet": {
    People: "A towering figure in Dundee’s 19th-century industrial boom, Sir David Baxter was a visionary entrepreneur in textiles whose philanthropic influence reshaped the city. In addition to funding the University of Dundee’s foundations, he established Baxter Park as a green space for public leisure and funded scholarships to support social mobility. A generous benefactor to education and culture, Baxter believed in civic responsibility and practical learning. His legacy lives on through institutions and public spaces that bear his name, reflecting a lifelong dedication to improving Dundee’s urban fabric and its people’s prospects."
  },
  "James Alfred Ewing": {
    People: "James Alfred Ewing was a pioneering physicist and engineer whose discovery of magnetic hysteresis helped shape the development of electrical engineering. His research provided foundational insights for transformers and magnetic storage technology. As Principal of University College Dundee in the early 20th century, Ewing not only advanced the college’s academic standing but also engaged in early seismology research, helping design instruments to measure earthquakes. His scientific acumen later saw him take a crucial role in naval intelligence during World War I, merging technical expertise with national defense. Ewing’s influence bridged academia, innovation, and strategic leadership."
  },
  "Darcy Thompson": {
    People: "D'Arcy Wentworth Thompson was a renowned biologist, mathematician, and classicist whose interdisciplinary brilliance culminated in his seminal work 'On Growth and Form'. Published in 1917, the book revolutionized how natural forms are understood, using geometry and physics to explain biological patterns. As Professor of Natural History at University College Dundee, Thompson was instrumental in expanding the natural science curriculum and curating the university’s zoological collections. He encouraged cross-disciplinary dialogue between scientists and artists, laying the groundwork for what would become design-driven biology. His legacy is felt not only in academia but in architecture, animation, and generative design worldwide."
  },
  "Edward Wesley Reed": {
    People: "Edward Wesley Reed was a transformative educator who helped shape Dundee’s approach to teacher training in the 20th century. As a founding member of Dundee Training College, Reed championed learner-centered instruction and helped integrate psychological research into pedagogical methods. He advocated for inclusive education, believing that teaching should adapt to student needs rather than enforce rigid standards. Reed introduced dynamic curriculum strategies, emphasizing creativity, empathy, and personal development. His legacy continues through the evolution of Dundee’s School of Education, which carries forward his vision of a more compassionate, imaginative, and student-driven learning environment."
  }
};


const InfoSection = ({ activeLabel, cueType }) => {
  const [wikiContent, setWikiContent] = useState({
    History: "No Info To Display",
    People: "No Info To Display",
    Culture: "No Info To Display",
    Travel: "No Info To Display",
  });

  const [userFeedback, setUserFeedback] = useState([]);
  const [activePanel, setActivePanel] = useState(null);

 
  useEffect(() => {           //Update wikiContent based on cueType and activeLabel
    if (!activeLabel) return;

    setWikiContent((prevWikiContent) => {
      const updates = { ...prevWikiContent };

      Object.keys(subsections).forEach((section) => {
        const isCultureOrTravel = section === "Culture" || section === "Travel";
        const isPersonCue = cueType === "person";
        const isLocationCue = cueType === "location";

        let newContent;

        if (section === "Feedback") {
          newContent = "";
        } else if (isCultureOrTravel && isLocationCue) {
          newContent = customContent[activeLabel]?.[section];
        } else if (section === "People" && isPersonCue) {
          newContent = customPeopleContent[activeLabel]?.[section];
        } else if (section === "History" && isLocationCue) {
          newContent = customContent[activeLabel]?.[section];
        }

        if (newContent && newContent.trim() !== "") {
          updates[section] = newContent;
        }
      });

      return updates;
    });

    setActivePanel(null);
  }, [activeLabel, cueType]);


  useEffect(() => {             //Fetch user feedback
    if (!activeLabel) return;

    const fetchRandomFeedback = async () => {
      try {
        const snapshot = await getDocs(collection(db, "full_feedback"));

        const allMatchingFeedbacks = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const feedbackMap = data.locationFeedback || {};

          const feedback = feedbackMap[activeLabel];
          if (feedback && feedback !== "-") {
            allMatchingFeedbacks.push(feedback);
          }
        });

        if (allMatchingFeedbacks.length > 0) {
          const shuffled = allMatchingFeedbacks
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);           // Take up to 3 user comments from database
          setUserFeedback(shuffled);
        } else {
          setUserFeedback(["No feedback available for this location."]);
        }
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setUserFeedback(["Error loading feedback."]);
      }
    };

    fetchRandomFeedback();
  }, [activeLabel]);

  const togglePanel = (section) => {
    setActivePanel((prev) => (prev === section ? null : section));
  };

  return (
    <div className="info-container">
      {Object.keys(subsections).map((section) => {
        const isActive = activePanel === section;
        

        return (            //Render info panels
          <div key={section} className={`accordion-section ${isActive ? "active" : ""}`}>
            <button className="accordion-toggle" onClick={() => togglePanel(section)}>
              <span className="accordion-icon">{isActive ? "▼" : "▶"}</span>
              {section === "Feedback" ? "What Others Think" : section}
            </button>

            <div className={`accordion-panel ${isActive ? "open" : ""}`}>
              <div className="panel-content">
                <h3>{section === "Feedback" ? "What Others Think" : section}</h3>
                {section === "Feedback" ? (
                  Array.isArray(userFeedback) ? (
                    <div className="feedback-list">
                      {userFeedback.map((fb, idx) => (
                        <div key={idx} className="feedback-bubble">
                          <em>“{fb}”</em>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p><em>“{userFeedback}”</em></p>
                  )
                ) : (
                  <p>{wikiContent[section]}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InfoSection;
