import React, { useEffect, useState ,useRef} from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../Api/Api";
import * as ActionCable from "@rails/actioncable";

// WSS cable for production
// const cable = ActionCable.createConsumer("ws://localhost:3000/cable");
const cable = ActionCable.createConsumer("wss://backendafp.connectorcore.com/cable");

function ContainerView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("authToken");
  // const [showIntroScreen, setShowIntroScreen] = useRef(true);

  const [showCover, setShowCover] = useState(() => {
    const stored = sessionStorage.getItem("coverShown");
    return stored !== "true"; 
  });

  const closeCover = () => {
    sessionStorage.setItem("coverShown", "true");
    setShowCover(false);
  };

  const openCover = () => {
    sessionStorage.setItem("coverShown", "false");
    setShowCover(true);  
    setLogoAnimated(false);
  };

  const morepage = sessionStorage.getItem("moresection");

  console.log(morepage, "=================================morepage===============================")


  // -------------------------
  // HOOKS (fixed order)
  // -------------------------
  const [container, setContainer] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContentContainer, setShowContentContainer] = useState(false);
  const [screenId, setScreenId] = useState(null);

  const [logoAnimated, setLogoAnimated] = useState(false);

  // -------------------------
  // DATA FETCH
  // -------------------------
  const fetchContainer = async () => {
    try {
      const res = await fetch(`${Api}/api/v1/screen_containers/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("✅ Fetched container:", data);
      setContainer(data);
    } catch (err) {
      console.error("❌ Error fetching container:", err);
    }
  };

  // Initial load + ActionCable subscription
  useEffect(() => {
    fetchContainer();

    const subscription = cable.subscriptions.create(
      { channel: "ContainerChannel", slug },
      {
        received: (data) => {
          if (data.action === "refresh") {
            fetchContainer();
          }
        },
      }
    );

    return () => subscription.unsubscribe();
  }, [slug]);

  if (!container) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  const screens = container.screens || [];
  const total = screens.length;

  // -------------------------
  // SLIDER LOGIC
  // -------------------------
  const nextSlide = () => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const getPosition = (index) => {
    if (total === 0) return "hidden";
    const diff = (index - currentIndex + total) % total;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === total - 1) return "left";
    return "hidden";
  };

  const transition = { duration: 0.7, ease: "easeInOut" };

  const handleScreenView = (id) => {
    setScreenId(id);
    setShowContentContainer(true);
  };

  // -------------------------
  // RENDER
  // -------------------------

  if (showCover) {
    return <><div
          className="absolute inset-0 flex flex-col items-center justify-center z-[9999]"
          style={{
            backgroundImage: `url(${container.background_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          {/* Centered Logo */}
          <div
            className="relative z-50 cursor-pointer flex flex-col items-center"
            onClick={closeCover}
          >
            <img
              src={container.files?.[0]}
              alt="logo"
              className="h-56 md:h-72 lg:h-80 w-auto object-contain drop-shadow-2xl"
            />

            <p className="text-white text-3xl md:text-4xl font-bold mt-6 tracking-wide drop-shadow-xl">
              {container.name}
            </p>
          </div>
        </div></>;
  }

  if (!showCover) {
    return <><div
          className="relative flex items-center justify-center h-screen overflow-hidden"
          style={{
            backgroundImage: `url(${container.background_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >


          {/* LOGO – centered at top, above slider */}
          {!showContentContainer && (
            // <div
            //   className="absolute top-4 md:top-6 w-full flex justify-center z-[200] cursor-pointer"
            //   onClick={() => navigate(`/container/${container.id}`)}
            // >
            //   <img
            //     src={container.files?.[0]}
            //     alt={container.name}
            //     className="h-24 md:h-32 lg:h-40 w-auto object-cover drop-shadow-2xl"
            //   />
            // </div>

            <div
                className={`absolute top-4 md:top-6 w-full flex justify-center z-[200] cursor-pointer ${logoAnimated ? "" : "logo-animate"}`}
                onAnimationEnd={() => setLogoAnimated(true)}
                onClick={() => {
                  navigate(`/container/${container.id}`);
                  if(!showContentContainer){
                    openCover();
                  }
                  setShowContentContainer(false);
                  
                  
                }}
              >
                <img
                  src={container.files?.[0]}
                  alt={container.name}
                  className="h-24 md:h-40 lg:h-40 w-auto object-cover drop-shadow-2xl"
                />
              </div>


          )}



          {/* SLIDER VIEW */}
          {!showContentContainer && (
            <div className="relative w-full h-full flex items-center justify-center">
              {screens.map((screen, index) => {
                const position = getPosition(index);

                if (position === "hidden") return null;

                let style = {
                  position: "absolute",
                  width: "80vw",
                  maxWidth: "600px",
                  height: "45vh",
                  maxHeight: "380px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "all 0.6s ease",
                  opacity: 0.4,
                  zIndex: 10,
                  filter: "grayscale(10%)",
                };
                
                if (position === "center") {
                  style.transform = "scale(1)";
                  style.opacity = 1;
                  style.zIndex = 40;
                } else if (position === "left") {
                  style.transform = "translateX(-32vw) scale(0.85)";
                  style.opacity = 0.6;
                  style.zIndex = 20;
                } else if (position === "right") {
                  style.transform = "translateX(32vw) scale(0.85)";
                  style.opacity = 0.6;
                  style.zIndex = 20;
                }

                const handleSlideClick = () => {
                  if (position === "left") prevSlide();
                  else if (position === "right") nextSlide();
                  // if center → we don't change slide here (only title overlay opens view)
                };

                return (
                  <motion.div
                    key={screen.id}
                    style={style}
                    onClick={handleSlideClick}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: style.opacity }}
                    transition={transition}
                  >
                    {screen.card_image_url ? (
                      <img
                        src={screen.card_image_url}
                        alt={screen.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-black/70 flex items-center justify-center text-white">
                        No Image
                      </div>
                    )}

                    {/* Title overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      
                      
                      {screen.display_mode !== 'slider-thumbnail-view' && (

                      
                        <div className="flex flex-col items-center justify-center gap-2 px-4">

                          {/* Screen Name — Big & First */}
                          <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg text-center">
                            {screen.name}
                          </h2>

                          {/* Screen Title — Smaller & Only if exists */}
                          {screen.title && (
                            <h3 className="text-xl md:text-2xl font-semibold text-white drop-shadow-lg text-center">
                              {screen.title}
                            </h3>
                          )}
                        </div>

                      )}


                      
                      {/* Clickable only on CENTER slide to open content */}
                      {position === "center" && (
                        <div
                          className="absolute inset-0 cursor-pointer pointer-events-auto"
                          onClick={(e) => {
                            e.stopPropagation(); // don't trigger slide change
                            console.log(screen.id)
                            handleScreenView(screen.id);
                          }}
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* CONTENT VIEW (IFRAME) */}
          {showContentContainer && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
              <iframe
                src={`/screen/${screenId}?container=${container.id}`}
                className="w-full h-full border-none"
                title="Content"
              ></iframe>
            </div>
          )}

          {/* BOTTOM "MORE" BUTTON */}
          {!showContentContainer && (
            <div className="absolute bottom-0 w-full flex justify-center z-[200]">
              <button
                onClick={() => {
                  navigate(`/container/${slug}/more`);
                  sessionStorage.setItem("moresection", "true");
                
                }} // ← change route here
                className="
                  px-36 py-3
                  bg-black/30 
                  text-white 
                  text-lg md:text-2xl 
                  font-semibold 
                  rounded-t-2xl 
                  hover:bg-black/80 
                  backdrop-blur-md
                  shadow-xl
                  transition-all
                "
              >
                MORE
              </button>
            </div>
          )}



        </div></>;
  }




  // return (
  //   <>
  //     {!showIntroScreen &&(
        
  //     )}

  //     {/* INTRO COVER SCREEN */}
  //     {showIntroScreen && (
  //       <div
  //         className="absolute inset-0 flex flex-col items-center justify-center z-[9999]"
  //         style={{
  //           backgroundImage: `url(${container.background_url})`,
  //           backgroundSize: "cover",
  //           backgroundPosition: "center",
  //         }}
  //       >
  //         {/* Dark overlay */}
  //         <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

  //         {/* Centered Logo */}
  //         <div
  //           className="relative z-50 cursor-pointer flex flex-col items-center"
  //           onClick={() => setShowIntroScreen(false)}
  //         >
  //           <img
  //             src={container.files?.[0]}
  //             alt="logo"
  //             className="h-56 md:h-72 lg:h-80 w-auto object-contain drop-shadow-2xl"
  //           />

  //           <p className="text-white text-3xl md:text-4xl font-bold mt-6 tracking-wide drop-shadow-xl">
  //             Armed Forces of the Philippines
  //           </p>
  //         </div>
  //       </div>
  //     )}
  //   </>





  // );
}

export default ContainerView;
