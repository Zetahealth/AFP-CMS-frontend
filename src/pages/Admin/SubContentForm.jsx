import React, { useState, useEffect } from "react";
import Api from "../../Api/Api";

export default function SubContentForm({ parentContentId, editing, onSaved }) {


  // console.log("--------------------------editing------",editing , parentContentId , onSaved)


  const permission = sessionStorage.getItem("permission");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subcontents , setSubcontents] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [subImage , setSubImage] = useState(null);
  const [subImage2 , setSubImage2] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [qr, setQr] = useState(null);
  const [fileResetKey, setFileResetKey] = useState(Date.now());

  const [asfBlocks, setAsfBlocks] = useState([
    {
      title: "",
      image: null,
      items: [{ text: "", image: null }]
    }
  ]);

  const [unifromView, setUniformView] = useState(false);





  const addGroup = () => {
    setAsfBlocks(prev => [
      ...prev,
      { title: "", image: null, items: [{ text: "", image: null }] }
    ]);
  };

  const addItem = (gIndex) => {
    setAsfBlocks(prev =>
      prev.map((group, gi) =>
        gi !== gIndex
          ? group
          : {
              ...group,
              items: [...group.items, { text: "", image: null }]
            }
      )
    );
  };


  const updateGroup = (gIndex, field, value) => {
    const copy = [...asfBlocks];
    copy[gIndex][field] = value;
    setAsfBlocks(copy);
  };

  const updateItem = (gIndex, iIndex, field, value) => {
    const copy = [...asfBlocks];
    copy[gIndex].items[iIndex][field] = value;
    setAsfBlocks(copy);
  };

  const removeItem = (gIndex, iIndex) => {
    setAsfBlocks(prev =>
      prev.map((group, gi) =>
        gi !== gIndex
          ? group
          : {
              ...group,
              items: group.items.filter((_, ii) => ii !== iIndex)
            }
      )
    );
  };

  const removeGroup = (gIndex) => {
    setAsfBlocks(prev => prev.filter((_, i) => i !== gIndex));
  };














  // NEW STATES
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const token = sessionStorage.getItem("authToken");

  // Prefill on edit
  useEffect(() => {
    if (editing) {
      
      setTitle(editing.title || "");
      setDescription(editing.description || "");
      setSubcontents(editing.individual_contents || "")
      setMainImage(null);
      setSubImage(null);
      setSubImage2(null);
      setGalleryImages([]);
    }
  }, [editing]);

  // --------------------------
  // VALIDATION FUNCTION
  // --------------------------
  const validate = () => {
    const err = {};

    if (!title.trim()) err.title = "Title is required";
    if (!description.trim()) err.description = "Description is required";
    if (!description.trim()) err.description = "Description is required";

    if (!parentContentId) err.parent = "Select a content first";

    if (!editing && !mainImage) {
      err.mainImage = "Main Image is required for creating new content";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  // --------------------------
  // SUBMIT HANDLER
  // --------------------------
  const submitSubContent = async (e) => {
    e.preventDefault();

    // if (!validate()) return;

    if (permission !== "editor") {
        alert("❌ You do not have permission to create or edit sub content.");
        return;
    }

    setLoading(true);

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("content_id", parentContentId);
    form.append("individual_contents", subcontents);
    if (subImage) form.append("sub_image", subImage);
    if (subImage2) form.append("sub_image2", subImage2);
    if (mainImage) form.append("main_image", mainImage);

    form.append(
      "asf_data",
      JSON.stringify(
        asfBlocks.map(group => ({
          title: group.title,
          items: group.items.map(i => ({ text: i.text }))
        }))
      )
    );

    asfBlocks.forEach((group, gIndex) => {
      if (group.image) {
        form.append(`asf_group_images[${gIndex}]`, group.image);
      }

      group.items.forEach((item, iIndex) => {
        if (item.image) {
          form.append(`asf_item_images[${gIndex}][${iIndex}]`, item.image);
        }
      });
    });


    if (qr) form.append("qr_code", qr);

    Array.from(galleryImages).forEach((img) =>
      form.append("gallery_images[]", img)
    );

    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `${Api}/api/v1/sub_contents/${editing.id}`
      : `${Api}/api/v1/sub_contents`;

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("Saved!");

      setAsfBlocks([
        {
          title: "",
          image: null,
          items: [{ text: "", image: null }]
        }
      ]);

      // Reset form
      setTitle("");
      setDescription("");
      setSubcontents("")
      setMainImage(null);
      setSubImage(null);
      setSubImage2(null);
      setGalleryImages([]);
      setQr(null);
      setFileResetKey(Date.now());

      onSaved();
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }

    setLoading(false);
  };

  const [editMode, setEditMode] = useState("slide-view");
  const FIELD_CONFIG = {
    
    "thumbnail-gallery": ["title", "files"],
    
    "slide-view": ["title" , "sub content","content", "logo", "files", "sub image"],
    
    "diagonal-split-view": [
      "title",
      "content",
      "hyperlink",
      "logo",
      "files"
    ],

    "card-carousel": ["title","gallery", "sub images"],
    
    "slider-thumbnail-view": ["title", "content", "files", "gallery" , "tittle sub content"],

    "article-view": ["title", "content", "gallery"],

    "weapons-view": ["title", "content", "sub image"],

    "TriBranchShowcaseView": ["title", "content", "files" , "sub image" ,  "background" , "main image"],
    
    "gallary-detail-view": ["title","gallery","main image"],
    "asf": ["title","sub images" , "tittle sub contents" ,"add multiple images" ],
    "elite-groups": ["title", "tittle sub content","content", "main image" ,"background" , "logo image", "logo image2"   ]
  };

  const shouldShow = (field) => FIELD_CONFIG[editMode]?.includes(field);


  return (
    <div className="relative bg-white shadow-md rounded-2xl p-6 mt-8">

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

      <h3 className="text-xl font-bold mb-4">
        {editing ? "Edit Sub Content" : "Create Sub Content"}
      </h3>

      <div className="bg-white shadow-md rounded-2xl p-6 relative">

        {/* VIEW MODE DROPDOWN HERE */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Select View Type</label>
          <select
            value={editMode}
            onChange={(e) => setEditMode(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full"
          >
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
            <option value="elite-groups">Elite Groups</option>

          </select>
        </div>

        <form className="space-y-5" onSubmit={submitSubContent}>
          {/* Title */}

          {shouldShow("title") && (
            <div>
              <label className="font-semibold">Title</label>
              <input
                className="w-full border p-2 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {/* {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title}</p>
              )} */}
            </div>
          )}


          {shouldShow("tittle sub content") && (
            <div>
              <label className="font-semibold"> sub tittle</label>
              <input
                className="w-full border p-2 rounded"
                rows={4}
                value={subcontents}
                onChange={(e) => setSubcontents(e.target.value)}
              />
              {/* {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )} */}
            </div>
          )}


          {shouldShow("tittle sub contents") && (
            <div>
              <label className="font-semibold">Timeline (Optional)</label>
              <input
                className="w-full border p-2 rounded"
                rows={4}
                value={subcontents}
                onChange={(e) => setSubcontents(e.target.value)}
              />
              {/* {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )} */}
            </div>
          )}



          {/* Description */}
          {shouldShow("content") && (
            <div>
              <label className="font-semibold">Main Content</label>
              <textarea
                className="w-full border p-2 rounded"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {/* {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )} */}
            </div>
          )}


          {shouldShow("sub content") && (
            <div>
              <label className="font-semibold">Individual Content</label>
              <textarea
                className="w-full border p-2 rounded"
                rows={4}
                value={subcontents}
                onChange={(e) => setSubcontents(e.target.value)}
              />
              {/* {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )} */}
            </div>
          )}


          {shouldShow("sub images") && (
            <div>
              <label className="font-semibold">Reels/Image</label>
              <input
                key={fileResetKey + "-subimage"}
                type="file"
                onChange={(e) => setSubImage(e.target.files[0])}
                className="w-full border border-dashed px-4 py-3 rounded-lg"
              />
            </div>
          )}




          {shouldShow("sub image") && (
            <div>
              <label className="font-semibold">Individual Images</label>
              <input
                key={fileResetKey + "-subimage"}
                type="file"
                onChange={(e) => setSubImage(e.target.files[0])}
                className="w-full border border-dashed px-4 py-3 rounded-lg"
              />
            </div>
          )}



          {shouldShow("logo image") && (
            <div>
              <label className="font-semibold">Individual Logo</label>
              <input
                key={fileResetKey + "-subimage"}
                type="file"
                onChange={(e) => setSubImage(e.target.files[0])}
                className="w-full border border-dashed px-4 py-3 rounded-lg"
              />
            </div>
          )}


          {shouldShow("logo image2") && (
            <div>
              <label className="font-semibold">Main Logo</label>
              <input
                key={fileResetKey + "-subimage2"}
                type="file"
                onChange={(e) => setSubImage2(e.target.files[0])}
                className="w-full border border-dashed px-4 py-3 rounded-lg"
              />
            </div>
          )}


          {shouldShow("main image") && (
            <div>
              <label className="font-semibold">Main Images</label>
              <input
                key={fileResetKey + "-gallery"}
                type="file"
                multiple
                onChange={(e) => setGalleryImages(e.target.files)}
                className="w-full border border-dashed px-4 py-3 rounded-lg"
              />
            </div>
          )}

          

          {/* Main Image */}
          {shouldShow("background") && (
          
            <div>
              <label className="font-semibold">Background Image</label>
              <input
                key={fileResetKey + "-main"}
                type="file"
                onChange={(e) => setMainImage(e.target.files[0])}
                className="w-full border border-dashed px-4 py-3 rounded-lg"
              />
              {/* {errors.mainImage && (
                <p className="text-red-600 text-sm mt-1">{errors.mainImage}</p>
              )} */}
            </div>
          )}

          



        
          {/* Gallery Images */}
          {shouldShow("gallery") && (
            <div>
              <label className="font-semibold">Gallery Images</label>
              <input
                key={fileResetKey + "-gallery"}
                type="file"
                multiple
                onChange={(e) => setGalleryImages(e.target.files)}
                className="w-full border border-dashed px-4 py-3 rounded-lg"
              />
            </div>
          )}



          {shouldShow("add multiple images") && (
            <div className="mt-6 space-y-6">

              {/* UNIFORM VIEW TOGGLE */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={unifromView}
                  onChange={(e) => setUniformView(e.target.checked)}
                  className="h-4 w-4 accent-blue-600"
                />
                <label className="font-semibold text-gray-800">
                  Enable Uniform View
                </label>
              </div>

              {/* UNIFORM VIEW BLOCKS */}
              {unifromView && (
                <div className="space-y-6">

                  {asfBlocks.map((group, gIndex) => (
                    <div
                      key={gIndex}
                      className="relative rounded-xl border border-gray-300 bg-gray-50 p-5 space-y-4 shadow-sm"
                    >
                      {/* REMOVE GROUP */}
                      {asfBlocks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGroup(gIndex)}
                          className="absolute top-3 right-3 text-red-600 hover:text-red-800 text-sm font-semibold"
                        >
                          ✕
                        </button>
                      )}

                      {/* GROUP TITLE */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Group Title
                        </label>
                        <input
                          placeholder="Enter group title"
                          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={group.title}
                          onChange={(e) =>
                            updateGroup(gIndex, "title", e.target.value)
                          }
                        />
                      </div>

                      {/* GROUP IMAGE */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Group Image
                        </label>
                        <input
                          type="file"
                          className="w-full text-sm"
                          onChange={(e) =>
                            updateGroup(gIndex, "image", e.target.files[0])
                          }
                        />
                      </div>

                      {/* ITEMS */}
                      <div className="space-y-3">
                        <p className="font-semibold text-sm text-gray-700">
                          Items
                        </p>

                        {group.items.map((item, iIndex) => (
                          <div
                            key={iIndex}
                            className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end border rounded-lg p-3 bg-white"
                          >
                            {/* ITEM TEXT */}
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Item Text
                              </label>
                              <input
                                placeholder="Enter item text"
                                className="w-full border rounded-md p-2 text-sm"
                                value={item.text}
                                onChange={(e) =>
                                  updateItem(gIndex, iIndex, "text", e.target.value)
                                }
                              />
                            </div>

                            {/* ITEM IMAGE */}
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Item Image
                              </label>
                              <input
                                type="file"
                                className="w-full text-sm"
                                onChange={(e) =>
                                  updateItem(gIndex, iIndex, "image", e.target.files[0])
                                }
                              />
                            </div>

                            {/* REMOVE ITEM */}
                            {group.items.length > 1 && (
                              <div className="col-span-full text-right">
                                <button
                                  type="button"
                                  onClick={() => removeItem(gIndex, iIndex)}
                                  className="text-red-600 text-xs font-semibold hover:underline"
                                >
                                  Remove Item
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* ADD ITEM (optional) */}
                      {/* 
                      <button
                        type="button"
                        onClick={() => addItem(gIndex)}
                        className="text-blue-600 text-sm font-semibold"
                      >
                        + Add Item
                      </button>
                      */}
                    </div>
                  ))}

                  {/* ADD GROUP */}
                  <button
                    type="button"
                    onClick={addGroup}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold"
                  >
                    + Add Group
                  </button>
                </div>
              )}
            </div>
          )}


          {/* Parent ID error */}
          {/* {errors.parent && (
            <p className="text-red-600 text-sm mt-1">{errors.parent}</p>
          )} */}

          <button
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:bg-blue-300"
          >
            {editing ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
