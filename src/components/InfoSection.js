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

const customContent = {       //Custom information for each cue type
  "University of Dundee": {
    History: "Founded in 1881 as University College Dundee, the institution originally operated as part of the University of St Andrews. Its independence in 1967 marked a pivotal shift in Scottish higher education. The university was deeply shaped by local benefactors such as Mary Ann Baxter, whose vision for accessible, practical education led to the development of world-class departments in medicine, law, and life sciences. Over the decades, the university has been at the forefront of research in cancer studies, DNA repair, and drug discovery, earning international acclaim.",
    Culture: "The university fosters an inclusive and eclectic cultural landscape. Its vibrant student unions host open mic nights, global food festivals, and sustainability fairs. The Bonar Hall, a multipurpose venue, showcases local musicians, stand-up comedians, and student theatre. The university also maintains strong ties to Dundee Contemporary Arts and the McManus Galleries, providing students opportunities to engage with the city’s dynamic art scene.",
    Travel: "Located on Perth Road and minutes from the River Tay, the university offers scenic walks towards Magdalen Green and Riverside Park. Visitors can enjoy artisanal coffee shops like Pacamara and brunch at The Tartan Coffee House. Historic landmarks such as the Verdant Works museum and Dundee Science Centre are within a 10-minute walk, making the university a perfect base to explore the city. Frequent bus services from Dundee Station ensure easy access, and the campus is fully walkable with cycling paths and bike racks available."
  },
  "University of Dundee Museum": {
    History: "Founded to celebrate and preserve the university’s academic and cultural milestones, the museum has grown into a repository of rare manuscripts, anatomical models, and early scientific instruments. It documents the evolution of teaching practices and breakthroughs in fields like genetics, pharmacology, and design, showcasing Dundee’s unique contributions to global education.",
    Culture: "The museum features curated exhibitions on everything from early dental practices to Scottish fine art. It often collaborates with student curators and artists-in-residence, and hosts events like “Science Through Art” nights and hands-on restoration workshops. Monthly “Heritage Walks” link displays to local landmarks and notable alumni stories.",
    Travel: "Just off Park Place, the museum is steps from the Tower Building and Duncan of Jordanstone College of Art. Nearby attractions include the Sensation Science Centre and Magdalen Green’s Victorian bandstand. Multiple bus lines stop at Nethergate, and Dundee’s Waterfront is just a 15-minute stroll."
  },
  "University of Dundee College Hall": {
    History: "Opening in the early 1900s, College Hall was among Dundee’s first permanent residential facilities for students. Designed in a modest Scottish Baronial style, it witnessed key moments such as post-war educational reform and the shift toward inclusive accommodation policies in the 1970s.",
    Culture: "Known for its sense of camaraderie, the hall has hosted generations of ceilidhs, open-mic nights, and late-night philosophy debates. Its shared kitchens double as storytelling venues and film screening rooms, while the common lounge often transforms into a seasonal craft market or improv stage.",
    Travel: "College Hall sits beside the Dalhousie Building and opposite Balfour Street cafés, offering easy access to Riverside Walk and the Botanic Garden. Visitors might also enjoy the scenic climb up Dundee Law, only 25 minutes on foot, for panoramic views over the Tay."
  },
  "University of Dundee Carnelley Building": {
    History: "Built in 1883 as the university’s first dedicated academic structure, the Carnelley Building was funded by philanthropist Mary Ann Baxter and named after chemistry pioneer Thomas Carnelley. The architecture reflects Victorian optimism in progress, housing the earliest chemical laboratories in Dundee and pioneering safety standards in scientific instruction.",
    Culture: "Beyond its legacy in science, the building today serves as a creative incubator. The School of Architecture and Design hosts seasonal showcases, like the “Material Narratives” exhibit and “Green Futures Lab,” blending chemistry with sustainable urban planning. Alumni talks and sketching sessions draw local artists and historians alike.",
    Travel: "Just west of the Main Library and within eyesight of the Bonar Hall, Carnelley Building sits near a line of food trucks during weekdays and bike rental stations. From here, one can explore the Japanese Garden in the Botanic Garden or grab lunch at The Coffee Bar on Airlie Place."
  },
  "Dundee Training College": {
    History: "Established in the early 20th century as part of Scotland’s push for structured teacher education, the Dundee Training College became instrumental in defining modern pedagogical standards. Over the years, it merged academic rigor with social progress, advocating gender equality in education and promoting community engagement through literacy campaigns.",
    Culture: "The college thrived on progressive methods — morning nature walks, music-integrated lessons, and experimental psychology studies. Its alumni include influential educators who shaped national policy. The building regularly hosts alumni reunions, oral history nights, and seminars on inclusive curriculum development.",
    Travel: "Located on Small’s Wynd near the University Library, the college is surrounded by quiet garden spaces perfect for reflection. A short walk leads to the Dundee Botanic Garden, Camperdown Park’s wildlife centre, and the eclectic West End Gallery. It’s also near the Nethergate shopping area, easily accessible by foot or local bus lines."
  },
  "Dundee Fleming Gym": {
  "History": "Opened in 1905 as a purpose-built gymnasium for University College Dundee, the Fleming Gym reflected early 20th-century ideals of physical education. It was named after philanthropist Robert Fleming, whose contributions to Dundee included funding for student facilities and workers’ housing.",
  "Culture": "Though originally a site for physical training, the building now houses the Leverhulme Research Centre for Forensic Science and the Centre for Anatomy and Human Identification. It plays a key role in forensic medicine and anatomical research, rather than student fitness.",
  "Travel": "Located on Small’s Wynd within the City Campus, the Fleming Gym Building is a short walk from the Tower Building and Airlie Place. It’s easily accessible via local bus routes and sits near several university landmarks, including the Geddes Quadrangle and the Carnelley Building."
},
  "Carnegie Building Dundee": {
    History: "Constructed with funds from philanthropist Andrew Carnegie in the early 1900s, the building originally supported Dundee’s expansion in technical and adult education. It later became an intellectual crucible for lifelong learning, public debate, and university outreach programs — embodying Carnegie’s dream of accessible knowledge.",
    Culture: "The building hosts the “Ideas Lab” lecture series, pop-up book fairs, and interdisciplinary workshops that unite students with local writers and researchers. Art from the McManus Galleries and Dundee Print Studio often graces its corridors, turning study breaks into cultural encounters.",
    Travel: "Situated on the eastern edge of campus near Hawkhill, the Carnegie Building is footsteps from Tower Building and Abertay’s campus, creating a mini academic quarter. Visitors can explore nearby sites like the Dundee Repertory Theatre and the V&A Museum, and relax at the garden square behind the Dalhousie Building."
  },
  "Airlie Place Dundee": {
    History: "Dating back to the mid-19th century, Airlie Place was developed as part of Dundee’s urban expansion and quickly became integrated into the university’s footprint. These sandstone villas and townhouses were repurposed over the decades into faculty offices and academic departments, retaining their ornate Victorian facades and woodwork interiors.",
    Culture: "Airlie Place is a haven for quiet reflection and creative output. It's often used for short films, student photography projects, and poetry readings in the garden nooks. Departments here foster small-group learning and mentorship culture, with occasional pop-up exhibitions in entry halls and student-led design showcases visible from the street.",
    Travel: "The lane links directly to the university quad and Tower Building. From here, visitors can explore the Dundee Botanic Garden or stroll down to Seabraes Viewpoint for stunning sunset vistas. The Tay Rail Bridge is just visible from nearby paths, and vibrant eateries like The Auld Tram and Dil’Se are within minutes."
  },
  "Hawkhill House Dundee": {
    History: "Built in the late 1800s, Hawkhill House began as a private residence before being acquired by the university in the mid-20th century. Its use has shifted from administrative headquarters to a retreat space for research symposiums and quiet academic work. With original fireplaces and panelled drawing rooms, the house retains much of its period charm.",
    Culture: "Hawkhill House offers a serene environment ideal for thought and conversation. It frequently hosts faculty writing retreats, interdisciplinary salons, and mindfulness workshops. During spring, its gardens bloom with daffodils and cherry blossoms, transforming into a natural refuge for students and staff.",
    Travel: "Accessible by the west trail from Airlie Place or the pedestrian path near Hawkhill Road, it’s just a 5-minute walk to the University Sports Pavilion and the historic Blackness Library. For a nature fix, visitors can meander to Victoria Gardens or cycle along the Green Circular Route nearby."
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
