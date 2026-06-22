import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../Api/Api";
import * as ActionCable from "@rails/actioncable";
import { motion, AnimatePresence, number } from "framer-motion";
import smoke from ".././../public/smoke.gif";
import logo from "../../public/logo2.png";
import { UNIFORM_LABELS } from "../data/uniformLabels";

// const cable = ActionCable.createConsumer("ws://localhost:3000/cable");
const cable = ActionCable.createConsumer("wss://backendafp.connectorcore.com/cable");

function ScreenView() {
  const { slug } = useParams();
  const [container, setContainer] = useState(null);
  const containerId = new URLSearchParams(window.location.search).get("container");
  // setContainer(containerId);


  const navigate = useNavigate();
  const token = sessionStorage.getItem("authToken");

  const [contents, setContents] = useState([]);
  const [background, setBackground] = useState(null);
  const [displayMode, setDisplayMode] = useState("normal-view");

  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef(null);
  const [showFullText, setShowFullText] = useState(false);

  const [mode, setMode] = useState("diagonal-split-view");
  const [selected, setSelected] = useState(null);

  const [subselected, setSubselected] = useState(null)

  const [insideSelected, setInsideSelected] = useState(null)
  const [insideSelectedView, setInsideSelectedView] = useState(null)

  const [screenName, setScreenName] = useState(null);
  const [containerLogo, setContainerLogo] = useState(null);
  // const [containerId, setContainerId] = useState(null);

  const [subgalleryOpen, SetSubgalleryOpen] = useState(null)

  const morepage = sessionStorage.getItem("moresection") === "true";





  const trimWords = (text, limit = 50) => {
    const words = text.split(" ");
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
  };


  const [galleryOpen, setGalleryOpen] = useState(false);



  useEffect(() => {
    fetchContents();
    const subscription = cable.subscriptions.create(
      { channel: "ScreenChannel", slug: slug },
      {
        received: (data) => {
          if (data.action === "refresh") {
            fetchContents();
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [slug]);


  async function fetchContents() {
    try {
      const res = await fetch(`${Api}/api/v1/screen_contents/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log("---------------data-----sssssss----------------", data)
      setContents(data.contents || []);
      setBackground(data.background_url);

      setContainer(containerId || null);
      setScreenName(data.screen_name || "");
      setContainerLogo(data.container_files || null)
      // setContainerId(data.container_ids || null)
      // console.log("aaaaaaaaaaaaaaaaaaaaaaaa-----------",data)
      setMode(data.display_mode)


    } catch (err) {
      console.error("❌ Error:", err);
    }
  }


  const handleNext = () => {
    if (!nextScreenId) {
      alert("✅ You reached the last screen!");
      return;
    }
    navigate(`/screen/${nextScreenId}`);
  };

  const handlePrev = () => {
    if (!prevScreenId) {
      alert("🚫 This is the first screen!");
      return;
    }
    navigate(`/screen/${prevScreenId}`);
  };

  const getPositionStyle = (position) => {
    const base = {
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
    };

    switch (position) {
      case "Top-Left":
        return { ...base, top: "5%", left: "5%" };
      case "Top-Right":
        return { ...base, top: "5%", right: "5%" };
      case "Bottom-Left":
        return { ...base, bottom: "5%", left: "5%" };
      case "Bottom-Right":
        return { ...base, bottom: "5%", right: "5%" };
      case "Center":
        return {
          ...base,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };
      default:
        return { ...base, top: "10%", left: "10%" };
    }
  };

  const transitionVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    zoom: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
    },
    "slide-left": {
      initial: { opacity: 0, x: -100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -100 },
    },
    "slide-right": {
      initial: { opacity: 0, x: 100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 100 },
    },
    "slide-up": {
      initial: { opacity: 0, y: 100 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 100 },
    },
    rotate: {
      initial: { opacity: 0, rotate: -45, scale: 0.8 },
      animate: { opacity: 1, rotate: 0, scale: 1 },
      exit: { opacity: 0, rotate: 45, scale: 0.8 },
    },
  };


  const limitWords = (text, limit = 40) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
  };



  /* ----------------------------------------------------------------------------------------
     🔵 NORMAL VIEW (your default view)
  -----------------------------------------------------------------------------------------*/
  const renderNormalView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "relative",
        color: "white",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* --- Background --- */}
      {background && background.endsWith(".mp4") ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        >
          <source src={background} type="video/mp4" />
        </video>
      ) : (
        <div
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        />
      )}

      {/* --- Foreground (Content) --- */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <AnimatePresence>
          {contents.map((c, idx) => {
            const customStyle =
              c.top || c.left
                ? {
                  top: typeof c.top === "number" ? `${c.top}px` : c.top || "10%",
                  left:
                    typeof c.left === "number" ? `${c.left}px` : c.left || "10%",
                  position: "absolute",
                }
                : getPositionStyle(c.position);

            // 🌀 Pick variant from backend (fallback: fade)
            const variant =
              transitionVariants[c.transition_effect] || transitionVariants.fade;

            return (
              <motion.div
                key={c.id}
                variants={variant}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                drag
                dragConstraints={containerRef}
                dragElastic={0}
                dragMomentum={false}
                style={{
                  ...customStyle,
                  background: "rgba(0, 0, 0, 0.6)",
                  padding: "12px",
                  borderRadius: "10px",
                  color: "white",
                  textAlign: "center",
                  width:
                    c.width && typeof c.width === "number"
                      ? `${c.width}px`
                      : c.width || "300px",
                  height:
                    c.height && typeof c.height === "number"
                      ? `${c.height}px`
                      : c.height || "auto",
                  resize: "both",
                  overflow: "auto",
                  cursor: "grab",
                  zIndex: 5,
                  userSelect: "none",
                }}
              >
                {/* --- Image --- */}
                {c.content_type === "image" &&
                  c.files.map((f, i) => (
                    <img
                      key={i}
                      src={f}
                      alt=""
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "250px",
                        objectFit: "contain",
                        borderRadius: 8,
                        marginBottom: 8,
                      }}
                    />
                  ))}

                {/* --- Video --- */}
                {c.content_type === "video" &&
                  c.files.map((f, i) => (
                    <video
                      key={i}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "250px",
                        borderRadius: 8,
                        marginBottom: 8,
                        objectFit: "contain",
                      }}
                    >
                      <source src={f} type="video/mp4" />
                    </video>
                  ))}

                {/* --- Text --- */}
                {c.content && (
                  <p
                    style={{
                      fontSize: "clamp(12px, 1.5vw, 18px)",
                      color: "#fff",
                      lineHeight: 1.4,
                      wordBreak: "break-word",
                    }}
                  >
                    {c.content}
                  </p>
                )}

                {/* --- QR Code --- */}
                {c.qr_code_url && (
                  <img
                    src={c.qr_code_url}
                    alt="QR Code"
                    style={{
                      width: "120px",
                      height: "120px",
                      marginTop: "12px",
                      borderRadius: "10px",
                      background: "#fff",
                      padding: "5px",
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* --- Navigation Buttons --- */}
      </div>
    </motion.div>
  );


  const PresentationView = () => {
    if (!selected) return null;

    const [logoAnimated, setLogoAnimated] = useState(false);
    useEffect(() => setLogoAnimated(true), []);

    // Normalize images + fallback to files[0] when sub_image missing
    const images =
      selected.sub_contents?.map((d) => {
        const files = d.files || [];
        const fallback = files.length ? files[0] : null;
        return {
          individual_contents: d.individual_contents || "",
          sub_image: d.sub_image || fallback,
          description: d.description || "",
          files,
        };
      }) || [];

    // guard: nothing to show
    if (images.length === 0) {
      return (
        <div className="w-full h-screen flex items-center justify-center text-gray-300">
          No images available
        </div>
      );
    }

    const [activeIndex, setActiveIndex] = useState(null);

    // helpers
    const isVideo = (url) => {
      if (!url) return false;
      return /\.(mp4|webm|ogg)$/i.test(url);
    };

    const nextImage = () => {
      if (activeIndex === null) return;
      setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
      if (activeIndex === null) return;
      setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    // Choose a sensible background URL:
    // prefer selected.background_url, then selected.files[0], then first sub_content sub_image
    const bgUrl =
      selected.background_url ||
      (selected.files && selected.files.length ? selected.files[0] : null) ||
      selected.sub_contents?.[0]?.sub_image ||
      null;

    // poster image to show while video loads (fallback to a static file/subimage)
    const backgroundPoster =
      (selected.files && selected.files.length && selected.files[0]) ||
      selected.sub_contents?.[0]?.sub_image ||
      null;

    const bgIsVideo = isVideo(bgUrl);

    return (
      <div className="relative w-full h-screen text-white flex items-center justify-center overflow-hidden">
        {/* ====== BACKGROUND: prefer bgUrl (which falls back to files[0] or sub_image) ====== */}
        {bgIsVideo ? (
          <video
            src={bgUrl}
            autoPlay
            loop
            muted
            playsInline
            poster={backgroundPoster || undefined}
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${bgUrl || selected.sub_contents?.[0]?.main_image || ""})`,
            }}
            aria-hidden="true"
          />
        )}

        {/* overlays and UI (kept as you had them) */}
        {activeIndex !== null ? (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px] transition-opacity duration-300 z-10" />
        ) : (
          <div className="absolute inset-0 bg-black/10 z-5" />
        )}

        {activeIndex === null && (
          <>
            <div
              className="absolute top-4 left-6 cursor-pointer z-[9999]"
              style={{ perspective: "1200px" }}
              onClick={() => setMode("slide-view")}
            >
              <img
                src={containerLogo}
                alt="logo"
                className={`h-48 w-auto object-contain ${logoAnimated ? "logo-animate-sliderInner" : "opacity-0"}`}
              />
            </div>

            <button
              onClick={() => setMode("slide-view")}
              className="absolute bottom-40 left-6 z-[9999] bg-black/50 text-white px-5 py-2 rounded-lg text-lg font-semibold shadow-xl hover:bg-black/70"
            >
              Back
            </button>
          </>
        )}

        {activeIndex === null && (
          <div className="relative flex flex-col items-center z-20 px-4">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center drop-shadow-lg">{selected.title}</h1>

            <div
              className="user-content w-full max-w-[1000px] text-lg sm:text-2xl leading-relaxed text-center bg-black/45 p-4 sm:p-6 rounded-2xl backdrop-filter backdrop-blur-sm break-words"
              dangerouslySetInnerHTML={{ __html: selected.sub_contents?.[0]?.description || "" }}
            />
          </div>
        )}

        {/* Center viewer (gallery modal) */}
        {activeIndex !== null && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="relative pointer-events-auto rounded-xl shadow-2xl p-4 max-w-[1100px] w-[92%]">
              <div className="flex items-center justify-center">
                {isVideo(images[activeIndex]?.sub_image) ? (
                  <video
                    src={images[activeIndex]?.sub_image}
                    controls
                    autoPlay
                    className="w-[90vh] max-w-[1000vh] max-h-[70vh] object-fill rounded-md"
                  />
                ) : (
                  <img
                    src={images[activeIndex]?.sub_image}
                    className="w-[90vw] max-w-[800px] h-[64vh] object-contain rounded-xl"
                    alt=""
                  />
                )}
              </div>

              <div className="mt-4 bg-black/40 p-3 rounded-lg max-w-full mx-auto">
                <div className="text-white text-base sm:text-lg md:text-xl text-center leading-relaxed break-words">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: images[activeIndex]?.individual_contents || images[activeIndex]?.description || "",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back button in viewer */}
        {activeIndex !== null && (
          <button
            onClick={() => setActiveIndex(null)}
            className="absolute bottom-6 left-6 z-40 pointer-events-auto text-white text-2xl font-semibold bg-black/20 px-4 py-2 rounded-lg"
          >
            Back
          </button>
        )}

        {/* navigation arrows */}
        {activeIndex !== null && (
          <>
            <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 z-40 pointer-events-auto text-4xl p-3 rounded-full bg-black/10">
              ❮
            </button>
            <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 z-40 pointer-events-auto text-4xl p-3 rounded-full bg-black/10">
              ❯
            </button>
          </>
        )}

        {/* QR code (hidden when viewer open) */}
        {activeIndex === null && selected.qr_code_url && (
          <div className="absolute top-24 right-20 flex flex-col items-center z-40">
            <div className="w-24 h-24 overflow-hidden ">
              <img src={selected.qr_code_url} className="w-full h-full object-cover scale-[1.5]" alt="QR" />
            </div>
            <span className="mt-2 text-white font-semibold">Learn More</span>
          </div>
        )}

        {/* thumbnails */}
        {activeIndex === null && (
          <div className="absolute bottom-8 left-0 w-full overflow-x-auto whitespace-nowrap px-6 py-2 hide-scrollbar z-40">
            {images.map((item, i) => (
              <div key={i} className="inline-block mr-12 text-center w-44 align-top">
                <div className="w-40 h-28 overflow-hidden rounded-lg shadow-xl mx-auto cursor-pointer" onClick={() => setActiveIndex(i)}>
                  {isVideo(item.sub_image) ? (
                    <img src={(item.sub_image && item.sub_image + "?poster=1") || backgroundPoster} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  ) : (
                    <img src={item.sub_image} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Replace your existing renderSlideView with this version
  const renderSlideView = () => {
    // handle empty
    if (!contents || contents.length === 0) {
      return (
        <div className="flex items-center justify-center h-screen text-white">
          No contents
        </div>
      );
    }

    const prev = () =>
      setActiveIndex((prev) => (prev === 0 ? contents.length - 1 : prev - 1));

    const next = () =>
      setActiveIndex((prev) => (prev === contents.length - 1 ? 0 : prev + 1));

    // Return one of: left2, left1, center, right1, right2, hidden
    const getPosition = (index) => {
      const total = contents.length;
      const diff = (index - activeIndex + total) % total;

      if (diff === 0) return "center";
      if (diff === 1) return "right1";
      if (diff === 2) return "right2";
      if (diff === total - 1) return "left1";
      if (diff === total - 2) return "left2";
      return "hidden";
    };

    return (
      <div
        className="relative flex flex-col items-center justify-center h-screen overflow-hidden"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* TOP LOGO */}
        <div
          className="absolute top-4 cursor-pointer z-50"
          onClick={() => navigate(`/container/${container}`)}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-20 sm:h-24 md:h-32 lg:h-28 w-auto object-contain"
          />
        </div>

        {/* SLIDER */}
        <div className="relative w-full h-[60%] sm:h-[65%] md:h-[80%] flex items-center justify-center">
          {contents.map((c, index) => {
            const pos = getPosition(index);

            // base style
            let style = {
              position: "absolute",
              width: "78vw",
              maxWidth: "600px",
              height: "50vh",
              maxHeight: "350px",

              overflow: "hidden",
              transition: "all 0.6s ease",
              opacity: 0,
              zIndex: 5,
              filter: "grayscale(60%)",
              cursor: "pointer",
              display: "none",
              willChange: "transform, opacity",
              backgroundColor: "rgba(0,0,0,0.12)",
            };

            // offsets for mobile/desktop (two steps)
            const mobileOffset1 = "42vw";
            const mobileOffset2 = "80vw";
            const desktopOffset1 = "300px";
            const desktopOffset2 = "500px";
            const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
            const off1 = isMobile ? mobileOffset1 : desktopOffset1;
            const off2 = isMobile ? mobileOffset2 : desktopOffset2;

            // vertical offsets
            const centerY = "-60px"; // center moves up
            const sideY = "10px"; // first-side moves down
            const farSideY = "80px"; // second-side moves more down (optional)

            // apply position-specific transforms/styles
            if (pos === "center") {
              style.display = "block";
              style.transform = `translateY(${centerY}) scale(1)`;
              style.opacity = 1;
              style.zIndex = 80;
              style.filter = "grayscale(0%)";
              style.width = isMobile ? "86vw" : style.width;
              style.maxWidth = isMobile ? "86vw" : style.maxWidth;
            } else if (pos === "left1") {
              style.display = "block";
              style.transform = `translateX(-${off1}) translateY(${sideY}) scale(0.88)`;
              style.opacity = 0.75;
              style.zIndex = 60;
              style.filter = "grayscale(10%)";
            } else if (pos === "right1") {
              style.display = "block";
              style.transform = `translateX(${off1}) translateY(${sideY}) scale(0.88)`;
              style.opacity = 0.75;
              style.zIndex = 60;
              style.filter = "grayscale(10%)";
            } else if (pos === "left2") {
              style.display = "block";
              style.transform = `translateX(-${off2}) translateY(${farSideY}) scale(0.72)`;
              style.opacity = 0.45;
              style.zIndex = 40;
              style.filter = "grayscale(30%)";
            } else if (pos === "right2") {
              style.display = "block";
              style.transform = `translateX(${off2}) translateY(${farSideY}) scale(0.72)`;
              style.opacity = 0.45;
              style.zIndex = 40;
              style.filter = "grayscale(30%)";
            }

            const handleClick = () => {
              if (pos === "left1" || pos === "left2") prev();
              else if (pos === "right1" || pos === "right2") next();
              else if (pos === "center") {
                setSelected(c);
                if (c.has_subcontent) setMode("presentation-view");
                else setMode("detail");
              }
            };

            return (
              <motion.div
                key={c.id ?? index}
                style={style}
                onClick={handleClick}
                initial={{ opacity: 0 }}
                animate={{ opacity: style.opacity }}
                transition={{ duration: 0.6 }}
              >
                {/* media: use object-cover for consistent fill */}
                {c.files?.[0] ? (
                  <img
                    src={c.files[0]}
                    className="w-full h-full object-cover"
                    alt={c.title}
                    style={{
                      objectPosition: "center center",
                      display: "block",
                      height: "100%",
                      width: "100%",
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-black/50 text-white">
                    No Image
                  </div>
                )}

                {/* center title overlay */}
                {pos === "center" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-allerta font-bold text-white drop-shadow-xl text-center px-4">
                      {c.title}
                    </h2>
                  </div>
                )}

                {/* clickable hot area for center */}
                {pos === "center" && (
                  <div
                    className="absolute inset-0 cursor-pointer pointer-events-auto font-allerta"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(c);
                      if (c.has_subcontent) setMode("presentation-view");
                      else setMode("detail");
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM DESCRIPTION (single) */}
        <div
          className="
    absolute bottom-2 left-0 right-0
    w-full
    text-center text-white
    text-sm sm:text-base md:text-lg lg:text-xl
    leading-relaxed
    px-4 sm:px-6 md:px-12
    py-3 sm:py-4 md:py-5 z-[9999]
  "
        >
          <div
            className="
      font-allerta
      w-full max-w-none
      mx-auto 
    "
            dangerouslySetInnerHTML={{
              __html:
                contents?.[activeIndex]?.content?.trim()
                  ? contents[activeIndex].content
                  : contents?.[0]?.content || "",
            }}
          />
        </div>


      </div>
    );
  };



  /* ----------------------------------------------------------------------------------------
     🟣 THUMBNAIL GALLERY VIEW (bottom images → click to show big view)
  -----------------------------------------------------------------------------------------*/


  const renderThumbnailGalleryView = () => {
    const active = contents[activeIndex];

    return (
      <div
        className="relative w-full min-h-screen flex flex-col"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* ===== TOP RIGHT LOGO ===== */}
        <div
          className="absolute top-3 right-3 cursor-pointer z-[9999]"
          onClick={() => {
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }
          }}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-20 w-auto md:h-40 object-contain animate-thumb-view"
          />
        </div>

        {/* ===== MAIN GRID ===== */}
        <div
          className="
            flex-grow 
            grid grid-cols-1 md:grid-cols-2 
            gap-6 md:gap-10 
            px-4 md:px-12 
            pt-20 md:pt-28
          "
        >
          {/* ===== LEFT IMAGE ===== */}
          <div
            className="
              w-full 
              h-[40vh] md:h-[65vh] 
              rounded-xl shadow-2xl 
              border border-white/10
            "
            style={{
              backgroundImage: `url(${active?.files?.[0]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* ===== RIGHT TEXT ===== */}
          <div className="flex flex-col justify-start items-start">
            <div
              className="
                bg-black/35 backdrop-blur-sm 
                p-5 md:p-10 lg:p-16 
                rounded-xl 
                w-full max-w-4xl 
                shadow-xl
              "
            >
              {/* ===== HTML CONTENT ===== */}
              <div
                className={`
                  text-xl leading-relaxed whitespace-pre-line text-justify text-white
                  transition-all duration-300
                  ${showFullText ? "" : "max-h-[200px] md:max-h-[260px] overflow-hidden"}
                `}
                dangerouslySetInnerHTML={{
                  __html:
                    active?.content?.trim()
                      ? active.content
                      : contents?.[0]?.content || "",
                }}

              />

              {/* ===== READ MORE / LESS ===== */}
              {active?.content?.split(" ").length > 100 && (
                <button
                  onClick={() => setShowFullText(!showFullText)}
                  className="mt-3 text-yellow-300 font-semibold underline"
                >
                  {showFullText ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
          </div>

          {/* ===== QR CODE ===== */}
          {active?.qr_code_url && (
            <div className="absolute bottom-5 right-5 flex flex-col items-center">
              <img
                src={active.qr_code_url}
                className="w-24 h-24 md:w-36 md:h-36 lg:w-40 lg:h-40 bg-white p-2 rounded-xl shadow-2xl"
                alt="QR Code"
              />
              <span className="mt-2 text-white font-semibold text-xs md:text-base">
                Learn More
              </span>
            </div>
          )}
        </div>

        {/* ===== THUMBNAILS ===== */}
        <div
          className="
            w-full p-3 md:p-4 
            bg-black/40 
            flex gap-2 md:gap-4 
            overflow-x-auto 
            border-t border-white/30
          "
        >
          {contents.map((c, i) => (
            <img
              key={i}
              src={c.files?.[0]}
              alt=""
              onClick={() => setActiveIndex(i)}
              className={`
                h-20 w-24 md:h-28 md:w-32 
                object-cover rounded-lg cursor-pointer 
                border-2 md:border-4 transition-all duration-300 
                ${activeIndex === i
                  ? "border-yellow-400 scale-105"
                  : "border-transparent opacity-60 hover:opacity-100"
                }
              `}
            />
          ))}
        </div>
      </div>
    );
  };


  const DiagonalHomeView = ({
    contents,
    background,
    containerLogo,
    screenName,
  }) => {

    const navigate = useNavigate();
    const overlapVW = 11;
    const [logoAnimated, setLogoAnimated] = useState(false);
    useEffect(() => {
      setLogoAnimated(true);  // start animating
    }, []);



    return (
      <div
        className="relative w-full h-screen overflow-hidden flex"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <div
          className="absolute top-4 left-6 cursor-pointer z-[9999]"
          style={{ perspective: "1200px" }}
          onClick={() => navigate(`/container/${containerId}`)}

        >
          <img
            src={containerLogo}
            alt="logo"
            className={`h-48 w-auto object-contain z-[9999] ${logoAnimated ? "logo-animate-diagonal" : ""
              }`}
          />
        </div>


        {/* LEFT EMPTY AREA */}
        <div className="w-[14%] h-full relative flex items-center justify-center shrink-0">
          <div
            onClick={() => navigate(`/container/${containerId}`)}

            className="absolute bottom-4 cursor-pointer select-none justify-center gap-3"
          >
            <p className="text-3xl font-bold tracking-wide text-white drop-shadow mt-1">
              BACK
            </p>
          </div>
        </div>




        {/* RIGHT SIDE */}
        <div className="w-[90%] h-full overflow-x-auto overflow-y-hidden whitespace-nowrap hide-scrollbar relative">

          {contents.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setSelected(item);
                setMode("detail");
              }}
              className="
                      inline-block relative cursor-pointer group
                    w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[36vw]

                    h-screen
                    "
              style={{
                transform: `translateX(-${index * overlapVW}vw)`,
                clipPath: "polygon(30% 0, 100% 0, 70% 100%, 0% 100%)",
              }}
            >

              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center brightness-140 
                          group-hover:brightness-100 transition-all duration-700"
                style={{ backgroundSize: "100% auto", backgroundImage: `url(${item.files?.[0]})` }}
              />

              {/* CENTERED LOGO + TITLE */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full flex flex-col items-center justify-center text-center translate-x-[2%] -translate-y-[5%]">

                  {item.logo && (
                    <img
                      src={item.logo}
                      className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-xl 
                                group-hover:scale-110 transition-transform duration-500"
                      alt=""
                    />
                  )}

                  <p
                    className={`
                              w-[400px]
                              leading-snug
                              break-words
                              text-xl md:text-3xl font-bold mt-4
                              drop-shadow-2xl tracking-wide uppercase text-center
                              ${screenName === "PRESIDENT ACCOMPLISHMENT"
                        ? "text-yellow-400"
                        : "text-white"
                      }
                            `}
                  >
                    {item.title}
                  </p>



                </div>
              </div>

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/15"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const DetailView = () => {
    if (!selected) return null;

    const activeContent = selected?.contents?.[0]; // default first item
    const [expanded, setExpanded] = useState(false);


    console.log("-----------------selected---------------", selected)
    // READ MORE state
    // Slide-in animation (Right → Left)
    const slideIn = {
      initial: { x: 200, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      transition: { duration: 0.8, ease: "easeOut" }
    };

    // const text = selected.content || "";
    // const words = text.split(" ");
    // const isLong = words.length > 50;
    // const previewText = words.slice(0, 50).join(" ") + "...";


    function stripHtml(html) {
      const temp = document.createElement("div");
      temp.innerHTML = html;
      return temp.textContent || temp.innerText || "";
    }


    const fullHtml = selected.content || "";
    const plainText = stripHtml(fullHtml);

    const words = plainText.split(" ");
    const isLong = words.length > 50;
    const previewText = words.slice(0, 50).join(" ") + "...";



    return (
      <div
        className="relative w-full min-h-screen text-white"
        style={{
          backgroundImage: `url(${selected.background_url || background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Dark overlay (adjust opacity as needed) */}
        <div className="absolute inset-0 bg-black/30" />
        <div
          className="absolute top-4 left-4 z-[999] cursor-pointer 
             bg-black/30 backdrop-blur-md p-2 rounded-xl 
             hover:bg-black/50 transition"
          onClick={() => setMode("diagonal-split-view")}
        >
          <span className="text-white text-2xl leading-none">Back</span>
        </div>

        {/* === LEFT SLANTED IMAGE PANEL (ANIMATED) === */}
        <motion.div
          className="absolute inset-y-0 left-0 w-1/3 ml-10 shadow-4xl brightness-140"
          style={{
            backgroundImage: `url(${selected.files?.[0] || bgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            clipPath: "polygon(26% 0, 100% 0, 74% 100%, 0% 100%)"
          }}
          initial="initial"
          animate="animate"
          variants={slideIn}
        >
          {(
            <div
              className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
              onClick={() => setMode("diagonal-split-view")}
            >
              <div className="grid place-items-center gap-2 text-center">

                {/* LOGO (optional) */}
                {selected.logo && (
                  <img
                    src={selected.logo}
                    className="w-32 h-32 md:w-42 md:h-42 drop-shadow-2xl"
                    alt="Logo"
                  />
                )}

                {/* TITLE (always visible) */}
                <h1
                  className={`
                            font-bold
                            ${screenName === "PRESIDENT ACCOMPLISHMENT"
                      ? "text-yellow-600 !text-2xl mt-24"
                      : "text-white text-2xl"
                    }
                          `}
                >
                  {selected.title}
                </h1>

              </div>
            </div>
          )}

        </motion.div>

        {/* === RIGHT SIDE TEXT BLOCK === */}
        <motion.div
          className={`
    absolute 
    top-1/2 
    right-10 
    -translate-y-1/2
    bg-black/30
    border-3 border-black
    transition-all duration-500 ease-in-out

    ${screenName === "PRESIDENT ACCOMPLISHMENT"
              ? expanded
                ? "max-w-[930px] max-h-[700px] p-2"
                : isLong
                  ? "max-w-[930px] max-h-[360px] pl-4"
                  : "max-w-2xl right-40 p-8"
              : isLong
                ? "max-w-[930px] right-10 pl-4"
                : "max-w-2xl right-40 p-8"
            }
  `}
        >
          {/* TITLE */}
          {screenName === "PRESIDENT ACCOMPLISHMENT" && (
            <h1 className="text-yellow-400 !text-2xl font-bold text-center">
              {selected.title}
            </h1>
          )}

          {/* CONTENT */}
          <div
            className={`
      user-content
      text-xl leading-relaxed whitespace-pre-line text-justify text-white
      hide-scrollbar
      transition-all duration-500 ease-in-out
      overflow-y-auto
      pr-4

      ${screenName === "PRESIDENT ACCOMPLISHMENT"
                ? expanded
                  ? "max-h-[520px] pb-6"
                  : isLong
                    ? "max-h-[260px]"
                    : "max-h-fit"
                : isLong
                  ? "max-h-[750px] py-6"
                  : "max-h-fit"
              }
    `}
            dangerouslySetInnerHTML={{ __html: fullHtml }}
          />

          {/* READ MORE / LESS — ALWAYS AT BOTTOM */}
          {screenName === "PRESIDENT ACCOMPLISHMENT" && isLong && (
            <div className="flex justify-center mt-2">
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="text-yellow-400 font-semibold tracking-wide hover:underline"
              >
                {expanded ? "Read Less" : "Read More"}
              </button>
            </div>
          )}
        </motion.div>




        {/* === QR CODE (BOTTOM RIGHT) === */}
        {selected.qr_code_url && (
          <div className="absolute bottom-10 right-10 text-center">
            <div className="mt-2 text-xl font-semibold text-white">Learn More</div>
          </div>
        )}
      </div>
    );
  };

  const renderCardCarouselView = () => {
    return (
      <div
        className="w-full h-screen bg-cover bg-center relative py-4 md:py-10 px-4"
        style={{ backgroundImage: `url(${background})` }}
      >
        {/* BACK BUTTON */}
        <div
          onClick={() => navigate(`/container/${container}`)}
          className="absolute left-4 md:left-24 top-2 md:top-2 cursor-pointer select-none flex items-center gap-2 md:gap-3 z-50"
        >
          <div className="grid place-items-center">
            <span className="text-white text-6xl font-extrabold drop-shadow-lg leading-none">
              ←
            </span>

            <p className="text-white text-lg md:text-2xl font-bold tracking-wide drop-shadow">
              BACK
            </p>
          </div>

        </div>

        {/* TITLE */}
        <div className="text-sm">
          <h1 className="text-center font-semibold text-white drop-shadow mb-8 md:mb-16 px-4">
            {screenName || "CONTENT LIST"}
          </h1>
        </div>

        {/* LOGO */}
        <div
          className="absolute top-2 md:top-4 right-2 md:right-4 cursor-pointer"
          onClick={() => {
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }

          }}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-16 md:h-26 w-auto object-contain mr-20"
          />
        </div>

        {/* HORIZONTAL SCROLL CARDS */}
        <div className="w-full pb-5 no-scrollbar" style={{ paddingInline: 16, boxSizing: 'border-box' }}>
          <div
            className="flex gap-3 md:gap-4 flex-nowrap items-stretch"
            style={{ minWidth: 'max-content' }} // ensures the row can scroll without forcing body width
          >
            {contents.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelected(item);
                  setMode("card-detail");
                }}
                className={`
                          flex-none
                          relative
                          min-w-[220px] sm:min-w-[260px] md:min-w-[340px] lg:min-w-[280px]
                          h-[380px] sm:h-[460px] md:h-[620px] lg:h-[560px]
                          rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden
                          cursor-pointer transition-transform 
                          bg-cover bg-center
                        `}
                style={{
                  backgroundImage: `url(${item.files?.[0]})`,
                }}
              >
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

                {/* TITLE */}
                <div className="absolute inset-0 flex items-center justify-center text-center p-2 sm:p-4">
                  <p className="text-white/80 text-xl sm:text-2xl md:text-3xl font-semibold drop-shadow-2xl px-4">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  };

  /* Utility: strip HTML -> plain text */
  function stripHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    return tmp.textContent || tmp.innerText || "";
  }
  function SplitByLines({ html, lines = 6 }) {
    const containerRef = useRef(null);
    const measurerRef = useRef(null);
    const [firstText, setFirstText] = useState("");
    const [restText, setRestText] = useState("");

    useEffect(() => {
      if (!containerRef.current || !measurerRef.current) return;

      const container = containerRef.current;
      const measurer = measurerRef.current;

      // Copy relevant computed styles from visible container to hidden measurer so measurement matches.
      const cs = getComputedStyle(container);
      const copyStyles = [
        "fontSize",
        "fontFamily",
        "fontWeight",
        "lineHeight",
        "letterSpacing",
        "wordSpacing",
        "whiteSpace",
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "boxSizing",
      ];
      copyStyles.forEach((prop) => {
        try {
          measurer.style[prop] = cs[prop];
        } catch (e) {
          // ignore unsupported props
        }
      });

      // Ensure measurer width equals container width (important for wrapping)
      measurer.style.width = `${container.clientWidth}px`;
      measurer.style.visibility = "hidden";
      measurer.style.position = "absolute";
      measurer.style.left = "-9999px";
      measurer.style.top = "0";
      measurer.style.whiteSpace = "normal";
      measurer.style.padding = "0";
      measurer.style.margin = "0";

      const plain = stripHtml(html);

      // If empty, set both empty
      if (!plain) {
        setFirstText("");
        setRestText("");
        return;
      }

      // measure a single-line height
      measurer.textContent = "A";
      const lineHeight = parseFloat(getComputedStyle(measurer).lineHeight) || measurer.clientHeight || 16;
      const allowedHeight = lineHeight * lines;

      // Binary search for maximum characters fitting into allowedHeight
      let lo = 0;
      let hi = plain.length;
      let best = 0;

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        measurer.textContent = plain.slice(0, mid);
        const h = measurer.scrollHeight;
        if (h <= allowedHeight) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }

      // Find nearest safe word boundary (avoid cutting in the middle of a word)
      let safeSplit = best;
      if (safeSplit < plain.length) {
        const lastSpace = plain.lastIndexOf(" ", safeSplit);
        if (lastSpace > 10) safeSplit = lastSpace;
      }
      // final slices
      const first = plain.slice(0, safeSplit).trim();
      const rest = plain.slice(safeSplit).trim();

      setFirstText(first);
      setRestText(rest);

      // cleanup measurer
      measurer.textContent = "";
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [html, lines, /* respond to layout changes */]);

    // Recalculate on window resize so measure remains accurate
    useEffect(() => {
      function onResize() {
        // small debounce-ish approach
        if (containerRef.current) {
          setFirstText((s) => s);
        }
      }
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, []);

    return (
      <>
        {/* Hidden measurer element */}
        <div ref={measurerRef} aria-hidden />

        {/* Visible container used for copying computed styles */}
        <div ref={containerRef}>
          {/* top: first N lines as full-width */}
          <div className="user-content break-words" style={{ width: "100%" }}>
            <p style={{ margin: 0, lineHeight: "1.6", whiteSpace: "normal" }}>{firstText}</p>
          </div>

          <div className="h-3" />

          {/* remainder: 70% width on md+ */}
          <div className="flex">
            <div className="w-full md:w-[80%] user-content break-words">
              <p style={{ margin: 0, lineHeight: "1.6", whiteSpace: "normal" }}>{restText}</p>
            </div>
            <div className="hidden md:block md:w-[30%]" />
          </div>
        </div>
      </>
    );
  }

  const renderCardDetailView = () => {
    if (!selected) return null;

    return (
      <div
        className="w-full h-screen bg-cover bg-center relative p-4 md:p-6 text-white"
        style={{ backgroundImage: `url(${selected.background_url || background})` }}
      >

        {/* BACK BUTTON */}
        <div
          onClick={() => setMode("card-carousel")}
          className="absolute left-4 md:left-10 top-4 md:top-4 cursor-pointer select-none flex items-center gap-2 md:gap-3 z-50"
        >
          <div className="grid place-items-center pl-12">
            <span className="text-white text-6xl font-extrabold drop-shadow-lg leading-none">
              ←
            </span>

            <p className="text-white text-lg md:text-2xl font-extrabold tracking-wide drop-shadow">
              BACK
            </p>
          </div>
        </div>

        {/* TITLE */}
        <div className="flex justify-center mb-6 md:mb-6 px-2 pt-4 slide-up z-[9999]">
          <div className="bg-yellow-400 text-black px-6 md:px-10 py-3 md:py-4  shadow-xl 
                          text-xl md:text-3xl font-semibold text-center">
            {selected.title}
          </div>
        </div>

        {/* LOGO */}
        <div
          className="absolute top-2 md:top-4 right-2 md:right-4 cursor-pointer"
          onClick={() => {
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }

          }}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-20 w-auto md:h-32 mr-12 object-contain"
          />
        </div>

        {/* CENTER PANEL */}
        <div
          className="
            absolute left-1/2 w-[95%] sm:w-[90%] md:w-[90%] max-w-8xl
            bg-white/10 backdrop-blur-sm py-12 rounded-3xl shadow-3xl
            transform -translate-x-1/2 
            top-[22%] sm:top-[20%] md:top-[22%]   /* ✅ FIX: added more spacing */
            z-[50]
          "
        >


          {/* MAIN CONTENT BLOCK */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-12   px-2 md:px-12">

            {/* LEFT IMAGE */}
            <div className="w-full md:w-[42%] h-[450px] flex flex-col items-center gap-4 md:gap-6">
              <img
                src={selected.sub_contents?.[0].sub_image}
                className="w-full h-full object-cover rounded-2xl shadow-xl"
                alt=""
              />


              {/* View Gallery */}
              {selected.has_subcontent && (
                <button
                  onClick={() => setGalleryOpen(true)}
                  className="w-full max-w-2xl  text-white
                              font-semibold text-lg md:text-xl py-3 md:py-4 
                              rounded-xl bg-black/15 backdrop-blur-3xl shadow-3xl"
                >
                  View Gallery
                </button>
              )}

            </div>
            {/* RIGHT TEXT */}
            <div className="w-full md:w-[90%] text-base md:text-xl leading-relaxed relative">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="flex-1">
                  <SplitByLines html={selected.content} lines={6} />
                </div>
              </div>

              {/* QR CODE — unchanged */}
              {selected.qr_code_url && (
                <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 flex flex-col items-center">
                  <div className="w-40 h-40 overflow-hidden rounded-sm">
                    <img
                      src={selected.qr_code_url}
                      className="w-full h-full object-cover scale-[1.4]"
                      alt="QR"
                    />
                  </div>
                  <span className="mt-2 text-white font-semibold">Learn More</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };


  const renderGalleryView = () => {
    // const mediaFiles = selected.sub_contents?.[0].gallery_images || [];
    // if (mode === "subcontent-view") {
    //   const mediaFiles = subselected?.gallery_images ||  "";
    // }else {
    //   const mediaFiles = selected.sub_contents?.[0].gallery_images || [];
    // }
    const mediaFiles =
    mode === "sub-gallary-detail"
      ? subselected?.gallery_images || []
      : selected?.sub_contents?.[0]?.gallery_images || [];

    const isVideo = (url) => {
      return url.match(/\.(mp4|mov|webm)$/i); // Detect video formats
    };

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[9999] flex flex-col items-center pt-10 px-4 text-white">

        {/* CARD CONTAINER */}
        <div
          className="
            w-full max-w-6xl 
            bg-black/70 border border-white/10 
            rounded-3xl shadow-2xl
            p-4
           
            flex flex-col
            items-center
          "
        >
          {/* BACK BUTTON */}
          <div className="grid grid-cols-3 items-center">

            {/* BACK BUTTON (Left aligned) */}
            <div
              onClick={() => setGalleryOpen(false)}
              className="cursor-pointer flex items-center gap-3 mb-4 justify-start"
            >
              <span className="text-white text-2xl font-bold drop-shadow">←</span>
              <p className="text-xl font-bold drop-shadow">BACK</p>
            </div>

            {/* CENTER TITLE */}
            <h1 className="text-2xl md:text-2xl font-bold text-center mb-8">
              View Gallery
            </h1>

            {/* EMPTY RIGHT SIDE — to keep the title perfectly centered */}
            <div></div>
          </div>


          {/* SCROLLABLE GRID */}
          <div
            className="
                      grid 
                      grid-cols-1 
                      sm:grid-cols-2 
                      md:grid-cols-3 
                      gap-4
                      w-full
                      overflow-y-auto
                      pr-3
                      hide-scrollbar
                    "
            style={{ maxHeight: "75vh" }}
          >
            {mediaFiles.map((file, i) => (
              <div key={i} className="w-full h-60 md:h-64 shadow-xl overflow-hidden border border-white/20">

                {/* If video → render video */}
                {isVideo(file) ? (
                  <video
                    controls
                    className="w-full h-full object-cover rounded-xl"
                  >
                    <source src={file} type="video/mp4" />
                    Your browser does not support video playback.
                  </video>
                ) : (
                  /* Else show image */
                  <img
                    src={file}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                )}

              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };


  // =============================================================


  const PresentationShowcaseView = ({
    contents = [],
    background,
    container,
    containerLogo,
    morepage,
    activeIndex,
    setActiveIndex,
    setSelected,
    setMode,
  }) => {
    const navigate = useNavigate();

    // =========================
    // ADDITION 1: YEAR EXTRACTOR
    // =========================
    const getYearFromDob = (dob) => {
      if (!dob || typeof dob !== "string") return null;

      // exact year like "1965"
      if (/^\d{4}$/.test(dob)) return parseInt(dob, 10);

      // extract year from text like "1917–1989"
      const match = dob.match(/\b(18|19|20)\d{2}\b/);
      return match ? parseInt(match[0], 10) : null;
    };

    // =========================
    // ADDITION 2: SORT CONTENTS
    // (NO DOB → LAST)
    // =========================
    const orderedContents = [...contents].sort((a, b) => {
      const yearA = getYearFromDob(a.dob);
      const yearB = getYearFromDob(b.dob);

      if (yearA === null && yearB === null) return 0;
      if (yearA === null) return 1;
      if (yearB === null) return -1;

      return yearA - yearB; // oldest → newest
    });

    // =========================
    // ORIGINAL CODE (UNCHANGED)
    // =========================

    const prev = () =>
      setActiveIndex((prev) =>
        prev === 0 ? orderedContents.length - 1 : prev - 1
      );

    const next = () =>
      setActiveIndex((prev) =>
        prev === orderedContents.length - 1 ? 0 : prev + 1
      );

    const getPosition = (index) => {
      const total = orderedContents.length;
      if (total === 0) return "hidden";

      const diff = (index - activeIndex + total) % total;

      if (diff === 0) return "center";
      if (diff === 1) return "right";
      if (diff === 2) return "right2";
      if (diff === 3) return "right3";

      if (diff === total - 1) return "left";
      if (diff === total - 2) return "left2";
      if (diff === total - 3) return "left3";

      return "hidden";
    };

    const active = orderedContents[activeIndex];

    return (
      <div
        className="relative flex flex-col items-center justify-center h-screen overflow-hidden"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* LOGO */}
        <div
          className="absolute top-4 right-8 cursor-pointer z-50"
          onClick={() => {
            if (morepage) navigate(`/container/${container}/more`);
            else navigate(`/container/${container}`);
          }}
        >
          <img
            src={active?.logo || containerLogo}
            alt="logo"
            className="h-20 sm:h-24 md:h-38 lg:h-48 w-auto object-contain"
          />
        </div>

        {/* SLIDER */}
        <div className="relative w-full h-[60%] sm:h-[65%] md:h-[70%] flex items-center justify-center">
          {orderedContents.map((c, index) => {
            const pos = getPosition(index);

            let style = {
              position: "absolute",
              overflow: "hidden",
              transition: "all 0.6s ease",
              opacity: 0.3,
              zIndex: 10,
              filter: "grayscale(40%)",
              display: "none",
            };

            const isMobile =
              typeof window !== "undefined" && window.innerWidth < 768;
            const vw =
              typeof window !== "undefined" ? window.innerWidth : 1200;

            const centerWidth = isMobile ? "86vw" : "24vw";
            const centerHeight = isMobile ? "56vh" : "60vh";
            const sideWidth = isMobile ? "28vw" : "180px";
            const sideHeight = isMobile ? "36vh" : "42vh";

            const toPx = (css) => {
              if (!css) return 200;
              if (typeof css !== "string") return Number(css) || 200;
              if (css.endsWith("vw")) return (parseFloat(css) / 100) * vw;
              if (css.endsWith("px")) return parseFloat(css);
              return parseFloat(css) || 200;
            };

            const applyStyle = (
              multiplier,
              widthCss,
              heightCss,
              scaleVal,
              opacityVal,
              z
            ) => {
              const centerPx = toPx(centerWidth);
              const sidePx = toPx(sideWidth);
              const base = Math.ceil(centerPx / 2 + sidePx / 2);

              let extra = 0;
              if (Math.abs(multiplier) === 1) extra = 5;
              if (Math.abs(multiplier) === 2) extra = -90;
              if (Math.abs(multiplier) === 3) extra = -200;

              const offsetPx =
                multiplier * base + Math.sign(multiplier) * extra;

              style.display = "block";
              style.left = "50%";
              style.width = widthCss;
              style.height = heightCss;
              style.transform = `translateX(${offsetPx}px) translateX(-50%) scale(${scaleVal})`;
              style.opacity = opacityVal;
              style.zIndex = z;
            };

            if (pos === "center") {
              applyStyle(0, centerWidth, centerHeight, 1, 1, 60);
              style.filter = "grayscale(0%)";
            } else if (pos === "left") {
              applyStyle(-1, sideWidth, sideHeight, 0.88, 1, 50);
            } else if (pos === "right") {
              applyStyle(1, sideWidth, sideHeight, 0.88, 1, 50);
            } else if (pos === "left2") {
              applyStyle(-2, sideWidth, sideHeight, 0.82, 0.95, 40);
            } else if (pos === "right2") {
              applyStyle(2, sideWidth, sideHeight, 0.82, 0.95, 40);
            } else if (pos === "left3") {
              applyStyle(-3, sideWidth, sideHeight, 0.78, 0.85, 30);
            } else if (pos === "right3") {
              applyStyle(3, sideWidth, sideHeight, 0.78, 0.85, 30);
            } else {
              style.display = "none";
              style.opacity = 0;
              style.zIndex = 5;
            }

            const handleClick = () => {
              if (pos.startsWith("left")) prev();
              else if (pos.startsWith("right")) next();
              else if (pos === "center") {
                setSelected(c);
                setMode("slider-thumb");
              }
            };

            const imgSrc =
              c?.files?.[0] &&
                typeof c.files[0] === "string" &&
                c.files[0].trim() !== ""
                ? c.files[0]
                : null;

            return (
              <React.Fragment key={c.id ?? index}>
                <motion.div
                  style={style}
                  onClick={handleClick}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: style.opacity,
                    transform: style.transform,
                  }}
                  transition={{ duration: 0.55 }}
                >
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      className="w-full h-full object-cover bg-black/5 cursor-pointer"
                      alt={c.title || "slide image"}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-black/70 text-white">
                      No Image
                    </div>
                  )}
                </motion.div>

                {pos === "center" && (
                  <div className="absolute -bottom-14 w-full text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-xl">
                      {c.title}
                    </h2>
                    {c.dob && (
                      <h4 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-xl">
                        {c.dob}
                      </h4>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };




  const SliderThumbnailGalleryView = () => {
    if (!selected) return null;
    console.log("=====================", selected)
    const images = [
      selected.files?.[0],
      ...(selected.sub_contents?.[0]?.gallery_images || [])
    ];

    const primaryDescription =
      selected?.sub_contents?.[0]?.description ||
      selected?.content ||
      "";

    const individualContent =
      selected?.sub_contents?.[0]?.individual_contents ||
      "";

    const [activeIndex, setActiveIndex] = useState(0);
    const activeImage = images[activeIndex];

    return (
      <div
        className="relative w-full min-h-screen flex flex-col"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* DARK BACKGROUND OVERLAY */}
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[3px]"></div>

        <div
          className="absolute top-4 left-4 z-[999] cursor-pointer 
             bg-black/30 backdrop-blur-md p-2 rounded-xl 
             hover:bg-black/50 transition"
          onClick={() => setMode("slider-thumbnail-view")}
        >
          <span className="text-white text-2xl leading-none">Back</span>
        </div>



        {/* TOP RIGHT LOGO */}
        <div
          className="absolute top-2 right-4 cursor-pointer z-[999]"
          onClick={() => setMode("slider-thumbnail-view")}
        >
          <img
            src={selected.logo || containerLogo}
            className="h-16 md:h-36 object-contain drop-shadow-xl"
            alt="logo"
          />
        </div>

        {/* MAIN CONTENT WRAPPER */}
        <div
          className="
            relative z-20
            flex flex-row
            px-4 md:px-12
            pt-12 md:pt-20
          "
        >
          {/* LEFT LARGE IMAGE (with nice border and shadow) */}
          <div
            className="
              basis-[30%] 
              shrink-0
              max-w-[30%]
              rounded-xl shadow-2xl 
              overflow-hidden
              flex z-30
            "
          >
            <img
              src={activeImage}
              alt="Portrait"
              className="h-[75vh] max-w-full object-fill rounded-md !border-none !shadow-none !outline-none"
            />

          </div>


          {/* RIGHT TEXT BOX */}
          <div className="basis-[70%] max-w-[70%] shrink-0">
            <div
              className="
                        relative          /* important so QR can be absolute inside */
                        bg-black/15 backdrop-blur-lg
                        mt-8
                        px-6 lg:pt-4
                        rounded-xl shadow-2xl 
                        text-white 
                        flex-none relative -ml-12           
                          "
            >
              <div className="min-h-[50vh] pl-12 pb-40 relative">
                {/* NAME */}
                <h1 className="mb-3 !text-3xl opacity-90">
                  {selected.title} ({selected.dob})
                </h1>

                {individualContent && (
                  <h2 className="text-lg md:!text-2xl opacity-90 mb-6">
                    {individualContent}
                  </h2>
                )}
                <div className="text-xl">
                  <SplitByLines
                    html={primaryDescription}
                    lines={6}
                  />
                </div>

                {selected.qr_code_url && (
                  <div className="absolute bottom-0 right-8 flex flex-col items-center pb-4 mt-8">
                    <div className="w-32 h-32 p-2 overflow-hidden rounded-sm">
                      <img
                        src={selected.qr_code_url}
                        className="w-full h-full object-cover scale-[1.4]"
                        alt="QR"
                      />
                    </div>
                    <span className="mt-2 font-semibold">Learn More</span>
                  </div>
                )}
              </div>

            </div>

            {/* ==== THUMBNAILS ==== */}
            <div
              className="
            relative z-30
            w-full
            bg-black/30 backdrop-blur-lg
            border-t border-white/20
            py-3 md:py-4 px-4
            flex gap-4 overflow-x-auto
          "
            >
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setActiveIndex(i)}
                  className={`
                h-20 w-24 md:h-40 md:w-32 rounded-lg cursor-pointer object-cover
                border-2 transition-all duration-200
                ${activeIndex === i
                      ? "border-yellow-400 scale-110 shadow-xl opacity-100"
                      : "border-white/20 opacity-60 hover:opacity-100"
                    }
              `}
                  alt="Thumbnail"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };



  const ArticleShowcaseView = () => {
    if (!contents || contents.length === 0) return null;

    const [activeIndex, setActiveIndex] = useState(0);
    const currentpage = contents[activeIndex];

    const getBackgroundImage = () => {
      // 1. Use background_url if available
      if (currentpage.background_url) {
        return currentpage.background_url;
      }

      // 2. If no background_url → use gallery image STRING
      const galleryImg = currentpage?.sub_contents?.[0]?.gallery_images?.[0];

      if (galleryImg) {
        return galleryImg; // this is already a full URL string
      }

      // 3. Fallback
      return background;
    };


    return (
      <div
        className="relative w-full h-screen flex flex-col p-6 md:p-24 text-white bg-black/40"
        style={{
          backgroundImage: `url(${getBackgroundImage()})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <div className="absolute inset-0 bg-black/40"></div>
        <div
          className="absolute top-4 right-4 cursor-pointer z-[9999]"
          onClick={() => {
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }

          }}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-20 md:h-40 w-auto object-contain"
          />
        </div>

        {/* MAIN CONTAINER */}
        <div className="relative z-20 w-[80%] flex flex-col items-left overflow-y-auto pt-12 pl-20 gap-10">
          {/* TITLE */}
          <h1 className="
                        !text-2xl md:!text-3xl 
                        !font-bold 
                        text-white 
                        drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]
                        tracking-wide
                        
                      ">
            Articles and News/Blogs
          </h1>



          <div

            className="
                w-[90%] md:w-[85%] lg:w-[90%]
                bg-black/20 
                rounded-3xl shadow-2xl p-6 md:p-10
                flex flex-col md:flex-row gap-8
              "
          >


            <div className="w-full flex flex-col justify-between pb-20">
              {/* SUB TITLE */}
              <h2 className="text-lg !md:text-xl font-semibold mb-4 opacity-80 text-left">
                {currentpage.title || ""}
              </h2>

              {/* DESCRIPTION */}
              {/* <p className="w-full text-base md:text-lg leading-relaxed opacity-90  flex-grow">
                  {currentpage.content || "No Description"}
                </p> */}
              <div
                className="user-content opacity-80"
                dangerouslySetInnerHTML={{ __html: currentpage.content }}
              ></div>


            </div>
          </div>




        </div>
        {/* BUTTON BOTTOM LEFT */}
        <div className=" absolute bottom-24 md:bottom-24 left-8 md:left-44 mt-6 text-left align-start ">
          <button
            onClick={() => {

              console.log("888888888-------currentpage-------------8888888888888", currentpage)
              setMode("detail-article-view");
              setSelected(currentpage);
            }}
            className="
              
                  px-8 py-3
                  bg-green-800/80 
                  hover:[#374534] 
                  text-white 
                  text-lg md:text-xl 
                  
                  shadow-lg 
                  transition-all
                "
          >
            LEARN MORE
          </button>
        </div>
        {/* PAGE INDICATOR */}
        <div
          className="
    absolute bottom-6 left-1/2 -translate-x-1/2
    flex items-center justify-center gap-6
    text-white opacity-90 z-30
  "
        >
          {/* LEFT ARROW */}
          <div
            className="text-3xl cursor-pointer hover:scale-110"
            onClick={() =>
              setActiveIndex((prev) =>
                prev === 0 ? contents.length - 1 : prev - 1
              )
            }
          >
            ❮
          </div>

          {/* PAGE NUMBER */}
          <div
            className="bg-white text-black px-12 py-2  shadow-lg"
          >
            Page {activeIndex + 1}
          </div>

          {/* RIGHT ARROW */}
          <div
            className="text-3xl cursor-pointer hover:scale-110"
            onClick={() =>
              setActiveIndex((prev) =>
                prev === contents.length - 1 ? 0 : prev + 1
              )
            }
          >
            ❯
          </div>
        </div>


      </div>
    );
  };


  const DetailArticleView = () => {
    if (!selected) return null;
    console.log("0000000000--------------entered-----selected-----", selected)
    const sub = selected.sub_contents?.[0] || {}; // main subcontent
    // const image = sub.gallery_images || null;
    const image = sub.gallery_images?.[0] || null;


    return (
      <div
        className="relative w-full h-screen flex items-center justify-center text-white px-6 md:px-8"
        style={{
          background: "linear-gradient(to bottom, #C3B79B, #A79A7D, #584C3F)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div
          className="absolute top-4 left-4 z-[999] cursor-pointer 
                    bg-black/30 backdrop-blur-md p-2 rounded-xl 
                    hover:bg-black/50 transition"
          onClick={() => {
            setMode("article-view");   // go back to previous screen mode
          }}
        >
          <span className="text-white text-2xl leading-none">Back</span>
        </div>

        {/* TOP RIGHT LOGO */}
        <div
          className="absolute top-4 right-16 cursor-pointer z-[999]"
          onClick={() => setMode("article-view")}
        >
          <img
            src={containerLogo}
            className="h-16 md:h-40 w-auto object-contain"
            alt="logo"
          />
        </div>

        {/* MAIN CONTENT WRAPPER */}
        <div className="relative z-20 w-full p-4">

          <h1 className="max-w-2xl !text-3xl md:text-4xl font-bold mb-4 pt-4 leading-tight">
            {sub.title || ''}
          </h1>

          <div className="relative max-w-8xl flex flex-col md:flex-row gap-4 md:pt-4 items-stretch">

            {/* LEFT SIDE */}
            <div className="w-full md:w-1/2 flex flex-col bg-black/5 backdrop-blur-md rounded-xl shadow-2xl">
              <div
                className="w-full h-[40vh] md:h-[60vh] shadow-2xl"
                style={{
                  backgroundImage: image ? `url(${image})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full md:w-[55%] flex flex-col justify-between">
              <div
                className="user-content bg-black/25 backdrop-blur-md rounded-xl shadow-2xl p-6"
                dangerouslySetInnerHTML={{ __html: sub.description }}
              ></div>
            </div>

          </div>

          {/* ⭐ QR CODE FIXED TO PAGE BOTTOM-RIGHT */}
          <div
            className="
                      fixed bottom-8 right-12 
                      flex flex-col items-center md:items-end 
                      gap-2 z-[9999]
                    "
          >
            {selected.qr_code_url && (
              <div className="w-32 h-32 p-1 overflow-hidden rounded-sm">
                <img
                  src={selected.qr_code_url}
                  className="w-full h-full object-cover scale-[1.4]"
                  alt="QR"
                />
              </div>
            )}

            <span className="text-white font-semibold text-sm md:text-base pr-1">
              Learn More
            </span>
          </div>
        </div>
      </div>
    );
  };


  // const WeaponsView = () => {
  //   if (!contents || contents.length === 0) return null;

  //   const [currentIndex, setCurrentIndex] = useState(0);
  //   const currentpage = contents[currentIndex];

  //   if (!currentpage) return null;

  //   return (
  //     <div
  //       className="relative w-full h-screen text-white overflow-hidden"
  //       style={{
  //         backgroundImage: `url(${background})`,
  //         backgroundSize: "cover",
  //         backgroundPosition: "center",
  //       }}
  //     >
  //       {/* DARK OVERLAY */}
  //       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

  //       {/* LOGO TOP LEFT – WITH SPACING */}
  //       <div
  //         className="absolute top-8 left-10 cursor-pointer z-50"
  //         // onClick={() => setMode("article")}
  //         onClick={() => navigate(`/container/${container}`)}
  //       >
  //         <img
  //           src={containerLogo}
  //           className="h-20 md:h-30 w-auto object-contain drop-shadow-2xl"
  //           alt="logo"
  //         />
  //       </div>

  //       {/* MAIN CONTENT GRID */}
  //       <div
  //         className="
  //           absolute inset-0 z-30 
  //           grid grid-cols-1 md:grid-cols-2 
  //           gap-12 
  //           px-10 md:px-24 
  //           py-24 md:py-28
  //           mt-15
  //           items-start
  //         "
  //       >
  //         {/* LEFT IMAGE */}
  //         <div className="flex justify-center md:justify-center">
  //           <img
  //             src={currentpage.files?.[0]}
  //             className="
  //               w-[80%] md:w-[70%] 
  //               h-[10%]
  //               object-contain 
  //               rounded-2xl shadow-2xl
  //             "
  //             alt="Weapon"
  //           />
  //         </div>

  //         {/* RIGHT TEXT AREA */}
  //         <div
  //           className="
  //             bg-black/35 backdrop-blur-md
  //             rounded-xl shadow-xl 
  //             p-6 md:p-10
  //             w-full
  //           "
  //         >
  //           <h1 className="text-3xl md:text-4xl font-bold mb-6">
  //             {currentpage.title}
  //           </h1>

  //           <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">
  //             {currentpage.content}
  //           </p>
  //         </div>
  //       </div>

  //       {/* QR CODE + LEARN MORE — SPACED FROM NAV BUTTONS */}
  //       <div className="absolute bottom-32 left-16 flex flex-col items-center z-40">
  //         {currentpage.qr_code_url && (
  //           <img
  //             src={currentpage.qr_code_url}
  //             className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-xl shadow-xl"
  //             alt="QR"
  //           />
  //         )}
  //         <p className="text-white font-semibold text-center mt-3 text-lg">
  //           Learn More
  //         </p>
  //       </div>

  //       {/* LEFT NAV ARROW — WITH CLEAN SPACING */}
  //       <div className="absolute bottom-12 left-12 text-5xl cursor-pointer z-40">
  //         <span
  //           onClick={() =>
  //             setCurrentIndex((prev) =>
  //               prev === 0 ? contents.length - 1 : prev - 1
  //             )
  //           }
  //           className="hover:scale-110 transition"
  //         >
  //           ❮
  //         </span>
  //       </div>

  //       {/* RIGHT NAV ARROW — WITH CLEAN SPACING */}
  //       <div className="absolute bottom-12 right-12 text-5xl cursor-pointer z-40">
  //         <span
  //           onClick={() =>
  //             setCurrentIndex((prev) =>
  //               prev === contents.length - 1 ? 0 : prev + 1
  //             )
  //           }
  //           className="hover:scale-110 transition"
  //         >
  //           ❯
  //         </span>
  //       </div>
  //     </div>
  //   );
  // };
  function formatMaterials(content) {
    if (!content) return "";

    return content.replace(/Materials:/g, "<br/><br/>Materials:");
  }


  const WeaponsView = () => {
    if (!contents || contents.length === 0) return null;

    const [currentIndex, setCurrentIndex] = useState(0);
    const currentpage = contents[currentIndex];

    if (!currentpage) return null;

    return (
      <div
        className="relative w-full h-screen text-white overflow-hidden"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        {/* LOGO TOP LEFT – MOBILE RESPONSIVE */}
        <div
          className="absolute top-4 left-4 md:top-8 md:left-10 cursor-pointer z-50"
          onClick={() => {
            console.log("morepage:", morepage);
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }


          }}
        >
          <img
            src={containerLogo}
            className="h-14 md:h-30 w-auto object-contain drop-shadow-2xl"
            alt="logo"
          />
        </div>

        {/* MAIN CONTENT GRID */}
        <div
          className="
    absolute inset-0 z-30 
    flex flex-row 
    gap-6 
    px-4 md:pr-16 
    py-12
  "
        >
          {/* LEFT IMAGE — 30% WIDTH */}
          <div
            className="flex justify-center items-center mt-4 ml-8 mb-16 basis-[25%]"
            onClick={() => {
              setMode('weapon-detail-view');
              setSelected(currentpage);
            }}
          >
            <img
              src={currentpage.files?.[0]}
              className="
        w-full 
        max-h-[280px] md:max-h-[800px]
        object-fill 
        rounded-2xl shadow-2xl
      "
              alt="Weapon"
            />
          </div>

          {/* RIGHT CONTENT — 70% WIDTH */}
          <div
            className="
      bg-white/5 backdrop-blur-md
      rounded-xl shadow-xl 
      p-5 md:px-10
      w-full 
      basis-[75%]
    "
          >
            <h1 className="text-2xl md:text-4xl opacity-90 font-bold mb-4 md:mb-6">
              {currentpage.title}
            </h1>
            <div
              className="user-content opacity-90 text-sm md:text-2xl "
              dangerouslySetInnerHTML={{ __html: formatMaterials(currentpage.content) }}
            ></div>
          </div>
        </div>


        {/* QR CODE + LEARN MORE — MOBILE RESPONSIVE */}
        <div className="absolute bottom-2 left-1/2 md:left-40 -translate-x-1/2 md:translate-x-0 flex flex-col items-center z-40">
          {currentpage.qr_code_url && (
            <div className="w-36 h-36 p-1 overflow-hidden rounded-sm">
              <img
                src={currentpage.qr_code_url}
                className="w-full h-full object-cover scale-[1.4]"
                alt="QR"
              />
            </div>
          )}
          <p className="text-white font-semibold text-center mt-2 md:mt-3 text-base md:text-lg">
            Learn More
          </p>
        </div>

        {/* LEFT NAV ARROW */}
        <div className="absolute bottom-6 left-6 md:left-16 text-4xl md:text-5xl cursor-pointer z-40">
          <span
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? contents.length - 1 : prev - 1
              )
            }
            className="hover:scale-110 transition"
          >
            ❮
          </span>
        </div>

        {/* RIGHT NAV ARROW */}
        <div className="absolute bottom-6 right-6 md:right-16 text-4xl md:text-5xl cursor-pointer z-40">
          <span
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === contents.length - 1 ? 0 : prev + 1
              )
            }
            className="hover:scale-110 transition"
          >
            ❯
          </span>
        </div>
      </div>
    );
  };

  const BoloDynamicUI = () => {

    const items = selected?.sub_contents[0] || [];
    console.log("items==================", items)
    return (
      <div
        className="relative w-full h-[1000px] bg-cover bg-center text-white"
        style={{
          backgroundImage: `url(${items.sub_image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} // Your wooden BG
        onClick={() => {
          setMode('weapons-view');
        }}
      >
        {/* Title */}
        {/* <h1 className="text-center text-4xl font-semibold py-10">
          {selected.title}
        </h1> */}
      </div>
    );
  };




  // -------------------------------TriBranchShowcaseView------------------------------------------------

  const BranchesShowcaseView = () => {
    if (!contents || contents.length === 0) return null;
    return (
      <div
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* LOGO TOP LEFT */}
        <div
          className="absolute top-4 left-6 cursor-pointer z-[9999]"
          onClick={() => {
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }


          }}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-20 md:h-32 w-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* MAIN 3-COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 w-full h-full text-white">

          {contents.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setSelected(item);
                // setMode("detail");
                setMode("subcontent-view")
              }}
              className="
                  relative flex flex-col items-center justify-center 
                  cursor-pointer group overflow-hidden
                "
            >
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-all duration-700"
                style={{
                  backgroundImage: `url(${item.files?.[0]})`,
                }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-all duration-700"></div>

              {/* CONTENT */}
              <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">

                {/* Branch Logo */}
                {item.logo && (
                  <img
                    src={item.logo}
                    className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-xl 
                                group-hover:scale-110 transition-transform duration-500"
                  />
                )}

                {/* Branch Title */}
                <h2 className="
                    mt-4 text-2xl md:text-3xl lg:text-4xl font-bold uppercase
                    drop-shadow-2xl tracking-wide
                  ">
                  {item.title}
                </h2>
              </div>
            </div>
          ))}

        </div>
      </div>
    );
  };


  const SubContentShowcaseView = () => {
    if (!selected?.sub_contents || selected.sub_contents.length === 0) return null;

    const items = selected.sub_contents;

    return (
      <div className="relative w-full h-screen flex text-white overflow-hidden">

        {/* LOGO TOP LEFT */}
        <div
          className="
            absolute top-6 left-1/2 -translate-x-1/2 
            flex items-center justify-center 
            cursor-pointer z-50
          "
          onClick={() => setMode("TriBranchShowcaseView")}
        >
          <img
            src={selected.logo}
            alt="logo"
            className="h-16 md:h-28 w-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* 3-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 w-full h-full">

          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setSubselected(item);
                console.log("item====---------------------------------------==============", item)
                setMode("sub-gallary-detail");
              }}
              className="
                relative flex flex-col items-center justify-end 
                cursor-pointer group overflow-hidden
              "
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-all duration-700"
                style={{
                  backgroundImage: `url(${item.main_image})`,
                }}
              />

              {/* Dark gradient bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

              {/* Title Bottom Center */}
              <h2 className="
                relative z-20 px-4 text-center 
                text-xl md:text-2xl font-bold tracking-wide 
                mb-10 drop-shadow-2xl
              ">
                {item.title}
              </h2>
            </div>
          ))}

        </div>
      </div>
    );
  };


  const SubContantDetailView = () => {
    if (!selected) return null;
    const videoRef = useRef(null);
    const [videoOpen, setVideoOpen] = useState(false);
    const [activeVideo, setActiveVideo] = useState(null);

    const isVideo = (url = "") =>
      /\.(mp4|webm|ogg)$/i.test(url);

    const isGif = (url = "") =>
      /\.gif$/i.test(url);

    const isMediaPlayable = (url = "") =>
      isVideo(url) || isGif(url);

    useEffect(() => {
      if (videoOpen && videoRef.current) {
        videoRef.current.muted = true; // ensure muted
        videoRef.current.play().catch(() => {
          // autoplay blocked silently – safe fallback
        });
      }
    }, [videoOpen]);

    const getBranchStylesFromDescription = (description = "") => {
      const text = description.toLowerCase();

      // NAVY → water / ships
      if (
        text.includes("navy") ||
        text.includes("ship") ||
        text.includes("boat") ||
        text.includes("vessel") ||
        text.includes("patrol")
      ) {
        return "bg-blue-200 text-white";
      }

      // AIR FORCE → air
      if (
        text.includes("air force") ||
        text.includes("aircraft") ||
        text.includes("jet") ||
        text.includes("fighter") ||
        text.includes("helicopter")
      ) {
        return "bg-sky-300 text-black";
      }

      // ARMY → land
      if (
        text.includes("army") ||
        text.includes("artillery") ||
        text.includes("tank") ||
        text.includes("infantry")
      ) {
        return "bg-yellow-400 text-black";
      }

      // fallback
      return "bg-gray-400 text-black";
    };

    return (
      <div
        className="w-full h-screen bg-cover bg-center relative p-4 md:p-6 text-white"
        style={{ backgroundImage: `url(${selected.files[0]})` }}
      >

        {/* BACK BUTTON */}
        <div
          onClick={() => setMode("subcontent-view")}
          className="
            absolute left-4 md:left-10 top-4 md:top-10 
            cursor-pointer z-50
          "
        >
          <img
            src={selected.logo}
            alt="Back"
            className="
              h-12 w-12 md:h-30 md:w-30
              object-contain drop-shadow-xl
              hover:scale-110 transition-all duration-300
            "
          />
        </div>

        {/* TITLE */}
        <div className="flex justify-center mb-6 md:mb-6 px-2 pt-4 slide-up z-[9999]">
          <div
            className={`px-6 md:px-10 py-3 md:py-4 rounded-xl shadow-xl 
    text-xl md:text-3xl font-bold text-center
    ${getBranchStylesFromDescription(subselected?.description)}`}
          >
            {subselected?.title}
          </div>


        </div>

        {/* LOGO */}
        <div
          className="absolute top-2 md:top-4 right-2 md:right-4 cursor-pointer"
          onClick={() => {
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }

          }}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-20 w-auto md:h-32 mr-12 object-contain"
          />
        </div>

        {/* CENTER PANEL */}
        <div
          className="
            absolute left-1/2 w-[95%] sm:w-[90%] md:w-[90%] max-w-8xl
            bg-white/10 backdrop-blur-sm py-12 rounded-3xl shadow-3xl
            transform -translate-x-1/2 
            top-[22%] sm:top-[20%] md:top-[22%]   /* ✅ FIX: added more spacing */
            z-[50]
          "
        >


          {/* MAIN CONTENT BLOCK */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-12   px-2 md:px-12">

            {/* LEFT IMAGE */}
            <div className="w-full md:w-[42%] h-[450px] flex flex-col items-center gap-4 md:gap-6">
              <img
                src={subselected.main_image || subselected.gallery_images?.[0]}
                className="w-full h-[400px] object-fill rounded-2xl shadow-xl cursor-pointer"
                alt=""
                onClick={() => {
                  if (isMediaPlayable(subselected.sub_image)) {
                    setActiveVideo(subselected.sub_image);
                    setVideoOpen(true);
                  }
                }}

              />
              {/* View Gallery */}
              {selected.has_subcontent && (
                <button
                  onClick={() => SetSubgalleryOpen(true)}
                  className="w-full max-w-2xl  text-white
                              font-semibold text-lg md:text-xl py-3 md:py-4 
                              rounded-xl bg-transprent backdrop-blur-3xl shadow-3xl cursor-pointer"
                >
                  View Gallery
                </button>
              )}
            </div>

            {/* RIGHT TEXT */}
            <div className="w-full md:w-[90%] text-base md:text-2xl leading-relaxed relative">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="flex-1">
                  <SplitByLines
                    html={subselected?.description}
                    lines={6}
                  />
                </div>
              </div>
              {/* QR CODE */}
              {selected.qr_code_url && (
                <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 flex flex-col items-center">
                  <img
                    src={selected.qr_code_url}
                    className="w-28 h-28 md:w-44 md:h-44 bg-white p-2 md:p-3 rounded-xl shadow-xl"
                    alt="QR"
                  />
                  <span className="mt-2 text-white font-semibold text-sm md:text-base">
                    Learn More
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {videoOpen && (
          <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center px-4">
            <div className="relative max-w-[90vw] max-h-[90vh] bg-black rounded-2xl shadow-2xl p-2">

              {/* Close */}
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                  }
                  setVideoOpen(false);
                  setActiveVideo(null);
                }}
                className="absolute -top-4 -right-4 z-50 bg-black/70 text-white 
             w-9 h-9 rounded-full flex items-center justify-center
             hover:bg-black cursor-pointer"
              >
                ✕
              </button>

              {/* Video wrapper (important for overlay positioning) */}
              <div className="relative inline-block">
                {isVideo(activeVideo) ? (
                  <video
                    ref={videoRef}
                    src={activeVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    disablePictureInPicture
                    controls={false}
                    className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain"
                  />
                ) : (
                  <img
                    key={activeVideo}   // 🔥 VERY IMPORTANT
                    src={activeVideo}
                    alt="GIF"
                    loading="eager"
                    decoding="sync"
                    className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain"
                  />

                )}



                {/* 🔥 Title overlay – bottom right */}
                {subselected?.title && (
                  <div
                    className="absolute bottom-3 right-3 
                     bg-black/60 backdrop-blur-md
                     text-white text-sm md:text-lg font-semibold
                     px-3 py-1.5 rounded-lg shadow-lg"
                  >
                    {subselected.title}
                  </div>
                )}
              </div>

              {/* Optional description */}
              {subselected?.individual_contents && (
                <div className="mt-3 text-white text-sm md:text-base text-center">
                  {subselected.individual_contents}
                </div>
              )}
            </div>
          </div>

        )}

      </div>
    );
  };


  const SubrenderGalleryView = () => {
    const mediaFiles = subselected.gallery_images || [];

    const isVideo = (url) => {
      return url.match(/\.(mp4|mov|webm)$/i); // Detect video formats
    };

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[9999] flex flex-col items-center pt-10 px-4 text-white">

        {/* CARD CONTAINER */}
        <div
          className="
            w-full max-w-6xl 
            bg-black/70 border border-white/10 
            rounded-3xl shadow-2xl
            p-4
           
            flex flex-col
            items-center
          "
        >
          {/* BACK BUTTON */}
          <div className="grid grid-cols-3 items-center">

            {/* BACK BUTTON (Left aligned) */}
            <div
              onClick={() => SetSubgalleryOpen(false)}
              className="cursor-pointer flex items-center gap-3 mb-4 justify-start"
            >
              <span className="text-white text-2xl font-bold drop-shadow">←</span>
              <p className="text-xl font-bold drop-shadow">BACK</p>
            </div>

            {/* CENTER TITLE */}
            <h1 className="text-2xl md:text-2xl font-bold text-center mb-8">
              View Gallery
            </h1>

            {/* EMPTY RIGHT SIDE — to keep the title perfectly centered */}
            <div></div>
          </div>

          {/* SCROLLABLE GRID */}
          <div
            className="
                      grid 
                      grid-cols-1 
                      sm:grid-cols-2 
                      md:grid-cols-3 
                      gap-4
                      w-full
                      overflow-y-auto
                      pr-3
                      hide-scrollbar
                    "
            style={{ maxHeight: "75vh" }}
          >
            {mediaFiles.map((file, i) => (
              <div key={i} className="w-full h-60 md:h-64 rounded-xl shadow-xl overflow-hidden border border-white/20">

                {/* If video → render video */}
                {isVideo(file) ? (
                  <video
                    controls
                    className="w-full h-full object-cover rounded-xl"
                  >
                    <source src={file} type="video/mp4" />
                    Your browser does not support video playback.
                  </video>
                ) : (
                  /* Else show image */
                  <img
                    src={file}
                    className="w-full h-full object-cover rounded-xl"
                    alt=""
                  />
                )}

              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ------------------------------------------------------------------------------------------

  const CardDetailView = () => {
    if (!contents[0]) return null;
    const fuldata = contents[0]
    return (
      <div
        className="w-full min-h-screen bg-cover bg-center relative p-4 md:p-10 text-white"
        style={{ backgroundImage: `url(${fuldata.background_url})` }}
      >

        {/* BACK BUTTON */}
        <div
          onClick={() => {
            console.log("----------------------", container)
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }

          }}
          className="absolute left-4 md:left-10 top-4 md:top-10 cursor-pointer select-none flex items-center gap-2 md:gap-3 z-50"
        >
          <span className="text-white text-3xl md:text-5xl font-bold drop-shadow">←</span>
          <p className="text-lg md:text-2xl font-bold tracking-wide drop-shadow mt-1">
            BACK
          </p>
        </div>

        {/* TITLE */}
        <div className="flex justify-center mb-6 md:mb-10 px-2 slide-up z-[9999]">
          <div className="bg-yellow-400 text-black px-6 md:px-10 py-3 md:py-4 rounded-xl shadow-xl 
                          text-xl md:text-3xl font-bold text-center">
            {fuldata.title}
          </div>
        </div>

        {/* LOGO */}
        <div
          className="absolute top-2 md:top-4 right-2 md:right-4 cursor-pointer"
          onClick={() => {
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }

          }}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-20 w-auto md:h-40 object-contain"
          />
        </div>

        {/* CENTER PANEL */}
        <div
          className="
            absolute left-1/2 w-[75%] sm:w-[90%] md:w-[50%] max-w-7xl
            bg-white/20 backdrop-blur-xl p-6 md:p-12 rounded-3xl shadow-2xl
            transform -translate-x-1/2
            top-[22%] sm:top-[20%] md:top-[15%]   /* ✅ FIX: added more spacing */
            z-[50]
          "
        >


          {/* MAIN CONTENT BLOCK */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 pb-6 md:pb-4 px-2 md:px-6">

            {/* LEFT IMAGE */}
            <div className="w-full md:w-[40%] flex flex-col items-center gap-4 md:gap-6">

              <img
                src={fuldata.files[0]}
                className="w-full max-w-xl md:max-w-md rounded-2xl shadow-xl"
                alt=""
              />

              {/* View Gallery */}
              {fuldata && (
                <button
                  onClick={() => setGalleryOpen(true)}
                  className="w-full max-w-2xl bg-white/30 backdrop-blur-lg text-white
                              font-semibold text-lg md:text-xl py-3 md:py-4 
                              rounded-xl shadow-lg border border-white/40"
                >
                  View Gallery
                </button>
              )}

            </div>

            {/* RIGHT TEXT */}
            <div className="w-full md:w-[50%] text-base md:text-xl leading-relaxed">

              {showFullText ? (
                <>
                  {fuldata.content}
                  <button
                    onClick={() => setShowFullText(false)}
                    className="text-yellow-300 font-bold ml-2 underline"
                  >
                    Show less
                  </button>
                </>
              ) : (
                <>
                  {trimWords(fuldata.content, 60)}
                  <button
                    onClick={() => setShowFullText(true)}
                    className="text-yellow-300 font-bold ml-2 underline"
                  >
                    Show more
                  </button>
                </>
              )}

            </div>

          </div>


          {/* QR CODE */}
          {fuldata.qr_code_url && (
            <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 flex flex-col items-center">
              <img
                src={fuldata.qr_code_url}
                className="w-28 h-28 md:w-44 md:h-44 bg-white p-2 md:p-3 rounded-xl shadow-xl"
                alt="QR"
              />
              <span className="mt-2 text-white font-semibold text-sm md:text-base">
                Learn More
              </span>
            </div>
          )}

        </div>
      </div>
    );
  };

  const SpecialOpsShowcaseView = () => {
    if (!selected) return null;
    // console.log("iiiiiiiiiiiiiiiiii--------------------",selected)

    return (
      <div
        className="relative w-full h-screen overflow-hidden text-white"
        style={{
          backgroundImage: `url(${selected.background || background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* === LEFT SIDE CONTENT === */}
        <div className="absolute left-10 top-20 md:top-28 z-40 flex flex-col gap-6 max-w-[45%]">

          {/* LOGO */}
          <img
            src={selected.logo}
            alt="Special Ops Logo"
            className="h-20 md:h-32 w-auto drop-shadow-2xl"
          />

          {/* TITLE */}
          <h1 className="text-2xl md:text-4xl font-bold leading-snug drop-shadow-2xl">
            Armed Forces of the Philippines
          </h1>

          {/* SUBTITLE */}
          <h2 className="text-xl md:text-3xl font-bold text-yellow-400 tracking-wider drop-shadow-2xl">
            SPECIAL OPERATIONS COMMAND
          </h2>

        </div>

        {/* === RIGHT SIDE GIF / IMAGE === */}
        <div className="absolute right-10 bottom-10 md:bottom-0 flex items-end z-30">
          <img
            src={selected.gif || selected.right_image}
            className="h-[55vh] md:h-[70vh] object-contain drop-shadow-2xl"
            alt="Special Ops GIF"
          />
        </div>

        {/* === BOTTOM BACK BUTTON === */}
        <div
          onClick={() => setMode("TriBranchShowcaseView")}
          className="
            absolute bottom-12 left-12
            z-50 cursor-pointer
            text-2xl md:text-3xl font-bold
            drop-shadow-2xl
            hover:scale-110 transition-all
          "
        >
          BACK
        </div>
      </div>
    );
  };


  const AfpMenuOverlay = () => {

    return (
      <div
        className="relative w-full h-screen flex flex-col items-center justify-center text-white"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* TOP BLUR OVERLAY */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        {/* CENTER LOGO */}
        <img
          src={containerLogo}
          alt="AFP Logo"
          className="relative z-20 w-44 h-auto drop-shadow-2xl mb-10"
          onClick={() => {
            console.log("morepage:", morepage);
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }

          }}

        />

        {/* MENU BAR */}
        <div
          className="
            relative z-30
            bg-black/40 backdrop-blur-md 
            px-10 py-6 rounded-xl
            flex gap-12 text-2xl font-semibold tracking-widest
          "
        >
          {contents.map((item, index) => (
            <button
              key={index}
              onClick={() => { setSubselected(item); setMode(item.view_mode); console.log("------item-----", item) }}
              className="
                hover:text-yellow-300 transition 
                hover:scale-105 tracking-widest border-r-2 pr-10
              "
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
    );
  }


  const AfpPresentationView = () => {
    const [screen, setScreen] = useState("overview");
    // overview | mission | coat
    return (
      <div
        className="w-full h-screen text-white relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        {/* ========== OVERVIEW SCREEN ========== */}
        {screen === "overview" && (
          <div className="relative w-full h-[95%] backdrop-blur-sm bg-black/40 flex flex-col items-center px-4">

            {/* LOGO */}
            <img
              src={logo}
              onClick={() => setMode("asf")}
              className="
                mt-8
                w-32 sm:w-36 md:w-44
                drop-shadow-xl
                cursor-pointer
              "
            />

            {/* CONTENT */}
            <div className="flex flex-col items-center justify-center flex-1 max-w-4xl text-center">

              <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed font-semibold px-4 sm:px-8 mt-8">
                {subselected.content}
              </p>

              {/* MENU */}
              <div className="flex gap-16 sm:gap-24 md:gap-40 text-2xl sm:text-3xl md:text-4xl font-bold mt-12 tracking-widest">
                <button
                  onClick={() => setScreen("mission")}
                  className="hover:text-yellow-300 transition"
                >
                  MISSION
                </button>

                <button
                  onClick={() => setScreen("coat")}
                  className="hover:text-yellow-300 transition"
                >
                  COAT OF ARMS
                </button>
              </div>
            </div>
          </div>
        )}


        {/* ========== MISSION SCREEN ========== */}
        {screen === "mission" && (
          <div className="text-center px-8 max-w-6xl">
            <h1 className="text-5xl font-bold mb-10 tracking-widest"
              onClick={() => setScreen("overview")}
            >MISSION</h1>

            <p className="text-2xl md:text-3xl leading-relaxed bg-black/40 p-6 rounded-2xl backdrop-blur-sm">
              To enhance professionalism, promote honesty and integrity in the
              military service, instill ethical standards and inculcate a strong
              sense of public accountability among military and civilian personnel
              in the pursuit of a common commitment against graft and corruption in
              the Armed Forces of the Philippines.
            </p>
          </div>
        )}

        {/* ========== COAT OF ARMS SCREEN ========== */}
        {screen === "coat" && (

          <div className="w-full h-full flex flex-col items-center px-12 pt-12">


            {/* TITLE */}
            <h1 className="text-[52px] font-bold tracking-[0.25em] mb-4 text-white">
              COAT OF ARMS
            </h1>

            {/* CENTER AREA */}
            <div className="relative flex items-center justify-center">

              {/* LOGO */}
              <img
                src="/images/coat-of-arms(1).png"
                alt="Coat of Arms"
                className="
                  w-[220px] 
                  md:w-[220px] 
                  lg:w-[340px]
                  object-contain
                  drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]
                  cursor-pointer
                  transition-transform duration-300 hover:scale-105
                "
                onClick={() => setScreen("overview")}
              />


              {/* ===== LEFT LABELS + LINES ===== */}
              {/* Three Stars */}
              <div className="absolute left-[-160px] top-[30px] flex items-center gap-3">
                <span className="text-xl text-white opacity-90">Three Stars</span>
                <span className="w-50 h-[1px] bg-white/70"></span>
              </div>

              {/* Sampaguita Garland */}
              <div className="absolute left-[-300px] top-[138px] flex items-center gap-3">
                <span className="text-xl text-white opacity-90">
                  Sampaguita Garland
                </span>
                <span className="w-30 h-[1px] bg-white/70"></span>
              </div>

              {/* Baybayin KA */}
              <div className="absolute left-[-220px] top-[210px] flex items-center gap-3">
                <span className="text-xl text-white opacity-90">
                  Baybayin “KA”
                </span>
                <span className="w-58 h-[1px] bg-white/70"></span>
              </div>

              {/* ===== RIGHT LABELS + LINES ===== */}
              {/* Sun */}
              <div className="absolute right-[-80px] top-[180px] flex items-center gap-3">
                <span className="w-45 h-[1px] bg-white/70"></span>
                <span className="text-xl text-white opacity-90">Sun</span>
              </div>

              {/* Three Pointed Stars */}
              <div className="absolute right-[-280px] top-[250px] flex items-center gap-3">
                <span className="w-40 h-[1px] bg-white/70"></span>
                <span className="text-xl text-white opacity-90">
                  Three Pointed Stars
                </span>
              </div>

            </div>


            {/* BOTTOM CONTENT – TRUE FULL WIDTH, NO OVERFLOW */}
            <div
              className="
                absolute
                inset-x-0
                bottom-0
                backdrop-blur-sm
                bg-black/40
              "
            >
              <div className="flex justify-center gap-32 text-center text-white pb-6 pt-6">

                {/* LEFT */}
                <div className="pt-12">
                  <p className="flex flex-col text-3xl">
                    <strong className="my-2 text-xl opacity-80">
                      Baybayin “KA”
                    </strong>
                    Field Grade Officers and <br /> Flag Officers
                  </p>
                </div>

                {/* CENTER */}
                <div>
                  <p className="pb-2 text-4xl font-semibold tracking-widest">
                    LOGO SYMBOLISM
                  </p>

                  <p className="mt-1 text-xl opacity-80">
                    Sampaguita Garland & Three Pointed Stars
                  </p>

                  <p className="text-3xl leading-relaxed">
                    Company Grade Officers
                  </p>
                </div>

                {/* RIGHT */}
                <div className="pt-12">
                  <p className="flex flex-col w-64 text-3xl leading-relaxed">
                    <strong className="text-xl opacity-80">
                      Baybayin “KA”
                    </strong>
                    Kalayaan
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    );
  }

  const AfpOverviewScreen = () => {
    return (
      <div
        className="relative w-full h-screen text-white flex items-center justify-center"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark Blur Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        {/* Center Logo */}
        <img
          src={containerLogo}
          onClick={() => { setMode("asf"); }}
          className="absolute top-10 left-1/2 -translate-x-1/2 w-40 md:w-48 drop-shadow-xl z-20"
          alt="AFP Logo"
        />

        {/* MAIN TEXT BOX */}
        <div className="relative z-30 w-[75%] max-w-4xl text-center mt-32  rounded-2xl">
          <div
            className="text-2xl md:text-3xl leading-relaxed font-semibold p-6 rounded-xl"
            dangerouslySetInnerHTML={{ __html: subselected.content }}
          ></div>
        </div>

        {/* QR CODE BOTTOM RIGHT */}
        <div className="absolute bottom-10 right-10 flex flex-col items-center z-30">
          <img
            src={subselected.qr_code_url}
            className="w-32 h-32 object-contain bg-white p-2 rounded-xl shadow-xl"
            alt="QR Code"
          />
          <span className="mt-2 text-white text-lg font-semibold">Learn More</span>
        </div>
      </div>
    );
  };


  const IntroReel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const contents = subselected.sub_contents || [];
    const currentData = contents[activeIndex] || {};

    // Detect media type (video or image)
    const isVideo = (url) => {
      if (!url) return false;
      return url.endsWith(".mp4") || url.endsWith(".mov") || url.endsWith(".webm");
    };

    // Navigation Controls
    const onPrev = () => {
      setActiveIndex((prev) =>
        prev === 0 ? contents.length - 1 : prev - 1
      );
    };

    const onNext = () => {
      setActiveIndex((prev) =>
        prev === contents.length - 1 ? 0 : prev + 1
      );
    };

    return (
      <div
        className="relative w-full h-screen flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* BACKDROP */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        {/* LOGO */}
        <img
          src={containerLogo}
          alt="AFP Logo"
          className="absolute top-10 left-10 w-32 md:w-40 drop-shadow-2xl z-30"
          onClick={() => { setMode("asf"); }}
        />


        {/* MAIN CARD */}
        <div className="relative z-30 bg-black/30 rounded-2xl shadow-2xl p-4 w-[75%] max-w-4xl
                        flex flex-col items-center justify-center">

          {/* MEDIA WRAPPER */}
          <div className="w-full flex justify-center">
            {isVideo(currentData.sub_image) ? (
              <video
                src={currentData.sub_image}
                className="max-h-[80vh] w-auto rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              />
            ) : (
              <img
                src={currentData.sub_image}
                className="max-h-[80vh] w-auto rounded-xl object-contain"
                alt="media"
              />
            )}
          </div>

          {/* TITLE BAR */}
          <div className="mt-4 w-full bg-black/50 py-3 text-center rounded-xl text-xl font-bold tracking-widest">
            {currentData.title || ""}
          </div>

          {/* NAVIGATION */}
          <div className="flex justify-between items-center mt-6 px-2 pb-2 w-full">

            {/* PREV */}
            {activeIndex != 0 ? (
              <div
                className="flex flex-col items-center cursor-pointer opacity-80 hover:opacity-100"
                onClick={onPrev}
              >
                <svg width="60" height="60" viewBox="0 0 24 24" className="opacity-50">
                  <path d="M15 6l-6 6 6 6" stroke="white" strokeWidth="2" fill="none" />
                </svg>
                <span className="text-sm text-gray-300">Prev</span>
              </div>
            )
              :
              <div></div>


            }

            {/* NEXT */}
            <div
              className="flex flex-col items-center cursor-pointer opacity-80 hover:opacity-100"
              onClick={onNext}
            >
              <svg width="60" height="60" viewBox="0 0 24 24" className="opacity-80">
                <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" fill="none" />
              </svg>
              <span className="text-sm text-gray-300">Next</span>
            </div>

          </div>
        </div>
      </div>
    );
  };


  const UniformEvolution = () => {
    const [activeIndex, setActiveIndex] = useState(1);

    const items = subselected?.sub_contents || [];
    if (!items.length) {
      return <div className="text-white">No Items Found</div>;
    }

    const safeIndex = (i) => (i + items.length) % items.length;

    const centerItem = items[safeIndex(activeIndex)];
    const leftItem = items[safeIndex(activeIndex - 1)];
    const rightItem = items[safeIndex(activeIndex + 1)];

    const prev = () => {
      setActiveIndex((i) => safeIndex(i - 1));
      setInsideSelected(null);
    };

    const next = () => {
      setActiveIndex((i) => safeIndex(i + 1));
      setInsideSelected(null);
    };

    return (
      <div
        className="relative w-full h-screen text-white flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* DARK BLUR OVERLAY */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

        {/* TITLE */}
        <h1 className="absolute top-12 text-5xl font-bold tracking-[0.3em] z-30">
          Evolution of AFP Uniforms
        </h1>

        {/* MAIN CAROUSEL */}
        <div className="relative z-30 flex items-center justify-center w-[90%] mt-24">

          {/* LEFT ITEM */}
          <div className="w-1/3 flex flex-col items-center scale-90 opacity-40 blur-sm transition-all">
            <img
              src={leftItem?.sub_image}
              className="h-[42vh] object-contain"
            />
            <p className="mt-4 text-center text-lg">
              {leftItem?.title}
              <br />
              <span className="text-sm opacity-80">
                {leftItem?.individual_contents}
              </span>
            </p>
          </div>

          {/* CENTER ITEM */}
          <div className="w-1/3 flex flex-col items-center scale-110 z-40">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-10 py-8 shadow-[0_0_80px_rgba(255,255,255,0.15)]">
              <img
                src={centerItem?.sub_image}
                className="h-[55vh] object-contain cursor-pointer"
                onClick={() => {
                  console.log(
                    "LEVEL 1 selected:",
                    centerItem?.id,
                    centerItem?.title
                  );

                  setInsideSelected(centerItem);

                  // 🔑 MERGED FUNCTIONALITY (from second code)
                  const hasChildren =
                    Array.isArray(centerItem?.sub_contents) &&
                    centerItem.sub_contents.some(
                      (sc) =>
                        Array.isArray(sc.asf_blocks) &&
                        sc.asf_blocks.length > 0
                    );

                  if (hasChildren) {
                    // go to level 2 carousel
                    setMode("uniforms-second");
                  } else {
                    // go directly to detail view
                    setInsideSelectedView(centerItem);
                    setMode("uniforms-detail");
                  }
                }}
              />
            </div>

            <p className="mt-6 text-center text-xl font-semibold">
              {centerItem?.title}
              <br />
              <span className="text-lg opacity-90">
                {centerItem?.individual_contents}
              </span>
            </p>
          </div>

          {/* RIGHT ITEM */}
          <div className="w-1/3 flex flex-col items-center scale-90 opacity-40 blur-sm transition-all">
            <img
              src={rightItem?.sub_image}
              className="h-[42vh] object-contain"
            />
            <p className="mt-4 text-center text-lg">
              {rightItem?.title}
              <br />
              <span className="text-sm opacity-80">
                {rightItem?.individual_contents}
              </span>
            </p>
          </div>
        </div>

        {/* LEFT ARROW */}
        <div
          onClick={prev}
          className="absolute left-[18%] top-1/2 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100 z-40"
        >
          <svg width="70" height="70" viewBox="0 0 24 24">
            <path d="M15 6l-6 6 6 6" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* RIGHT ARROW */}
        <div
          onClick={next}
          className="absolute right-[18%] top-1/2 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100 z-40"
        >
          <svg width="70" height="70" viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* BACK */}
        <div
          onClick={() => setMode("asf")}
          className="absolute bottom-10 left-20 text-4xl font-bold tracking-widest cursor-pointer opacity-80 hover:opacity-100 z-50"
        >
          BACK
        </div>
      </div>
    );
  };




  const UniformEvolutionSecond = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const items =
      insideSelected?.sub_contents?.[0]?.asf_blocks || [];

    if (!items.length) {
      return (
        <div className="flex items-center justify-center h-screen text-white">
          No Uniforms Found
        </div>
      );
    }

    const safe = (i) => (i + items.length) % items.length;
    const center = items[safe(activeIndex)];
    const left = items[safe(activeIndex - 1)];
    const right = items[safe(activeIndex + 1)];

    return (
      <div className="relative w-full h-screen text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

        <h1 className="absolute top-12 text-4xl font-bold text-center w-full z-30">
          {insideSelected?.title}
        </h1>

        <div className="relative z-30 flex w-[90%] mt-40 mx-auto">

          {/* LEFT */}
          <div className="w-1/3 opacity-40 blur-sm scale-90 text-center">
            <img src={left?.image || left?.sub_image} className="h-[40vh] mx-auto object-contain" />
            <p>{left?.title}</p>
          </div>

          {/* CENTER */}
          <div className="w-1/3 scale-110 text-center z-40">
            <img
              src={center?.image || center?.sub_image}
              className="h-[55vh] mx-auto object-contain cursor-pointer"
              onClick={() => {
                console.log("LEVEL 2 selected:", center.id, center.title);
                setInsideSelectedView(center);
                setMode("uniforms-detail");
              }}
            />
            <p className="mt-4 text-xl font-semibold">{center?.title}</p>
          </div>

          {/* RIGHT */}
          <div className="w-1/3 opacity-40 blur-sm scale-90 text-center">
            <img src={right?.image || right?.sub_image} className="h-[40vh] mx-auto object-contain" />
            <p>{right?.title}</p>
          </div>
        </div>

        <button
          onClick={() => setActiveIndex(activeIndex - 1)}
          className="absolute left-16 top-1/2 text-4xl"
        >
          ◀
        </button>

        <button
          onClick={() => setActiveIndex(activeIndex + 1)}
          className="absolute right-16 top-1/2 text-4xl"
        >
          ▶
        </button>

        <div
          onClick={() => setMode("uniforms")}
          className="absolute bottom-10 left-20 text-3xl cursor-pointer"
        >
          BACK
        </div>
      </div>
    );
  };






  // const UniformEvolutionDetailView = () => {
  //   const [activeIndex, setActiveIndex] = useState(1);
  //   console.log("insideSelectedView------------------", insideSelectedView)

  //   const items = insideSelectedView?.items || [];

  //   // 🔥 Avoid crashes when empty
  //   if (!items.length) return <div className="text-white">No Items Found</div>;

  //   const safeIndex = (i) => (items.length === 0 ? 0 : (i + items.length) % items.length);

  //   const centerItem = items[safeIndex(activeIndex)];
  //   const leftItem = items[safeIndex(activeIndex - 1)];
  //   const rightItem = items[safeIndex(activeIndex + 1)];

  //   const prev = () => setActiveIndex((i) => safeIndex(i - 1));
  //   const next = () => setActiveIndex((i) => safeIndex(i + 1));

  //   return (
  //     <div
  //       className="relative w-full h-screen text-white flex items-center justify-center"
  //       style={{
  //         backgroundImage: `url(${background})`,
  //         backgroundSize: "cover",
  //         backgroundPosition: "center",
  //       }}
  //     >
  //       {/* BACKDROP */}
  //       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

  //       {/* TITLE */}
  //       <h1 className="absolute top-14 text-5xl font-bold tracking-widest z-30">
  //         Evolution of AFP Uniforms
  //       </h1>

  //       {/* MAIN WRAPPER */}
  //       <div className="flex items-center justify-center w-[85%] z-30 mt-20">

  //         {/* LEFT ITEM */}
  //         <div className="flex flex-col items-center w-1/3 opacity-60">
  //           <img
  //             src={leftItem?.image}
  //             className="h-[45vh] object-contain drop-shadow-2xl"
  //           />
  //           <p className="text-center mt-4 text-lg font-medium">
  //             {leftItem?.title}
  //             <br />
  //             <span className="text-sm opacity-90">{leftItem?.title}</span>
  //           </p>
  //         </div>

  //         {/* CENTER ITEM */}
  //         <div className="relative w-1/3 flex flex-col items-center">
  //           <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
  //             <img
  //               src={centerItem?.image}
  //               className="h-[55vh] object-contain drop-shadow-xl"

  //             />
  //           </div>
  //           <p className="text-center mt-6 text-xl font-semibold">
  //             {centerItem?.title}
  //             <br />
  //             <span className="text-lg opacity-90">{centerItem?.title}</span>
  //           </p>
  //         </div>

  //         {/* RIGHT ITEM */}
  //         <div className="flex flex-col items-center w-1/3 opacity-60">
  //           <img
  //             src={rightItem?.image}
  //             className="h-[45vh] object-contain drop-shadow-2xl"
  //           />
  //           <p className="text-center mt-4 text-lg font-medium">
  //             {rightItem?.title}
  //             <br />
  //             <span className="text-sm opacity-90">{rightItem?.title}</span>
  //           </p>
  //         </div>
  //       </div>

  //       {/* ARROWS */}
  //       <div
  //         onClick={prev}
  //         className="absolute left-[22%] top-1/2 -translate-y-1/2 cursor-pointer opacity-80 hover:opacity-100 z-40"
  //       >
  //         <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
  //           <path d="M15 6l-6 6 6 6" stroke="white" strokeWidth="2" fill="none" />
  //         </svg>
  //       </div>

  //       <div
  //         onClick={next}
  //         className="absolute right-[22%] top-1/2 -translate-y-1/2 cursor-pointer opacity-80 hover:opacity-100 z-40"
  //       >
  //         <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
  //           <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" fill="none" />
  //         </svg>
  //       </div>

  //       {/* BACK BUTTON */}
  //       <div
  //         onClick={() => { setMode("asf"); }}
  //         className="absolute bottom-10 left-20 cursor-pointer text-4xl font-bold tracking-widest opacity-80 hover:opacity-100 z-50"
  //       >
  //         BACK
  //       </div>
  //     </div>
  //   );
  // };

  // const UniformEvolutionDetailView = () => {
  //   const [activeIndex, setActiveIndex] = useState(0);
  //   console.log("insideSelectedView----000000--------------", insideSelectedView)
  //   const items = insideSelectedView?.items || [];
  //   if (!items.length) return <div className="text-white">No Items Found</div>;

  //   const item = items[activeIndex];


  //   return (
  //     <div
  //       className="relative w-full h-screen text-white"
  //       style={{
  //         backgroundImage: `url(${background})`,
  //         backgroundSize: "cover",
  //         backgroundPosition: "center",
  //       }}
  //     >
  //       {/* DARK OVERLAY */}
  //       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

  //       {/* HEADER */}
  //       <h1 className="absolute top-10 left-16 text-4xl font-semibold tracking-wide z-30">
  //         {insideSelectedView?.title}
  //       </h1>

  //       {/* MAIN CONTENT */}
  //       <div className="relative z-30 flex h-full px-20 pt-28">

  //         {/* LEFT – UNIFORM IMAGE */}
  //         <div className="relative w-1/2 flex items-center justify-center">
  //           <img
  //             src={item?.image}
  //             alt="Uniform Image"
  //             className="h-[70vh] object-contain drop-shadow-2xl"
  //           />

  //           {/* EXAMPLE CALLOUTS */}
  //           {item?.callouts?.map((c, index) => (
  //             <div
  //               key={index}
  //               className="absolute text-sm flex items-center gap-2"
  //               style={{ top: c.top, left: c.left }}
  //             >
  //               <span className="w-2 h-2 bg-white rounded-full" />
  //               <span className="bg-black/70 px-2 py-1 rounded">
  //                 {c.label}
  //               </span>
  //             </div>
  //           ))}
  //         </div>

  //         {/* RIGHT – DESCRIPTION PANEL */}
  //         <div className="w-1/2 pl-16 flex items-center">
  //           <div className="bg-black/50 border border-white/20 rounded-2xl p-8 max-w-xl">
  //             <p className="text-lg leading-relaxed text-white/90">
  //               {item?.text}
  //             </p>
  //           </div>
  //         </div>
  //       </div>

  //       {/* BACK BUTTON */}
  //       <div
  //         onClick={() => setMode("UniformEvolutionDetailView")}
  //         className="absolute bottom-10 left-16 text-3xl font-bold tracking-widest cursor-pointer z-40"
  //       >
  //         BACK
  //       </div>
  //     </div>
  //   );
  // };

  const UniformEvolutionDetailView = () => {
    if (!insideSelectedView) {
      return (
        <div className="flex items-center justify-center h-screen text-white">
          No Uniform Data
        </div>
      );
    }

    const labels = UNIFORM_LABELS[insideSelectedView.id] || [];

    return (
      <div
        className="relative w-full h-screen text-white overflow-hidden"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

        {/* TITLE */}
        <h1 className="absolute top-6 text-4xl font-bold text-center w-full z-30">
          {insideSelectedView.title}
          {insideSelectedView.individual_contents && (
            <div className="text-3xl opacity-80 mt-2">
              {insideSelectedView.individual_contents}
            </div>
          )}
        </h1>

        {/* IMAGE + LABELS */}
        <div className="relative z-30 mt-14 flex items-center justify-center h-full">
          <div className="relative">
            {/* UNIFORM IMAGE */}
            <img
              src={insideSelectedView.sub_image || insideSelectedView.image}
              className="
              h-[80vh]
              object-contain
              drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]
            "
              alt={insideSelectedView.title}
            />

            {/* STATIC LABELS */}
            {labels.map((label, index) => {
              const isLeft = label.side === "left";

              return (
                <div
                  key={index}
                  className={`absolute flex items-center gap-3 ${isLeft ? "left-[-300px]" : "right-[-300px]"
                    }`}
                  style={{ top: label.top }}
                >
                  {isLeft ? (
                    <>
                      <span className="text-xl w-[250px] text-center text-white opacity-90">
                        {label.text}
                      </span>
                      <span className={`${label.line} h-[1px] bg-white/70`} />
                    </>
                  ) : (
                    <>
                      <span className={`${label.line} h-[1px] bg-white/70`} />
                      <span className="text-xl w-[280px] text-center text-white opacity-90">
                        {label.text}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
            {/* FALLBACK MESSAGE (when no labels exist) */}
            {labels.length === 0 && (
              <div
                className="
      absolute
      right-[-380px]
      top-1/2
      -translate-y-1/2
      w-[360px]
      text-center
      pointer-events-none
    "
              >
                <p className="text-2xl leading-relaxed opacity-80">
                  Uniform details are not available yet.
                  <br />
                  <span className="text-lg opacity-60">
                    We will add them soon.
                  </span>
                </p>
              </div>
            )}

          </div>
        </div>

        {/* BACK */}
        <div
          onClick={() => setMode("uniforms")}
          className="absolute bottom-10 left-20 text-3xl cursor-pointer z-40 opacity-80 hover:opacity-100"
        >
          BACK
        </div>
      </div>
    );
  };




  // const SpecialOpsScreen = () => {
  //   if (!contents) return null;


  //   const data = contents?.[0] || {};
  //   const logoImg = data.logo|| containerLogo || null;

  //   const helicopterImg = data.files?.[0] || null;
  //   const soldiersImg = data.background_url || null;
  //   const title = data.title || "";
  //   const subtitleHTML = data.content || "";

  //   // 👉 Add your smoke GIF here
  //   const smokeGif = "/smoke.gif";   // <-- replace with your actual GIF URL

  //   return (
  //     <div className="relative w-full h-screen text-white overflow-hidden">

  //       {/* BACKGROUND IMAGE */}
  //       <img
  //         src={background}
  //         alt="background"
  //         className="absolute inset-0 w-full h-full object-cover opacity-80 -z-20"
  //       />

  //       {/* DARK OVERLAY */}
  //       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10"></div>

  //       {/* HELICOPTER IMAGE */}
  //       {helicopterImg && (
  //         <img
  //           src={helicopterImg}
  //           className="absolute top-15 left-[20%] w-[750px] drop-shadow-2xl z-30"
  //           alt="helicopter"
  //         />
  //       )}

  //       {/* LEFT SIDE LOGO + TEXT */}
  //       <div className="absolute left-50 top-[38%] -translate-y-1/2 max-w-md z-30">

  //         {logoImg && (
  //           <img
  //             src={logoImg}
  //             className="w-40 drop-shadow-2xl mb-6 align-center"
  //             alt="logo"
  //           />
  //         )}

  //         <h2 className="text-3xl font-semibold leading-snug">{title}</h2>

  //         <div
  //           className="text-3xl font-bold mt-2 tracking-wider text-yellow-400"
  //           dangerouslySetInnerHTML={{ __html: subtitleHTML }}
  //         ></div>
  //       </div>

  //       {/* ✨ SMOKE GIF BEHIND SOLDIERS (NOT ABOVE THEM) */}
  //       {soldiersImg && smoke && (
  //         <img
  //           src={smoke}
  //           alt="smoke"
  //           className="
  //             absolute right-0 bottom-0 
  //             h-[95%] w-[98%]
  //             object-cover opacity-60 
  //             z-20 pointer-events-none
  //           "

  //         />
  //       )}

  //       {/* SOLDIERS IMAGE (FRONT) */}
  //       {soldiersImg && (
  //         <img
  //           src={soldiersImg}
  //           className="absolute right-0 bottom-0 h-[88%] object-contain drop-shadow-2xl z-30"
  //           alt="soldiers"
  //         />
  //       )}

  //       {/* BACK BUTTON */}
  //       <button
  //         className="absolute bottom-10 left-20 text-4xl font-bold tracking-widest opacity-90 hover:opacity-100 z-30"

  //         onClick={() => 
  //         {
  //           console.log("morepage:", morepage);
  //           if (morepage) {
  //             navigate(`/container/${container}/more`);
  //           } else {
  //             navigate(`/container/${container}`);
  //           }


  //         }}

  //       >
  //         BACK
  //       </button>
  //     </div>
  //   );
  // };

  const SpecialOpsScreen = () => {
    const [showFullScreen, setShowFullScreen] = useState(false);

    if (!contents) return null;

    const data = contents?.[0] || {};
    const logoImg = data.logo || containerLogo || null;

    const helicopterImg = data.files?.[0] || null;
    const soldiersImg = data.background_url || null;
    const title = data.title || "";
    const subtitleHTML = data.content || "";

    return (
      <div className="relative w-full h-screen bg-black text-white overflow-hidden">

        {/* ========================================================== */}
        {/*  FULL SCREEN (AFTER CLICK) - THE ATTACHED SOCom SCREEN    */}
        {/* ========================================================== */}
        {showFullScreen && (
          <div className="absolute inset-0 bg-black w-full h-full z-[999] flex items-center justify-center"
            onClick={() => { setMode("elite-groups-ranger"); }}
          >

            {/* Background Image like video screenshot */}
            <img
              src={soldiersImg}
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* CENTER TEXT */}
            <div className="relative z-10 w-screen flex flex-col items-center cursor-pointer">
              <h1
                className="
                          font-bold
                          text-white
                          mt-4
                          tracking-wider
                          whitespace-nowrap
                          leading-none
                          flex-shrink-0
                          !text-6xl
                        "
              >
                Armed Forces of the Philippines
              </h1>

              <h2
                className="
                          font-bold
                          text-yellow-400
                          mt-4
                          tracking-wider
                          whitespace-nowrap
                          leading-none
                          flex-shrink-0
                         !text-6xl
                        "
              >
                SPECIAL OPERATIONS COMMAND
              </h2>
            </div>



            {/* BACK BUTTON */}
            <button
              onClick={() => setShowFullScreen(false)}
              className="absolute bottom-10 left-10 text-3xl font-bold cursor-pointer"
            >
              BACK
            </button>
          </div>
        )}

        {/* ========================================================== */}
        {/*  ORIGINAL SCREEN (BEFORE CLICK)                           */}
        {/* ========================================================== */}

        {/* BACKGROUND IMAGE */}
        <img
          src={background}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover opacity-80 -z-20"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10"></div>

        {/* HELICOPTER IMAGE */}
        {helicopterImg && (
          <img
            src={helicopterImg}
            className="absolute top-6 left-[8%] w-[700px] drop-shadow-2xl z-30"
            alt="helicopter"
          />
        )}

        {/* LEFT SIDE LOGO + TEXT */}
        <div className="absolute left-20 top-[45%] -translate-y-1/2 z-30 w-max">

          {logoImg && (
            <img
              src={logoImg}
              className="w-40 ml-40 drop-shadow-2xl mb-6"
              alt="logo"
            />
          )}

          <h2
            className="
                        !text-3xl
                        font-exterabold
                        whitespace-nowrap
                        leading-none
                      "
          >
            {title}
          </h2>

          <div
            className="
                      mt-2
                      font-exterabold
                      tracking-wider
                      text-yellow-400
                      whitespace-nowrap
                      leading-none
                    text-3xl
                    "
            dangerouslySetInnerHTML={{
              __html: subtitleHTML?.replace(/<br\s*\/?>/gi, ' ')
            }}
          />
        </div>


        {/* SMOKE GIF */}
        {soldiersImg && smoke && (
          <img
            src={smoke}
            alt="smoke"
            className="
                    absolute -right-90 -bottom-40
                    w-[87%] h-[120%]
                    object-cover object-center
                    scale-150
                    z-20
                    pointer-events-none
                  "
          />
        )}


        {/* SOLDIERS IMAGE (CLICK TO OPEN FULLSCREEN) */}
        {soldiersImg && (
          <img
            src={soldiersImg}
            className="absolute right-0 bottom-0 h-[88%] object-contain drop-shadow-2xl z-30 cursor-pointer"
            alt="soldiers"
            onClick={() => setShowFullScreen(true)}  // 👈 OPEN FULLSCREEN
          />
        )}

        {/* BACK BUTTON */}
        <button
          className="absolute bottom-10 left-20 text-4xl font-bold tracking-widest opacity-90 hover:opacity-100 z-30 cursor-pointer"
          onClick={() => {
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }
          }}
        >
          BACK
        </button>
      </div>
    );
  };


  // const ScoutRangerScreen = () => {
  //   const [showInfo, setShowInfo] = useState(false);
  //   if (!contents) return null;
  //   const data = contents?.[0].sub_contents || {};
  //   const [currentIndex, setCurrentIndex] = useState(0);
  //   const currentpage = data[currentIndex];


  //   // 👉 Replace these with your actual API / DB values
  //   const regimentLogo = currentpage.sub_image2 || null;
  //   const centerLogo = currentpage.sub_image || null;

  //   const afpLogo = contents?.[0].logo || containerLogo || null;

  //   const soldierImage = currentpage.gallery_images || null;

  //   const bgImage = currentpage.main_image;

  //   const qrCode = contents[0].qr_code_url || null;

  //   return (
  //     <div className="relative w-full h-screen text-white overflow-hidden">

  //       {/* ---------------------------------------------------- */}
  //       {/*  FIRST SCREEN (MATCHES IMAGE 1 EXACTLY)              */}
  //       {/* ---------------------------------------------------- */}
  //       {!showInfo && (
  //         <div className="relative w-full h-full">

  //           {/* BACKGROUND */}
  //           <img
  //             src={bgImage}
  //             className="absolute inset-0 w-full h-full object-cover brightness-[0.40] blur-[1px]"
  //           />

  //           {/* LEFT DARK OVERLAY */}
  //           <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10"></div>

  //           {/* AFP LOGO (TOP-LEFT) */}
  //           {afpLogo && (
  //             <img
  //               src={afpLogo}
  //               className="absolute top-10 left-10 w-24 drop-shadow-2xl z-30"
  //               alt="AFP"
  //             />
  //           )}

  //           {/* CENTER EMBLEM LOGO */}
  //           {centerLogo && (
  //             <img
  //               src={centerLogo}
  //               className="absolute top-[22%] left-[8%] w-[260px] drop-shadow-2xl z-30"
  //               alt="Regiment Emblem"
  //             />
  //           )}

  //           {/* TITLE + SUBTITLE BELOW EMBLEM */}
  //           <div className="absolute top-[42%] left-[8%] z-30">
  //             <h1 className="text-5xl font-semibold drop-shadow-2xl">
  //               {currentpage.title}
  //             </h1>

  //             <h2 className="text-6xl font-bold text-yellow-300 mt-4 drop-shadow-2xl tracking-wide">
  //               {currentpage.individual_contents}
  //             </h2>
  //           </div>

  //           {/* RIGHT SIDE ROUND LOGO */}
  //           {regimentLogo && (
  //             <img
  //               src={regimentLogo}
  //               className="absolute top-10 right-10 w-32 drop-shadow-2xl z-30"
  //               alt="Regiment Logo"
  //             />
  //           )}

  //           {/* SOLDIER IMAGE */}
  //           {soldierImage && (
  //             <img
  //               src={soldierImage}
  //               className="absolute bottom-0 right-0 h-[92%] drop-shadow-2xl z-40 cursor-pointer"
  //               alt="Soldier"
  //               onClick={() => setShowInfo(true)}
  //             />
  //           )}

  //           {/* BACK BUTTON */}
  //           <button
  //             className="absolute bottom-10 left-10 text-3xl font-bold z-50"
  //             onClick={() => setMode("elite-groups")}
  //           >
  //             BACK
  //           </button>
  //         </div>
  //       )}



  //       {/* ---------------------------------------------------- */}
  //       {/*  SECOND SCREEN (IMAGE 2)                             */}
  //       {/* ---------------------------------------------------- */}
  //       {showInfo && (
  //         <div className="absolute inset-0 w-full h-full overflow-hidden text-white"
  //           onClick={()=>{setCurrentIndex((pre)=> pre +1);setShowInfo(false)}}
  //         >

  //           {/* BACKGROUND IMAGE */}
  //           <img
  //             src={bgImage}
  //             className="absolute inset-0 w-full h-full object-cover brightness-[0.30] blur-[1px] -z-20"
  //           />

  //           {/* DARK OVERLAY */}
  //           <div className="absolute inset-0 bg-black/40 -z-10"></div>

  //           {/* TOP LEFT AFP LOGO */}
  //           <img
  //             src={afpLogo}
  //             className="absolute top-10 left-10 w-28 drop-shadow-2xl z-30"
  //             alt="AFP"
  //           />

  //           {/* TOP RIGHT UNIT LOGO */}
  //           <img
  //             src={regimentLogo}
  //             className="absolute top-10 right-10 w-32 drop-shadow-2xl z-30"
  //             alt="Regiment Logo"
  //           />

  //           {/* CENTER EMBLEM + TITLE (LEFT SIDE) */}
  //           <div className="absolute top-[28%] left-[8%] w-[30%] z-30">
  //             {/* CENTER LOGO */}
  //             <img
  //               src={centerLogo}
  //               className="w-[240px] drop-shadow-2xl mb-4"
  //               alt="Emblem"
  //             />

  //             {/* TITLE */}
  //             <h1 className="text-4xl font-bold drop-shadow-lg">
  //               {currentpage.title}
  //             </h1>

  //             {/* SUBTITLE */}
  //             <h2 className="text-5xl font-bold text-yellow-300 mt-2 drop-shadow-lg">
  //               {currentpage.individual_contents}
  //             </h2>
  //           </div>

  //           {/* RIGHT SIDE PARAGRAPH */}
  //           <p className="absolute top-[26%] right-[8%] w-[38%] text-2xl leading-relaxed drop-shadow-lg z-30">
  //             {currentpage.description}
  //           </p>

  //           {/* QR CODE SECTION */}
  //           <div className="absolute bottom-20 right-10 text-center z-30">
  //             {qrCode && <img src={qrCode} className="w-36 mb-3" />}
  //             <p className="text-xl font-semibold">Learn More</p>
  //           </div>

  //           {/* BACK BUTTON */}
  //           <button
  //             onClick={() => setShowInfo(false)}
  //             className="absolute bottom-10 left-10 text-3xl font-bold z-30"
  //           >
  //             BACK
  //           </button>

  //         </div>
  //       )}

  //     </div>
  //   );
  // };



  const ScoutRangerScreen = () => {
    const [showInfo, setShowInfo] = useState(false);
    if (!contents) return null;

    const data = contents?.[0].sub_contents || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentpage = data[currentIndex];

    // IMAGES
    const regimentLogo = currentpage?.sub_image2 || null;
    const centerLogo = currentpage?.sub_image || null;
    const afpLogo = contents?.[0].logo || containerLogo || null;
    const soldierImage = currentpage?.gallery_images || null;
    const bgImage = currentpage?.main_image;
    const qrCode = contents?.[0].qr_code_url || null;

    // ---------------------------------------------
    // NEXT FUNCTION (SAFE INDEX UPDATE)
    // ---------------------------------------------
    const goNext = () => {
      setCurrentIndex((prev) =>
        prev + 1 < data.length ? prev + 1 : 0 // loop back to 0
      );
      setShowInfo(false);
    };
    const isPhilippineNaval =
      currentpage?.title
        ?.toString()
        .toLowerCase()
        .includes("philippine naval");


    return (
      <div className="relative w-full h-screen text-white overflow-hidden">

        {/* ---------------------------------------------------- */}
        {/*  FIRST SCREEN                                        */}
        {/* ---------------------------------------------------- */}
        {!showInfo && (
          <div className="relative w-full h-full">

            {/* BACKGROUND */}
            <img
              src={bgImage}
              className="absolute inset-0 w-full h-[110%] object-cover object-center
                    scale-125
                   brightness-[0.45]"
              alt="background"
            />

            {/* LEFT 40% DARK | RIGHT 60% LIGHT */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: `
            linear-gradient(
              to right,
              rgba(0,0,0,0.75) 0%,
              rgba(0,0,0,0.75) 0%,
              rgba(0,0,0,0.05) 40%,
              rgba(0,0,0,0.05) 100%
            )
          `
              }}
            />

            {/* AFP LOGO - TOP LEFT */}
            {afpLogo && (
              <img
                src={afpLogo}
                className="absolute top-10 left-10 w-24 drop-shadow-2xl z-30"
                alt="afp"
              />
            )}

            {/* REGIMENT LOGO - TOP RIGHT */}
            {regimentLogo && (
              <img
                src={regimentLogo}
                className="absolute top-10 right-10 w-32 drop-shadow-2xl z-100"
                alt="regiment"
              />
            )}

            {/* CENTER LOGO */}
            <div className="relative w-full h-full flex z-30">

              {/* ================= LEFT SECTION (40%) ================= */}
              <div className="w-[40%] flex flex-col justify-center items-center">

                {centerLogo && (
                  <img
                    src={centerLogo}
                    alt="center"
                    className={`
                             h-[250px] drop-shadow-2xl mb-8 object-contain
                              ${isPhilippineNaval ? "w-[500px]" : "w-[250px]"}
                            `}
                  />
                )}


                <h1 className="!text-4xl font-semibold    drop-shadow-2xl
                              tracking-wide
                              w-[380px]
                              text-center
                              leading-snug
                              break-words">
                  {currentpage?.title}
                </h1>

                <h2
                  className="
                            !text-4xl
                            font-bold
                            text-yellow-300
                            mt-2
                            drop-shadow-2xl
                            tracking-wide
                            w-[380px]
                            text-center
                            leading-snug
                            break-words
                          "
                >
                  {currentpage?.individual_contents}
                </h2>

              </div>

              {/* ================= RIGHT SECTION (60%) ================= */}
              <div className="w-[70%] flex items-center justify-center ">

                {soldierImage && (
                  <img
                    src={soldierImage}
                    alt="soldier"
                    onClick={() => setShowInfo(true)}
                    className="
                              absolute
                              bottom-0        
                              h-[95%]
                              object-contain
                              drop-shadow-2xl
                              cursor-pointer
                            "
                  />
                )}
              </div>

              {/* ================= BACK BUTTON ================= */}
              <button
                className="absolute bottom-10 left-10 text-3xl font-bold z-50 cursor-pointer"
                onClick={() => setMode("elite-groups")}
              >
                BACK
              </button>
              <button
                className="absolute bottom-10 left-130 text-3xl font-bold z-50 cursor-pointer"
                onClick={() => setShowInfo(true)}
              >
                Info
              </button>


            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/*  SECOND SCREEN                                       */}
        {/* ---------------------------------------------------- */}
        {showInfo && (
          <div
            className="absolute inset-0 w-full min-h-full overflow-hidden text-white"

          >
            {/* BACKGROUND */}
            <img
              src={bgImage}
              className="absolute inset-0 w-full h-[110%] object-cover object-center scale-125 brightness-[0.65]"
              alt="background"
            />
            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm -z-10"></div>


            {/* TOP LOGOS */}
            {afpLogo && (
              <img
                src={afpLogo}
                className="absolute top-10 left-10 w-28 drop-shadow-2xl z-30"
                alt="afp"
              />
            )}

            {regimentLogo && (
              <img
                src={regimentLogo}
                className="absolute top-10 right-10 w-32 drop-shadow-2xl z-30"
                alt="regiment"
              />
            )}

            {/* MAIN TWO-COLUMN LAYOUT */}

            <div className="relative w-full h-full flex z-30">

              {/* ================= LEFT SECTION (FIXED WIDTH) ================= */}
              <div className="w-[550px] flex-shrink-0 flex flex-col justify-center items-center">

                {centerLogo && (
                  <img
                    src={centerLogo}
                    alt="center"
                    className={`
                              h-[250px] drop-shadow-2xl mb-8 object-contain
                              ${isPhilippineNaval ? "w-[500px]" : "w-[250px]"}
                            `}
                  />
                )}

                <h1 className="
                              !text-4xl font-semibold drop-shadow-2xl tracking-wide
                              w-[380px] text-center leading-snug break-words
                            ">
                  {currentpage?.title}
                </h1>

                <h2 className="
                              !text-4xl font-bold text-yellow-300 mt-2 drop-shadow-2xl
                              tracking-wide w-[380px] text-center leading-snug break-words
                            ">
                  {currentpage?.individual_contents}
                </h2>
              </div>

              {/* ================= RIGHT SECTION (FLEXIBLE + GROW DOWN) ================= */}
              <div className="relative flex-1 flex flex-col justify-between pr-4">

                {/* TEXT (grows downward) */}
                <div
                  className="
                              mt-[17%]
                              text-3xl leading-relaxed drop-shadow-lg text-center
                              max-w-[1000px]
                              ml-0
                              overflow-visible
                            "
                  style={{
                    // allow long text to overlay into left side if needed
                    marginLeft: "-70px",
                  }}
                >
                  {currentpage?.description}
                </div>

                {/* QR — ALWAYS AT BOTTOM */}
                <div className="flex justify-end pb-10 pr-6">
                  {qrCode && (
                    <div className="text-center w-36">
                      <div className="w-36 h-36 p-1 overflow-hidden rounded-sm">
                        <img
                          src={qrCode}
                          className="w-full h-full object-cover scale-[1.4]"
                          alt="QR"
                        />
                      </div>
                      <p className="text-xl mt-2 font-semibold">Learn More</p>
                    </div>
                  )}
                </div>

              </div>

              {/* BACK BUTTON */}
              <button
                onClick={() => setShowInfo(false)}
                className="absolute bottom-10 left-10 text-3xl font-bold z-50 cursor-pointer"
              >
                BACK
              </button>

              {/* Next BUTTON */}
              <button
                onClick={goNext}
                className="absolute bottom-10 left-130 text-3xl font-bold z-50  cursor-pointer"
              >
                Next
              </button>

            </div>

          </div>
        )}

      </div>

    );
  };




  /* ----------------------------------------------------------------------------------------
     🔥 FINAL OUTPUT (SELECT DISPLAY MODE)
  -----------------------------------------------------------------------------------------*/
  return (
    <>
      {/* Presentation view must override all */}
      {mode === "presentation-view" && <PresentationView />}

      {mode === "normal-view" && renderNormalView()}
      {mode === "slide-view" && renderSlideView()}
      {mode === "thumbnail-gallery" && renderThumbnailGalleryView()}

      {mode === "card-carousel" && renderCardCarouselView()}
      {mode === "card-detail" && renderCardDetailView()}

      {mode === "diagonal-split-view" && <DiagonalHomeView
        contents={contents}
        background={background}
        containerLogo={containerLogo}
        screenName={screenName}
      />

      }
      {mode === "detail" && <DetailView />}

      {mode === "slider-thumbnail-view" && (
        <PresentationShowcaseView
          contents={contents}
          background={background}
          container={container}
          containerLogo={containerLogo}
          morepage={morepage}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setSelected={setSelected}
          setMode={setMode}
        />
      )}

      {mode === 'slider-thumb' && <SliderThumbnailGalleryView />}
      {mode === 'article-view' && <ArticleShowcaseView />}
      {mode === 'detail-article-view' && <DetailArticleView />}

      {mode === 'weapons-view' && <WeaponsView />}
      {mode === 'weapon-detail-view' && <BoloDynamicUI />}

      {mode === "TriBranchShowcaseView" && <BranchesShowcaseView />}
      {mode === "subcontent-view" && <SubContentShowcaseView />}
      {mode === "sub-gallary-detail" && <SubContantDetailView />}
      {mode === "gallary-detail-view" && <SubrenderGalleryView />}
      {subgalleryOpen && SubrenderGalleryView()}


      {mode === "gallary-detail-view" && <SpecialOpsShowcaseView />}

      {mode === "CardDetailView" && <CardDetailView />}

      {mode === "asf" && <AfpMenuOverlay />}

      {mode === "overview" && <AfpPresentationView />}

      {mode === "history" && <AfpOverviewScreen />}

      {mode === "visual-reels" && <IntroReel />}

      {mode === 'uniforms' && <UniformEvolution />}

      {mode === 'uniforms-second' && <UniformEvolutionSecond />}

      {mode === 'uniforms-detail' && <UniformEvolutionDetailView />}


      {mode === 'elite-groups' && <SpecialOpsScreen />}
      {mode === 'elite-groups-ranger' && <ScoutRangerScreen />}



      {galleryOpen && renderGalleryView()}

    </>
  );


}

export default ScreenView;

