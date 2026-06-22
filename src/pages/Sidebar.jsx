// import React from "react";
// import { NavLink } from "react-router-dom";
// import logo from "../../public/logo4.jpg";


// const links = [
//   { name: "Screens", path: "/admin/screens" },
//   { name: "Upload Content", path: "/admin/upload-content" },
//   { name: "Screen Containers", path: "/admin/screen-containers" },
//   { name: "Contents", path: "/admin/contents" },
// ];

// function Sidebar() {
//   return (
//     // <div className="w-64 bg-white shadow-lg p-6 border-r min-h-screen">
//     //   <h2 className="text-2xl font-bold text-blue-700 mb-8">Admin Dashboard</h2>
//     //   <nav className="space-y-3">
//     //     {links.map((link) => (
//     //       <NavLink
//     //         key={link.path}
//     //         to={link.path}
//     //         className={({ isActive }) =>
//     //           `block px-4 py-2 rounded-lg font-medium transition ${
//     //             isActive
//     //               ? "bg-blue-600 text-white"
//     //               : "hover:bg-gray-100 text-gray-700"
//     //           }`
//     //         }
//     //       >
//     //         {link.name}
//     //       </NavLink>
//     //     ))}
//     //   </nav>
//     // </div>
//       <div className="w-64 bg-white shadow-lg p-6 border-r min-h-screen flex flex-col">
//         {/* --- Logo Section --- */}
//         <div className="flex flex-col items-center mb-6">
//           <img
//             src={logo}
//             alt="App Logo"
//             className="h-28 w-auto object-contain mb-3"
//           />
//           {/* <h2 className="text-2xl font-bold text-blue-700">Admin Dashboard</h2> */}
//         </div>

//         {/* --- Navigation Links --- */}
//         <nav className="space-y-3 mt-4">
//           {links.map((link) => (
//             <NavLink
//               key={link.path}
//               to={link.path}
//               className={({ isActive }) =>
//                 `block px-4 py-2 rounded-lg font-medium transition ${
//                   isActive
//                     ? "bg-blue-600 text-white"
//                     : "hover:bg-gray-100 text-gray-700"
//                 }`
//               }
//             >
//               {link.name}
//             </NavLink>
//           ))}
//         </nav>
//       </div>
//   );
// }

// export default Sidebar;
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../public/logo4.jpg";

// const links = [
//   { name: "Screens", path: "/admin/screens" },
//   { name: "Upload Content", path: "/admin/upload-content" },
//   { name: "Screen Containers", path: "/admin/screen-containers" },
//   { name: "Contents", path: "/admin/contents" },
//   { name: "Logs", path: "/admin/logs" },
// ];

const links = [
  { name: "Screens", path: "/admin/screens", roles: ["admin", "user"] },
  { name: "Upload Content", path: "/admin/upload-content", roles: ["admin", "user"] },
  { name: "Screen Containers", path: "/admin/screen-containers", roles: ["admin", "user"] },
  { name: "Contents", path: "/admin/contents", roles: ["admin", "user"] },
  { name: "Logs", path: "/admin/logs", roles: ["admin"] }, // 👈 admin only
];





// function Sidebar() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Example logout logic
//     sessionStorage.removeItem("authToken"); // clear token or session
//     sessionStorage.removeItem("role"); 
//     navigate("/login"); // redirect to login page
//   };

//   return (
//     <div className="w-64 bg-white shadow-lg p-6 border-r min-h-screen flex flex-col justify-between">
//       {/* --- Top Section --- */}
//       <div>
//         {/* Logo Section */}
//         <div className="flex flex-col items-center mb-6">
//           <img
//             src={logo}
//             alt="App Logo"
//             className="h-28 w-auto object-contain mb-3"
//           />
//         </div>

//         {/* Navigation Links */}
//         <nav className="space-y-3 mt-4">
//           {links.map((link) => (
//             <NavLink
//               key={link.path}
//               to={link.path}
//               className={({ isActive }) =>
//                 `block px-4 py-2 rounded-lg font-medium transition ${
//                   isActive
//                     ? "bg-blue-600 text-white"
//                     : "hover:bg-gray-100 text-gray-700"
//                 }`
//               }
//             >
//               {link.name}
//             </NavLink>
//           ))}
//         </nav>
//       </div>

//       {/* --- Bottom Section (Logout) --- */}
//       <button
//         onClick={handleLogout}
//         className="mt-8 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }

function Sidebar() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role"); // e.g. "admin"

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white shadow-lg p-6 border-r min-h-screen flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="App Logo" className="h-28 w-auto mb-3" />
        </div>

        <nav className="space-y-3 mt-4">
          {links
            .filter(link => link.roles.includes(role)) // 👈 role check
            .map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-8 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
      >
        Logout
      </button>
    </div>
  );
}



export default Sidebar;





