import React, { useState , useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../Api/Api";

function MoreOptionsView() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [container ,setContainer] = useState()
  const token = sessionStorage.getItem("authToken");
  const morepage = sessionStorage.getItem("moresection");
  console.log(morepage, "=================================morepage===============================")
  const fetchContainer = async () => {
    try {
      const res = await fetch(`${Api}/api/v1/screen_containers/${slug}/more_screens`, {
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
    
  }, [slug]);

  if (!container) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }


  return (
    <div
      className="relative w-full min-h-screen  text-white flex flex-col items-center"
      style={{
        backgroundImage: `url(${container.background_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70 "></div>
      {/* BACK BUTTON */}
      <button
        onClick={() => 
        {
          navigate(`/container/${slug}`);
          sessionStorage.setItem("moresection", "false");
        }
      
      }
        className="
          px-20 py-3
        bg-black/30 
        text-white 
        text-lg md:text-2xl 
        font-semibold 
        rounded-b-xl 
        hover:bg-black/80 
        backdrop-blur-md
        shadow-xl
        transition-all
        "
      >
        BACK TO HOMEPAGE
      </button>

      {/* LOGO */}
      <img
        src={container.files?.[0]}
        alt="logo"
        className="h-24 md:h-48 object-contain drop-shadow-2xl mb-10"
      />

      {/* MAIN GRID */}
      <div className="
        grid 
        grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
        gap-8 
        max-w-6xl w-full justify-items-center
      ">
        {container.subscreens?.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(`/screen/${item.id}?container=${slug}`)}
            className="
              w-[90%] sm:w-[90%] md:w-[80%] lg:w-[100%]
              h-48 md:h-56 lg:h-60
              rounded-3xl shadow-2xl bg-black/40
              overflow-hidden cursor-pointer
              transition transform hover:scale-105
              backdrop-blur-sm border border-white/20
            "
            style={{
              backgroundImage: `url(${item.card_image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* DARK OVERLAY */}
            <div className="w-full h-full bg-black/40 flex items-center justify-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg text-center px-4">
                {item.name}
              </h2>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default MoreOptionsView;
