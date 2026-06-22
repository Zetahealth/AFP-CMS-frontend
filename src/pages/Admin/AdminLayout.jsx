// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Sidebar from "../Sidebar";
// import UploadContent from "./UploadContent";
// import Screens from "./Screens";
// import ScreenContainers from "./ScreenContainers";
// import Contents from "./Contents";

// function AdminDashboard() {
//   return (
//     <div className="flex min-h-screen bg-gray-50 text-gray-800">
//       <Sidebar />
//       <div className="flex-1 p-8 overflow-y-auto">
//         <Routes>
//           <Route path="screens" element={<Screens />} />
//           <Route path="upload-content" element={<UploadContent />} />
//           <Route path="screen-containers" element={<ScreenContainers />} />
//           <Route path="contents" element={<Contents />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;


// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Screens from "../pages/Admin/Screens";
// import UploadContent from "../pages/Admin/Screens/UploadContent";
// import ScreenContainers from "../pages/Admin/ScreenContainers";
// import Contents from "../pages/Admin/Contents";





import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./../Sidebar";
import UploadContent from "./UploadContent";
import Screens from "./Screens";
import ScreenContainers from "./ScreenContainers";
import Contents from "./Contents";
import Logs from "./Logs";

function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Routes>
          <Route path="screens" element={<Screens />} />
          <Route path="upload-content" element={<UploadContent />} />
          <Route path="screen-containers" element={<ScreenContainers />} />
          <Route path="contents" element={<Contents />} />
          <Route path="logs" element={<Logs />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminLayout;

