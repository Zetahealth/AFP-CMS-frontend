import React, { useEffect, useState } from "react";
import Api from "../../Api/Api";

function ScreenContainers() {
  const [screens, setScreens] = useState([]);
  const [containers, setContainers] = useState([]);
  const [containerName, setContainerName] = useState("");
  const [contentType, setContentType] = useState("image");
  const [transitionEffect, setTransitionEffect] = useState("fade");
  const [contentFiles, setContentFiles] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [subbackgroundFile, setSubBackgroundFile] = useState(null);
  const permission = sessionStorage.getItem("permission");

  const [loading, setLoading] = useState(false);
  const [displayMode, setDisplayMode] = useState("slide-view");


  const [errors, setErrors] = useState({}); // VALIDATION ERRORS
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  const [editPopup, setEditPopup] = useState(false);


  const [confirmPopup, setConfirmPopup] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // "delete" | "edit"
  const [confirmInput, setConfirmInput] = useState("");
  const [confirmContainer, setConfirmContainer] = useState(null);



  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    fetchScreens();
    fetchContainers();
  }, []);

  async function fetchScreens() {
    try {
      const res = await fetch(`${Api}/api/v1/screens`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch screens");
      const data = await res.json();
      setScreens(data);
    } catch (err) {
      console.error("❌ Error fetching screens:", err);
    }
  }

  async function fetchContainers() {
    try {
      const res = await fetch(`${Api}/api/v1/screen_containers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("📦 Fetched containers:=================vfdgfgdget=================================", data);
      setContainers(data);
    } catch (err) {
      console.error("❌ Error fetching containers:", err);
    }
  }




  const validateForm = () => {
    let e = {};

    if (!containerName.trim()) e.name = "Container name is required";

    if (!contentType) e.contentType = "Select content type";

    // Validate Card Files
    if (!contentFiles || contentFiles.length === 0) {
      e.files = "Upload at least one card image";
    } else {
      Array.from(contentFiles).forEach((file) => {
        if (file.size > 100 * 1024 * 1024) {
          e.files = "Each file must be under 100MB";
        }
        if (contentType === "image" && !file.type.startsWith("image/")) {
          e.files = "Content type is Image, but file is not an image";
        }
        if (contentType === "video" && !file.type.startsWith("video/")) {
          e.files = "Content type is Video, but file is not a video";
        }
      });
    }

    // Validate Background File
    if (backgroundFile && backgroundFile.size > 100 * 1024 * 1024) {
      e.background = "Background file must be under 100MB";
    }


    if (subbackgroundFile && subbackgroundFile.size > 100 * 1024 * 1024) {
      e.subbackgroundFile = "Background file must be under 100MB";
    }

    
    setErrors(e);
    return Object.keys(e).length === 0;
  };


  // async function createContainer(e) {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const formData = new FormData();
  //     formData.append("name", containerName);
  //     formData.append("content_type", contentType);
  //     formData.append("display_mode", displayMode);

  //     if (contentFiles) {
  //       Array.from(contentFiles).forEach(f => formData.append("files[]", f));
  //     }

  //     if (backgroundFile) {
  //       formData.append("background", backgroundFile);
  //     }

  //     const res = await fetch(`${Api}/api/v1/screen_containers`, {
  //       method: "POST",
  //       headers: { Authorization: `Bearer ${token}` },
  //       body: formData,
  //     });

  //     if (!res.ok) throw new Error("Upload failed");

  //     alert("Container Created!");
  //     fetchContainers();
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error creating container");
  //   }

  //   setLoading(false);
  // }
  async function createContainer(e) {
    e.preventDefault();

    if(permission !== "editor") {
      alert("❌ You do not have permission to create containers.");
      return;
    }

    if (!validateForm()) return; // STOP IF INVALID

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", containerName);
      formData.append("content_type", contentType);
      formData.append("display_mode", displayMode);

      Array.from(contentFiles).forEach((f) => formData.append("files[]", f));

      if (backgroundFile) {
        formData.append("background", backgroundFile);
      }
      if (subbackgroundFile) {
        formData.append("subbackground", subbackgroundFile);
      }

      

      const res = await fetch(`${Api}/api/v1/screen_containers`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create container");

      alert("Container Created!");
      fetchContainers();

      // Reset Form
      setContainerName("");
      setContentFiles(null);
      setBackgroundFile(null);
      setSubBackgroundFile(null);
    } catch (err) {
      alert("Error creating container");
      console.error(err);
    }

    setLoading(false);
  }




  // async function deleteContainer(containerId) {
  //   if (!window.confirm("Are you sure you want to delete this container?")) return;

  //   try {
  //     const res = await fetch(`${Api}/api/v1/screen_containers/${containerId}`, {
  //       method: "DELETE",
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (!res.ok) throw new Error(`Failed to delete: ${res.status}`);

  //     alert("Container deleted successfully!");
  //     fetchContainers(); // refresh list
  //   } catch (err) {
  //     console.error("❌ Error deleting container:", err);
  //     alert("Error deleting container");
  //   }
  // }

  async function deleteContainer(containerId) {
    try {
      const res = await fetch(`${Api}/api/v1/screen_containers/${containerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      alert("Container deleted successfully!");
      fetchContainers();
    } catch (err) {
      alert("Error deleting container");
    }
  }



  async function assignScreenToContainer(containerId, screenId) {
    await fetch(`${Api}/api/v1/screen_containers/${containerId}/assign_screen`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ screen_id: screenId }),
    });
    fetchContainers();
  }

  async function unassignScreenFromContainer(containerId, screenId) {
    await fetch(
      `${Api}/api/v1/screen_containers/${containerId}/unassign_screen?screen_id=${screenId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchContainers();
  }


//  subsceens assign screens



  async function assignSubScreenToContainer(containerId, screenId) {
    await fetch(`${Api}/api/v1/screen_containers/${containerId}/assign_sub_screen`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ screen_id: screenId }),
    });
    fetchContainers();
  }

  async function unassignSubScreenFromContainer(containerId, screenId) {
    await fetch(
      `${Api}/api/v1/screen_containers/${containerId}/unassign_sub_screen?screen_id=${screenId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchContainers();
  }



  // 🖼️ Preview helper
  const renderFilePreview = (fileList) => {
    if (!fileList) return null;

    return Array.from(fileList).map((file, i) => {
      const url = URL.createObjectURL(file);
      if (file.type.startsWith("image/")) {
        return (
          <img
            key={i}
            src={url}
            alt="preview"
            className="w-24 h-24 object-cover rounded-lg border"
          />
        );
      } else if (file.type.startsWith("video/")) {
        return (
          <video
            key={i}
            src={url}
            controls
            className="w-24 h-24 rounded-lg border"
          />
        );
      } else {
        return (
          <p key={i} className="text-gray-500 text-sm">
            {file.name}
          </p>
        );
      }
    });
  };


    // Pagination Calculations
  const totalPages = Math.ceil(containers.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentContainers = containers.slice(indexOfFirst, indexOfLast);

  const handleNext = () =>
    setCurrentPage((p) => (p < totalPages ? p + 1 : p));

  const handlePrev = () =>
    setCurrentPage((p) => (p > 1 ? p - 1 : p));


  // const [editPopup, setEditPopup] = useState(false);
  const [editingContainer, setEditingContainer] = useState(null);

  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("image");

  const [editCardImage, setEditCardImage] = useState(null);
  const [editBackground, setEditBackground] = useState(null);
  const [subeditBackground, setSubEditBackground] = useState(null);


  const [existingCardImage, setExistingCardImage] = useState(null);
  const [existingBackground, setExistingBackground] = useState(null);
  const [subexistingBackground, setSubExistingBackground] = useState(null);

  const [openAccordion, setOpenAccordion] = useState(null);


  function openEdit(c) {
    setEditingContainer(c);
    setEditName(c.name);
    setEditType(c.content_type);

    // existing images
    setExistingCardImage(c.files?.[0] || null);
    setExistingBackground(c.background_url || null);
    setSubExistingBackground(c.subbackground_url || null)

    setEditPopup(true);
  }

  async function updateContainer(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", editName);
    formData.append("content_type", editType);

    // only add new card image
    if (editCardImage) {
      formData.append("files", editCardImage);
    }

    // only add new background file
    if (editBackground) {
      formData.append("background", editBackground);
    }
    if(subeditBackground){
      formData.append("subbackground", subeditBackground);
    }

    const res = await fetch(`${Api}/api/v1/screen_containers/${editingContainer.id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      alert("Update failed!");
      return;
    }

    alert("Updated Successfully!");

    setEditPopup(false);
    fetchContainers();
  }




  return (
    <>
      {loading && (
        <div className="absolute inset-0 bg-gray-100/80 flex flex-col items-center justify-center rounded-2xl z-10">
          <svg
            className="animate-spin h-10 w-10 text-blue-600 mb-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
            ></path>
          </svg>
          <span className="text-blue-700 font-medium">Uploading...</span>
        </div>
      )}

      <div className="p-6">
      
        <section className="bg-white shadow-md rounded-2xl p-6 mb-10">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">
            Create New Container
          </h3>
          <form onSubmit={createContainer} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block font-medium">Container Name</label>
              <input
                value={containerName}
                onChange={(e) => setContainerName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Content Type */}
            <div>
              <label className="block font-medium">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
              {errors.contentType && (
                <p className="text-red-500 text-sm">{errors.contentType}</p>
              )}
            </div>

            {/* Card Files */}
            <div>
              <label className="block font-medium">Upload Logo</label>
              <input
                type="file"
                multiple
                onChange={(e) => setContentFiles(e.target.files)}
                className="w-full border border-dashed px-4 py-3 rounded-lg"
              />
              {errors.files && <p className="text-red-500 text-sm">{errors.files}</p>}
            </div>

            {/* Background */}
            <div>
              <label className="block font-medium">Upload Background</label>
              <input
                type="file"
                onChange={(e) => setBackgroundFile(e.target.files[0])}
                className="w-full border border-dashed px-4 py-3 rounded-lg"
              />
              {errors.background && (
                <p className="text-red-500 text-sm">{errors.background}</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Upload Background For SubScreens</label>
              <input
                type="file"
                onChange={(e) => setSubBackgroundFile(e.target.files[0])}
                className="w-full border border-dashed px-4 py-3 rounded-lg"
              />
              {errors.subbackgroundFile && (
                <p className="text-red-500 text-sm">{errors.subbackgroundFile}</p>
              )}
            </div>


            {/* Submit */}
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg">
              Create Container
            </button>
          </form>
        </section>

      
        <section className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Existing Containers
          </h3>

          <div className="space-y-4">
            {currentContainers.map((container) => {
              const isOpen = openAccordion === container.id; // your accordion state

              return (
                <div
                  key={container.id}
                  className="border rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Accordion Header */}
                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                    onClick={() =>
                      setOpenAccordion(isOpen ? null : container.id)
                    }
                  >
                    <h4 className="text-lg font-semibold text-gray-800">
                      {container.name}
                    </h4>

                    <span className="text-xl">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Accordion Body */}
                  {isOpen && (
                    <div className="p-4 space-y-4 bg-white">

                      {/* ACTION BUTTONS */}
                      
                        <>
                        <div className="flex flex-wrap items-center gap-4">
                          <a
                            href={`/container/${container.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200"
                          >
                            Open
                          </a>
                          {permission === "editor" && (
                          <>
                            {/* <button
                              onClick={() => openEdit(container)}
                              className="px-4 py-2 rounded-lg bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200"
                            >
                              Edit
                            </button> */}

                            <button
                              onClick={() => {
                                setConfirmAction("edit");
                                setConfirmContainer(container);
                                setConfirmInput("");
                                setConfirmPopup(true);
                              }}
                              className="px-4 py-2 rounded-lg bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200"
                            >
                              Edit
                            </button>




                            {/* <button
                              onClick={() => deleteContainer(container.id)}
                              className="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200"
                            >
                              Delete
                            </button> */}

                            <button
                              onClick={() => {
                                setConfirmAction("delete");
                                setConfirmContainer(container);
                                setConfirmInput("");
                                setConfirmPopup(true);
                              }}
                              className="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200"
                            >
                              Delete
                            </button>







                          </>
                          )}
                        </div>
                        
                        {/* ASSIGN SCREENS */}
                        {permission === "editor" && (
                          <div>
                            <p className="text-gray-700 font-medium mb-2">
                              Assign / Unassign Screens:
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {screens.map((s) => {
                                const assigned = container.screens?.some(
                                  (sc) => sc.id === s.id
                                );

                                return (
                                  <button
                                    key={s.id}
                                    onClick={() =>
                                      assigned
                                        ? unassignScreenFromContainer(container.id, s.id)
                                        : assignScreenToContainer(container.id, s.id)
                                    }
                                    className={`px-4 py-2 rounded-lg text-white transition ${
                                      assigned
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-blue-500 hover:bg-blue-600"
                                    }`}
                                  >
                                    {s.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                      

                      {/* ASSIGNED LIST */}
                      <p className="text-sm text-gray-600">
                        <strong>Assigned:</strong>{" "}
                        {container.screens?.length
                          ? container.screens.map((sc) => sc.name).join(" ,   ")
                          : "None"}
                      </p>

                      {permission === "editor" && (
                        <>
                          <p className="text-gray-700 font-medium mt-4">
                            More Screens (Subscreens):
                          </p>
                          {/* <button
                              // onClick={() => deleteContainer(container.id)}
                              className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200"
                            >
                              Upload Backgroud 
                            </button> */}

                          <div className="flex flex-wrap gap-2">
                            {screens.map((s) => {
                              const assigned = container.subscreens?.some(
                                (sc) => sc.id === s.id
                              );

                              return (
                                <button
                                  key={s.id}
                                  onClick={() =>
                                    assigned
                                      ? unassignSubScreenFromContainer(container.id, s.id)
                                      : assignSubScreenToContainer(container.id, s.id)
                                  }
                                  className={`px-4 py-2 rounded-lg text-white transition ${
                                    assigned
                                      ? "bg-red-500 hover:bg-red-600"
                                      : "bg-blue-500 hover:bg-blue-600"
                                  }`}
                                >
                                  {s.name}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Previous
            </button>

            <span className="font-bold text-gray-700">
              Page {currentPage} / {totalPages}
            </span>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </section>


        {false && false && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-lg w-[450px] relative">
              <h3 className="text-xl font-bold mb-4">
                Edit Container: {editingContainer.name}
              </h3>

              <button
                onClick={() => setEditPopup(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
              >
                ✕
              </button>

              <form onSubmit={updateContainer} className="space-y-5">

                {/* Name */}
                <div>
                  <label className="block font-medium mb-1">Container Name</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                {/* Content Type */}
                <div>
                  <label className="block font-medium mb-1">Content Type</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                {/* Card Image */}
                <div>
                  <label className="block font-medium mb-1">Replace Logo Image</label>
                  <input
                    type="file"
                    accept="image/*,video/*, gif/*"
                    onChange={(e) => setEditCardImage(e.target.files[0])}
                    className="w-full border border-dashed px-4 py-3 rounded-lg"
                  />

                  {/* existing card image */}
                  {existingCardImage && !editCardImage && (
                    <div className="mt-2 relative">
                      <img
                        src={existingCardImage}
                        className="w-32 h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => setExistingCardImage(null)}
                        className="absolute -top-2 -right-2 bg-white rounded-full px-2 shadow text-black"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* new preview */}
                  {editCardImage && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(editCardImage)}
                        className="w-32 h-24 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                {/* Background */}
                <div>
                  <label className="block font-medium mb-1">Replace Background</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setEditBackground(e.target.files[0])}
                    className="w-full border border-dashed px-4 py-3 rounded-lg"
                  />

                  {existingBackground && !editBackground && (
                    <div className="mt-2">
                      <img
                        src={existingBackground}
                        className="w-40 h-28 object-cover rounded-lg border"
                      />
                    </div>
                  )}

                  {editBackground && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(editBackground)}
                        className="w-40 h-28 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>




                <div>
                  <label className="block font-medium mb-1">Replace Subscreens Background</label>
                  <input
                    type="file"
                    accept="image/*,video/*, gif/*"
                    onChange={(e) => setSubEditBackground(e.target.files[0])}
                    className="w-full border border-dashed px-4 py-3 rounded-lg"
                  />

                  {subexistingBackground && !subeditBackground && (
                    <div className="mt-2">
                      <img
                        src={subexistingBackground}
                        className="w-40 h-28 object-cover rounded-lg border"
                      />
                    </div>
                  )}

                  {subeditBackground && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(subeditBackground)}
                        className="w-40 h-28 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>












                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full">
                  Update Container
                </button>
              </form>
            </div>
          </div>
        )}

        {editPopup && editingContainer && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-xl p-6 relative">

              {/* Close Button */}
              <button
                onClick={() => setEditPopup(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
              >
                ✕
              </button>

              <h3 className="text-2xl font-semibold mb-5">
                Edit Container: {editingContainer.name}
              </h3>

              {/* Scrollable container */}
              <div className="max-h-[75vh] overflow-y-auto pr-2 space-y-6">

                <form onSubmit={updateContainer} className="space-y-6">

                  {/* Name */}
                  <div>
                    <label className="block font-medium mb-1">Container Name</label>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>

                  {/* Content Type */}
                  <div>
                    <label className="block font-medium mb-1">Content Type</label>
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      className="w-full border rounded-lg px-4 py-2"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>

                  {/* Card Image */}
                  <div>
                    <label className="block font-medium mb-1">Replace Logo Image</label>

                    <input
                      type="file"
                      accept="image/*,video/*,gif/*"
                      onChange={(e) => setEditCardImage(e.target.files[0])}
                      className="w-full border border-dashed px-4 py-3 rounded-lg"
                    />

                    {/* Existing Preview */}
                    {existingCardImage && !editCardImage && (
                      <div className="mt-3 relative inline-block">
                        <img
                          src={existingCardImage}
                          className="w-32 h-24 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => setExistingCardImage(null)}
                          type="button"
                          className="absolute -top-2 -right-2 bg-white shadow p-1 rounded-full"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* New Preview */}
                    {editCardImage && (
                      <div className="mt-3 inline-block">
                        <img
                          src={URL.createObjectURL(editCardImage)}
                          className="w-32 h-24 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  {/* Background */}
                  <div>
                    <label className="block font-medium mb-1">Replace Background</label>

                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setEditBackground(e.target.files[0])}
                      className="w-full border border-dashed px-4 py-3 rounded-lg"
                    />

                    {existingBackground && !editBackground && (
                      <div className="mt-3">
                        <img
                          src={existingBackground}
                          className="w-40 h-28 object-cover rounded-lg border"
                        />
                      </div>
                    )}

                    {editBackground && (
                      <div className="mt-3">
                        <img
                          src={URL.createObjectURL(editBackground)}
                          className="w-40 h-28 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  {/* Subscreen Background */}
                  <div>
                    <label className="block font-medium mb-1">Replace Subscreens Background</label>

                    <input
                      type="file"
                      accept="image/*,video/*,gif/*"
                      onChange={(e) => setSubEditBackground(e.target.files[0])}
                      className="w-full border border-dashed px-4 py-3 rounded-lg"
                    />

                    {subexistingBackground && !subeditBackground && (
                      <div className="mt-3">
                        <img
                          src={subexistingBackground}
                          className="w-40 h-28 object-cover rounded-lg border"
                        />
                      </div>
                    )}

                    {subeditBackground && (
                      <div className="mt-3">
                        <img
                          src={URL.createObjectURL(subeditBackground)}
                          className="w-40 h-28 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg w-full"
                  >
                    Update Container
                  </button>

                </form>
              </div>
            </div>
          </div>
        )}


        {confirmPopup && confirmContainer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">

              <h3 className="text-lg font-bold mb-2 text-red-600">
                Confirm {confirmAction === "delete" ? "Delete" : "Edit"} Container
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                Type the container name <b>"{confirmContainer.name}"</b> to continue.
              </p>

              <input
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="Enter container name"
                className="w-full border rounded-lg px-4 py-2 mb-4"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmPopup(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  disabled={confirmInput !== confirmContainer.name}
                  onClick={() => {
                    if (confirmAction === "delete") {
                      deleteContainer(confirmContainer.id);
                    }

                    if (confirmAction === "edit") {
                      openEdit(confirmContainer);
                    }

                    setConfirmPopup(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-white ${
                    confirmInput === confirmContainer.name
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}





      </div>
    </>
  );
}

export default ScreenContainers;

