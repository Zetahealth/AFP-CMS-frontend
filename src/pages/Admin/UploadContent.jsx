import React, { useState , useEffect} from "react";
import Api from "../../Api/Api";
import SubContentForm from "./SubContentForm"

import RichTextEditor from "../Components/RichTextEditor.jsx";
function UploadContent() {
  const [title, setTitle] = useState("");
  const [dob, setDob] = useState("");
  const permission = sessionStorage.getItem("permission");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("image");
  const [file, setFile] = useState(null);

  const [background , setBackground] = useState()
  const [position, setPosition] = useState("Center");
  const [hyperlink, setHyperlink] = useState("");
  const [transitionEffect, setTransitionEffect] = useState("fade");
  const [loading, setLoading] = useState(false); // ✅ loader state
  const [errors, setErrors] = useState({});
  const [logo, setLogo] = useState(null);


  const [editMode, setEditMode] = useState("slide-view");


  const [editModeType, setEditModeType] = useState("overview");


  const token = sessionStorage.getItem("authToken");

  const [allContents, setAllContents] = useState([]);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [subContents, setSubContents] = useState([]);
  const [editingSubContent, setEditingSubContent] = useState(null);

  // Load all contents
  useEffect(() => {
    fetch(`${Api}/api/v1/contents`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setAllContents);
  }, []);

  // Load sub-contents for selected content
  useEffect(() => {
    if (!selectedContentId) return;

    fetch(`${Api}/api/v1/sub_contents?content_id=${selectedContentId}`)
      .then(res => res.json())
      .then(setSubContents);
  }, [selectedContentId]);


  async function upload(e) {
    console.log("---------------")
    e.preventDefault();
    setLoading(true);

    if (permission !== "editor") {
        alert("❌ You do not have permission to create content.");
        setLoading(false);
        return;
    }



    let validationErrors = {};

    // Title required
    // if (!title.trim()) validationErrors.title = "Title is required";

    // Content type required
    // if (!contentType) validationErrors.contentType = "Content type is required";

    // Optional Logo Validation
    // if (logo && logo.length > 0) {
    //   Array.from(logo).forEach((lg) => {
    //     if (!lg.type.startsWith("image/")) {
    //       validationErrors.logo = "Logo must be an image file";
    //     }
    //     if (lg.size > 5 * 1024 * 1024) {
    //       validationErrors.logo = "Logo must be under 5MB";
    //     }
    //   });
    // }

    // if (background && background.length > 0) {
    //   Array.from(background).forEach((lg) => {
    //     if (!lg.type.startsWith("image/")) {
    //       validationErrors.background = "background must be an image file";
    //     }
    //     if (lg.size > 5 * 1024 * 1024) {
    //       validationErrors.background = "background must be under 5MB";
    //     }
    //   });
    // }




    // File required
    // if (!file || file.length === 0) {
    //   validationErrors.file = "You must upload one file";
    // } else {
    //   // Validate each file
    //   Array.from(file).forEach((f) => {
    //     if (f.size > 100 * 1024 * 1024) {
    //       validationErrors.file = "Each file must be under 100 MB";
    //     }
    //     if (contentType === "image" && !f.type.startsWith("image/")) {
    //       validationErrors.file = "Selected content type is Image but file is not an image";
    //     }
    //     if (contentType === "video" && !f.type.startsWith("video/")) {
    //       validationErrors.file = "Selected content type is Video but file is not a video";
    //     }
    //   });
    // }


    // URL format validation
    // if (hyperlink && !/^https?:\/\/\S+$/.test(hyperlink)) {
    //   validationErrors.hyperlink = "Enter a valid URL starting with http:// or https://";
    // }

    // Show errors and stop
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   setLoading(false);
    //   return;
    // }

    setErrors({}); // Clear errors if all good

    try {
      const form = new FormData();
      form.append("title", title);
      form.append("content", content);
      form.append("content_type", contentType);
      form.append("position", position);
      form.append("hyperlink", hyperlink);
      form.append("transition_effect", transitionEffect);
      form.append("dob", dob);
      form.append("display_mode", editMode);
      form.append("view_mode", editModeType)


      if (logo && logo.length > 0) {
        Array.from(logo).forEach((lg) => form.append("logo", lg));
      }

      if (background && background.length > 0) {
        Array.from(background).forEach((lg) => form.append("background", lg));
      }

      if (file && file.length > 0) {
        Array.from(file).forEach((f) => form.append("files", f));
      }
      


      const res = await fetch(`${Api}/api/v1/contents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("✅ Content uploaded successfully!");
      window.location.reload();
      // Reset fields
      setTitle("");
      setDob("");
      setContent("");
      setFile(null);
      setBackground(null);
      setPosition("Center");
      setHyperlink("");
      setTransitionEffect("fade");
      setLogo(null);
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed! Check console.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteSubContent(id) {
    if (!window.confirm("Delete this sub-content?")) return;

    await fetch(`${Api}/api/v1/sub_contents/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    setSubContents((prev) => prev.filter((s) => s.id !== id));
  }

  const FIELD_CONFIG = {
    "normal-view": ["title", "content", "contentType", "position", "hyperlink", "transition", "logo", "files"],
    
    "thumbnail-gallery": ["title", "content","files"],
    
    "slide-view": ["title", "content", "files","background contant" , "hyperlink"],
    
    "diagonal-split-view": [
      "title",
      "content",
      "hyperlink",
      "logo",
      "files",
      "background contant"
    ],

    "card-carousel": ["title", "content", "files", "hyperlink","background contant"],
    
    "slider-thumbnail-view": ["title", "files", "background contant" , "hyperlink" , "dob", "logo"],

    "article-view": ["title", "content", "hyperlink" , "background contant" ],

    "weapons-view": ["title", "content", "files", "hyperlink"],

    "TriBranchShowcaseView": ["title", "content", "files" , "logo" ],
    "gallary-detail-view": ["title", "content", "files","background contant" , "hyperlink"],
    "asf": ["type"],
    "elite-groups": ["title", "content", "files","background contant" , "hyperlink" , "logo"]
    
  };


  const FIELD_CONFIGS = {

    "overview": ["titles", "contents"],
    
    "history": ["titles", "contents" , "hyperlinks"],
    
    "visual-reels": ["titles" ],

    "uniforms": ["titles"],
  
  };


  const shouldShow = (field) => FIELD_CONFIG[editMode]?.includes(field);

  const shouldShows = (field) => FIELD_CONFIGS[editModeType]?.includes(field);


  return (
    <>
    <div className="bg-white shadow-md rounded-2xl p-6 relative">
      {/* Loader Overlay */}
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

      <h3 className="text-2xl font-semibold mb-4 text-gray-700">Upload Content</h3>

    <div className="bg-white shadow-md rounded-2xl p-6 relative">

      {/* VIEW MODE DROPDOWN HERE */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Select View Type</label>
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
          <option value="TriBranchShowcaseView">Tribranch Showcase View</option>
          <option value="gallary-detail-view">GallaryDetailView</option>
          <option value="asf">Know Your APF</option>
          <option value="elite-groups">ELITE GROUPS</option>
        </select>
      </div>


      {shouldShow("type") && (
        <div className="mb-4">
          <label className="block font-medium mb-1">Type</label>
          <select
            value={editModeType}
            onChange={(e) => setEditModeType(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full"
          >
            <option value="overview">AFP OVERVIEW</option>
            <option value="history">BRIEF HISTORY</option>
            <option value="visual-reels">VISUAL REELS</option>
            <option value="uniforms">UNIFORMS</option>
          </select>
        </div>
      )}


      <form onSubmit={upload} className="space-y-4">

          {/* Title */}
          {shouldShow("title") && (
            <div>
              <label className="block font-medium mb-1">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          )}

          {editMode === "asf" && shouldShows("titles") && (
            <div>
              <label className="block font-medium mb-1">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          )}

          {shouldShow("dob") && (
            <div>
              <label className="block font-medium mb-1">Period</label>
              <input
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          )}

          {/* Content */}
          {/* {shouldShow("content") && (
            <div>
              <label className="block font-medium mb-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 h-32"
              />
            </div>
          )} */}

          {/* {shouldShow("content") && (
            <div>
              <label className="block font-medium mb-1">Content</label>

              <Editor
                apiKey="no-api-key" 
                value={content}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: "lists link image table",
                  toolbar:
                    "undo redo | bold italic underline | bullist numlist | link image | table",
                }}
                onEditorChange={(newValue) => setContent(newValue)}
              />
            </div>
          )} */}

          {shouldShow("content") && (
            <div>
              <label className="block font-medium mb-1">Content</label>
              <RichTextEditor content={content} setContent={setContent} />
            </div>
          )}

          {editMode === "asf" && shouldShows("contents") && (
            <div>
              <label className="block font-medium mb-1">Over View Content</label>

              {/* <RichTextEditor content={content} setContent={setContent} /> */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 h-32"
              />
            </div>

          )}

          {/* Content Type */}
          {shouldShow("contentType") && (
            <div>
              <label className="block font-medium mb-1">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
          )}

          {/* Position */}
          {shouldShow("position") && (
            <div>
              <label className="block font-medium mb-1">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="Top-Left">Top-Left</option>
                <option value="Top-Right">Top-Right</option>
                <option value="Bottom-Left">Bottom-Left</option>
                <option value="Bottom-Right">Bottom-Right</option>
                <option value="Center">Center</option>
              </select>
            </div>
          )}

          {/* Hyperlink */}
          {shouldShow("hyperlink") && (
            <div>
              <label className="block font-medium mb-1">External Link (for QR)</label>
              <input
                type="url"
                value={hyperlink}
                onChange={(e) => setHyperlink(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          )}


          {/* Hyperlink */}
          {editMode === "asf" && shouldShows("hyperlinks") && (
            <div>
              <label className="block font-medium mb-1">External Link (for QR)</label>
              <input
                type="url"
                value={hyperlink}
                onChange={(e) => setHyperlink(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          )}


          {/* Transition */}
          {shouldShow("transition") && (
            <div>
              <label className="block font-medium mb-1">Transition Effect</label>
              <select
                value={transitionEffect}
                onChange={(e) => setTransitionEffect(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="fade">Fade</option>
                <option value="zoom">Zoom</option>
                <option value="slide-left">Slide Left</option>
                <option value="slide-right">Slide Right</option>
                <option value="slide-up">Slide Up</option>
              </select>
            </div>
          )}

          {/* Logo */}
          {shouldShow("logo") && (
            <div>
              <label className="block font-medium mb-1">Upload Logo</label>
              <input
                type="file"
                onChange={(e) => setLogo(e.target.files)}
                className="w-full border border-dashed px-4 py-3 rounded-lg"
              />
            </div>
          )}

          {/* Files */}
          {shouldShow("files") && (
            <div>
              <label className="block font-medium mb-1">Upload Files (Card)</label>
              <input
                type="file"
                multiple
                onChange={(e) => setFile(e.target.files)}
                className="w-full border border-dashed px-4 py-3 rounded-lg"
              />
            </div>
          )}

          {shouldShow("background contant") && (
            <div>
              <label className="block font-medium mb-1">Upload Background</label>
              <input
                type="file"
                multiple
                onChange={(e) => setBackground(e.target.files)}
                className="w-full border border-dashed px-4 py-3 rounded-lg"
              />
            </div>
          )}



        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>

    </div>
    {/* SELECT CONTENT DROPDOWN */}
    <div className="bg-white shadow-md rounded-2xl p-6 mt-10">
      <h3 className="text-xl font-semibold mb-3">Select Content to Manage Sub-Contents</h3>

      <select
        className="border px-4 py-2 rounded w-full"
        value={selectedContentId || ""}
        onChange={(e) => setSelectedContentId(e.target.value)}
      >
        <option value="">-- Select Content --</option>
        {allContents.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>
    </div>
    {selectedContentId && (
      <div className="bg-white shadow-md rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-semibold mb-3">Sub-Contents</h3>

        {subContents.length === 0 ? (
          <p className="text-gray-500">No sub-contents yet.</p>
        ) : (
          <ul className="space-y-4">
            {subContents.map((sub) => (
              <li
                key={sub.id}
                className="p-4 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{sub.title}</p>
                  <p className="text-gray-600 text-sm">{sub.description?.slice(0, 50)}...</p>
                </div>

                {permission === "editor" && (
                <div className="flex gap-3">
                  <button
                    className="bg-yellow-500 text-white px-4 py-1 rounded"
                    onClick={() => setEditingSubContent(sub)}
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded"
                    onClick={() => deleteSubContent(sub.id)}
                  >
                    Delete
                  </button>
                </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    )}


    
    <SubContentForm
      parentContentId={selectedContentId}
      editing={editingSubContent}
      onSaved={() => {
        setEditingSubContent(null);
        // reload sub contents
        fetch(`${Api}/api/v1/sub_contents?content_id=${selectedContentId}`)
          .then(res => res.json())
          .then(setSubContents);
      }}
    />



    </>
  );
}

export default UploadContent;
