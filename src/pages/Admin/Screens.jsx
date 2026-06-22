import React, { useState, useEffect } from "react";
import Api from "../../Api/Api";

function Screens() {
    const [screens, setScreens] = useState([]);
  const [contents, setContents] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [contant, setContant] = useState("");
  const [contentType, setContentType] = useState("image");
  const token = sessionStorage.getItem("authToken");
  const role = sessionStorage.getItem("role");
  const permission = sessionStorage.getItem("permission");
  const [screenName, setScreenName] = useState("");
  const [assignments, setAssignments] = useState({}); // {screenId: [contents]}
  const [displayMode, setDisplayMode] = useState("normal-view");


    const [showPopup, setShowPopup] = useState(false);

    const [editPopup, setEditPopup] = useState(false);
    const [editScreen, setEditScreen] = useState(null);

    const [editName, setEditName] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editMode, setEditMode] = useState("normal-view");
    const [editCardImage, setEditCardImage] = useState(null);


    const [selectedScreen, setSelectedScreen] = useState(null);
    const [backgroundFile, setBackgroundFile] = useState(null);


    const [containers, setContainers] = useState([]);
    const [containerName, setContainerName] = useState("");

    const [screenTitle, setScreenTitle] = useState("");
    const [cardImage, setCardImage] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // YOU CAN CHANGE → 5 per page

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentScreens = screens.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(screens.length / itemsPerPage);

    const [errors, setErrors] = useState({});

  const [confirmPopup, setConfirmPopup] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // "delete" | "edit"
  const [confirmInput, setConfirmInput] = useState("");
  const [confirmContainer, setConfirmContainer] = useState(null);





    useEffect(() => {
        fetchScreens();
        fetchContents();
        fetchAssignments();
        fetchContainers();
    }, []);

    async function fetchScreens() {
        try {
            const res = await fetch(`${Api}/api/v1/screens`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error(`Failed to fetch screens: ${res.status}`);
            const data = await res.json();
            setScreens(data);
        } catch (err) {
            console.error("❌ Error fetching screens:", err);
        }
    }

    // Fetch assignments
    async function fetchAssignments() {
        try {
            const res = await fetch(`${Api}/api/v1/assignments`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (!res.ok) throw new Error(`Failed to fetch assignments: ${res.status}`);
            const data = await res.json();
            console.log(data)
            // Convert to {screenId: [contents]} with content_id included
            const map = {};

            data.forEach(a => {
                if (!map[a.screen_id]) map[a.screen_id] = [];

                // Push an object that includes content info + content_id
                map[a.screen_id].push({
                    ...a.content,       // all content fields
                    content_id: a.content_id, // add content_id
                    screen_id: a.screen_id,
                    assignment_id: a.id // optional: assignment id if you want
                });
            });

            console.log(map);
            setAssignments(map);
        } catch (err) {
            console.error(err);
        }
    }

    async function updateScreen(e) {
        e.preventDefault();

        let validation = {};

        if (!editName.trim()) validation.name = "Screen name is required";
        // if (!editTitle.trim()) validation.title = "Screen title is required";
        if (!editMode) validation.mode = "Select a display mode";

        if (editCardImage && editCardImage.size > 100 * 1024 * 1024) {
            validation.cardImage = "Image must be under 100MB";
        }

        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }

        try {
            const form = new FormData();
            form.append("name", editName);
            form.append("title", editTitle);
            form.append("display_mode", editMode);

            if (editCardImage) {
                form.append("card_image", editCardImage);
            }

            const res = await fetch(`${Api}/api/v1/screens/${editScreen.id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: form,
            });

            if (!res.ok) throw new Error("Update failed");

            alert("✅ Screen updated!");
            setEditPopup(false);
            fetchScreens();
        } catch (err) {
            console.error(err);
            alert("❌ Could not update screen");
        }
    }




    // async function createScreen(e) {
    //     e.preventDefault();

    //     try {
    //         const formData = new FormData();
    //         formData.append("name", screenName);
    //         formData.append("title", screenTitle);
    //         formData.append("display_mode", displayMode);

    //         if (cardImage) {
    //           formData.append("card_image", cardImage);
    //         }

    //         const res = await fetch(`${Api}/api/v1/screens`, {
    //         method: "POST",
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //         body: formData,
    //         });

    //         if (!res.ok) throw new Error(`Screen creation failed: ${res.status}`);

    //         alert("✅ Screen created successfully!");

    //         setScreenName("");
    //         setScreenTitle("");
    //         setCardImage(null);

    //         fetchScreens();
    //     } catch (err) {
    //         console.error("❌ Error creating screen:", err);
    //     }
    // }

    async function createScreen(e) {
        e.preventDefault();

        if (permission !== "editor") {
            alert("❌ You do not have permission to create screens.");
            return;
        }

        let validationErrors = {};

        // Name validation
        if (!screenName.trim()) {
            validationErrors.screenName = "Screen name is required";
        }

        // Title validation
        // if (!screenTitle.trim()) {
        //     validationErrors.screenTitle = "Screen title is required";
        // }

        // Display mode validation
        if (!displayMode) {
            validationErrors.displayMode = "Please select a display mode";
        }

        // File validation
        if (!cardImage) {
            validationErrors.cardImage = "Card image is required";
        } else if (cardImage.size > 100 * 1024 * 1024) {
            // 100 MB
            validationErrors.cardImage = "File size must be under 100 MB";
        }

        // If errors → show and stop submit
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // If no errors clear old errors
        setErrors({});

        try {
            const formData = new FormData();
            formData.append("name", screenName);
            formData.append("title", screenTitle);
            formData.append("display_mode", displayMode);
            formData.append("card_image", cardImage);

            const res = await fetch(`${Api}/api/v1/screens`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) throw new Error(`Screen creation failed`);

            alert("✅ Screen created successfully!");

            setScreenName("");
            setScreenTitle("");
            setCardImage(null);

            fetchScreens();
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchContents() {
        try {
            const res = await fetch(`${Api}/api/v1/contents`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error(`Failed to fetch contents: ${res.status}`);
            const data = await res.json();
            setContents(data);
        } catch (err) {
            console.error("❌ Error fetching contents:", err);
        }
    }

    async function upload(e) {
        e.preventDefault();

        try {
            const form = new FormData();
            form.append("title", title);
            form.append("content", contant);
            form.append("content_type", contentType);

            if (file) for (const f of file) form.append("files[]", f);

            const res = await fetch(`${Api}/api/v1/contents`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: form,
            });

            if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
            await fetchContents(); // refresh after upload
        } catch (err) {
            console.error("❌ Error uploading content:", err);
        }
    }

    async function assign(screenId, contentId) {
        console.log("--------------------------asssign----------------")
        try {
            const res = await fetch(`${Api}/api/v1/assignments`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    screen_id: screenId,
                    content_id: contentId,
                }),
            });

            if (!res.ok) throw new Error(`Assignment failed: ${res.status}`);
            alert("✅ Assigned!");
            fetchAssignments();
            fetchContents();
        } catch (err) {
            console.error("❌ Error assigning content:", err);
        }
    }
    // async function deleteScreen(screenId) {
    //     if(!window.confirm("Are you sure to delete screen?")) return;
    //     await fetch(`${Api}/api/v1/screens/${screenId}`, { method: "DELETE", headers: {"Authorization": `Bearer ${token}`} });
    //     fetchScreens();
    // }

    async function deleteScreen(screenId) {
        if (!window.confirm("Are you sure you want to delete this screen? (Note: please remove the screen from the container if it is assigned.)")) return;
        await fetch(`${Api}/api/v1/screens/${screenId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        fetchScreens();
    }


    async function uploadBackground(e) {
        e.preventDefault();
        if (!backgroundFile) return alert("Please select a file");

        const formData = new FormData();
        formData.append("background", backgroundFile);

        const res = await fetch(`${Api}/api/v1/screens/${selectedScreen.id}/upload_background`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!res.ok) {
            alert("❌ Upload failed");
            return;
        }

        alert("✅ Background uploaded successfully!");
        setShowPopup(false);
        setBackgroundFile(null);
        fetchScreens(); // Refresh list
    }


    async function fetchContainers() {
        const res = await fetch(`${Api}/api/v1/screen_containers`, {
            headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await res.json();
        setContainers(data);
    }

    return (
        <div className=" p-6">
            {/* <h3 className="text-2xl font-semibold mb-4 text-gray-700">📺 Screens</h3> */}

            <section className=" shadow-2xl bg-white rounded-2xl p-6 mb-10">
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">
                    Create New Screen
                </h3>

                <form onSubmit={createScreen} className="space-y-5">

                    {/* Screen Name */}
                    <div>
                        <label className="block font-medium mb-1">Screen Name</label>
                        <input
                            value={screenName}
                            onChange={(e) => setScreenName(e.target.value)}
                            placeholder="Enter screen name"
                            className="border rounded-lg px-4 py-2 w-full"
                        />
                        {errors.screenName && (
                            <p className="text-red-500 text-sm mt-1">{errors.screenName}</p>
                        )}
                    </div>

                    {/* Screen Title */}
                    <div>
                        <label className="block font-medium mb-1">Screen Title</label>
                        <input
                            value={screenTitle}
                            onChange={(e) => setScreenTitle(e.target.value)}
                            placeholder="Enter screen title"
                            className="border rounded-lg px-4 py-2 w-full"
                        />
                        {/* {errors.screenTitle && (
                <p className="text-red-500 text-sm mt-1">{errors.screenTitle}</p>
            )} */}
                    </div>

                    {/* Display Mode */}
                    <div>
                        <label className="block font-medium mb-1">Display Mode</label>
                        <select
                            value={displayMode}
                            onChange={(e) => setDisplayMode(e.target.value)}
                            className="border rounded-lg px-4 py-2 w-full"
                        >
                            <option value="">Select Mode</option>
                            <option value="normal-view">Normal View</option>
                            <option value="thumbnail-gallery">Thumbnail Gallery</option>
                            <option value="slide-view">Slide View</option>
                            <option value="diagonal-split-view">Diagonal Split View</option>
                            <option value="card-carousel">Card Carousel</option>
                            <option value="slider-thumbnail-view">Slide With Thumbnail View</option>
                            <option value="article-view">Articles and News Blogs</option>
                            <option value="weapons-view">Weapons View</option>
                            <option value="TriBranchShowcaseView">Tribranch Showcase View (ARTILLERIES)</option>
                            <option value="gallary-detail-view">Gallary Detail View</option>
                            <option value="asf">Know Your APF</option>
                            <option value="elite-groups">Elite Groups</option>

                        </select>
                        {errors.displayMode && (
                            <p className="text-red-500 text-sm mt-1">{errors.displayMode}</p>
                        )}
                    </div>

                    {/* Card Image Upload */}
                    <div>
                        <label className="block font-medium mb-1">Card Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCardImage(e.target.files[0])}
                            className="block w-full border border-dashed border-gray-400 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-100"
                        />

                        {errors.cardImage && (
                            <p className="text-red-500 text-sm mt-1">{errors.cardImage}</p>
                        )}

                        {/* Preview */}
                        <div className="mt-2">
                            {cardImage && (
                                <img
                                    src={URL.createObjectURL(cardImage)}
                                    alt="card-preview"
                                    className="w-32 h-24 object-cover rounded-lg border shadow"
                                />
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    >
                        Create Screen
                    </button>
                </form>
            </section>

            <section className=" shadow-2xl bg-white rounded-2xl p-6 mb-10">
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">Availabe Screens</h3>

            {screens.length === 0 ? (
                <p className="text-gray-500">No screens available.</p>
            ) : (
                <>
                <ul className="space-y-2">
                    {currentScreens.map((s) => (
                    <li key={s.id} className="border-b pb-2 mb-2 flex justify-between items-center">
                        <div>
                        <div className="flex gap-4 items-center">
                            <span className="font-medium">{s.name}</span>
                            {/* <a
                            href={`/screen/${s.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                            >
                            Open
                            </a> */}
                        </div>

                                            <div className="mt-2 text-sm text-gray-600">
                                                Assigned Content:
                                                {assignments[s.id]?.length ? (
                                                    assignments[s.id].map(c => (
                                                        <span key={c.id} className="ml-2 px-2 py-1 bg-blue-100 rounded">
                                                            {c.title}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="ml-2">None</span>
                                                )}
                                            </div>

                                            <span className="text-sm italic text-red-500">
                                                {s.display_mode || "normal-view"}
                                            </span>
                                        </div>


                        {permission === "editor" && (
                            <div className="flex gap-2">

                            {/* <button
                                onClick={() => deleteScreen(s.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                            >
                                Delete
                            </button> */}

                            <button
                                onClick={() => {
                                    setConfirmAction("delete");
                                    setConfirmContainer(s);
                                    setConfirmInput("");
                                    setConfirmPopup(true);
                                }}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                                >
                                Delete
                            </button>



                            {/* <button
                            onClick={() => {
                                setEditScreen(s);
                                setEditName(s.name);
                                setEditTitle(s.title);
                                setEditMode(s.display_mode);
                                setEditPopup(true);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition duration-200"
                            >
                                Edit
                            </button> */}


                            <button
                            onClick={() => {
                                setEditScreen(s);
                                setEditName(s.name);
                                setEditTitle(s.title);
                                setEditMode(s.display_mode);
                                
                                setConfirmAction("edit");
                                setConfirmContainer(s);
                                setConfirmInput("");
                                setConfirmPopup(true);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition duration-200"
                            >
                            Edit
                            </button>





                            <button
                                onClick={() => {
                                setSelectedScreen(s);
                                setShowPopup(true);
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Upload Background
                            </button>
                            </div>
                        )}
                    </li>
                    ))}
                </ul>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-3 mt-5">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className={`px-4 py-2 rounded-lg shadow 
                        ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}
                    `}
                            >
                                Prev
                            </button>

                            <div className="flex gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3 py-1 rounded-md border 
                            ${currentPage === pageNum ? "bg-blue-600 text-white" : "bg-white text-gray-700"}
                        `}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className={`px-4 py-2 rounded-lg shadow 
                        ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}
                    `}
                            >
                                Next
                            </button>
                        </div>

                    </>
                )}
            </section>

            {editPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-lg w-96 relative">
                        <h3 className="text-xl font-bold mb-4">
                            Edit Screen: {editScreen?.name}
                        </h3>

                        <form onSubmit={updateScreen} className="space-y-5">

                            {/* Edit Name */}
                            <div>
                                <label className="block font-medium mb-1">Screen Name</label>
                                <input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="border rounded-lg px-4 py-2 w-full"
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>

                            {/* Edit Title */}
                            <div>
                                <label className="block font-medium mb-1">Screen Title</label>
                                <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="border rounded-lg px-4 py-2 w-full"
                                />
                                {/* {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>} */}
                            </div>

                            {/* Display Mode */}
                            <div>
                                <label className="block font-medium mb-1">Display Mode</label>
                                <select
                                    value={editMode}
                                    onChange={(e) => setEditMode(e.target.value)}
                                    className="border rounded-lg px-4 py-2 w-full"
                                >
                                    <option value="normal-view">Normal View</option>
                                    <option value="thumbnail-gallery">Thumbnail Gallery</option>
                                    <option value="slide-view">Slide View</option>
                                    <option value="diagonal-split-view">Diagonal Split View</option>
                                    <option value="card-carousel">Card Carousel</option>
                                    <option value="slider-thumbnail-view">Slide With Thumbnail View</option>
                                    <option value="article-view">Articles and News Blogs</option>
                                    <option value="weapons-view">Weapons View</option>
                                    <option value="TriBranchShowcaseView">Tribranch Showcase View (ARTILLERIES)</option>
                                    <option value="gallary-detail-view">Gallary Detail View</option>
                                    <option value="asf">Know Your APF</option>



                                </select>
                                {errors.mode && (
                                    <p className="text-red-500 text-sm">{errors.mode}</p>
                                )}
                            </div>

                            {/* Edit Card Image */}
                            <div>
                                <label className="block font-medium mb-1">Card Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditCardImage(e.target.files[0])}
                                    className="block w-full border border-dashed border-gray-400 rounded-lg px-4 py-3"
                                />

                                {errors.cardImage && (
                                    <p className="text-red-500 text-sm">{errors.cardImage}</p>
                                )}

                                <div className="mt-2">
                                    {editCardImage ? (
                                        <img
                                            src={URL.createObjectURL(editCardImage)}
                                            className="w-32 h-24 rounded-lg border object-cover"
                                        />
                                    ) : editScreen?.card_image_url ? (
                                        <img
                                            src={editScreen.card_image_url}
                                            className="w-32 h-24 rounded-lg border object-cover"
                                        />
                                    ) : null}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Update Screen
                            </button>
                        </form>

                        <button
                            onClick={() => setEditPopup(false)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
                        >
                            ✕
                        </button>
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
                            // deleteContainer(confirmContainer.id);
                                deleteScreen(confirmContainer.id)
                            }

                            if (confirmAction === "edit") {
                                setEditPopup(true);
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

            {/* ✅ Popup Modal */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-lg w-96 relative">
                        <h3 className="text-xl font-bold mb-4">
                            Upload Background for {selectedScreen?.name}
                        </h3>

                        <form onSubmit={uploadBackground} className="space-y-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setBackgroundFile(e.target.files[0])}
                                className="w-full border rounded-lg p-2"
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPopup(false)}
                                    className="bg-gray-300 px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Screens;