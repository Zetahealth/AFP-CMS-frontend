// // import { useState, useEffect } from "react";
// // import Api from "../../Api/Api";

// // export default function Logs() {
// //   const [logs, setLogs] = useState([]);
// //   const token = sessionStorage.getItem("authToken");

// //   async function fetchLogs() {
// //     try {
// //       const res = await fetch(`${Api}/api/v1/logs`, {
// //         headers: {
// //           "Authorization": `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //       });

// //       if (!res.ok) {
// //         throw new Error(`Failed to fetch logs: ${res.status}`);
// //       }

// //       const data = await res.json();
// //       console.log("✅ Logs fetched:-------", data);
// //       setLogs(data);
// //     } catch (err) {
// //       console.error("❌ Error fetching logs:", err);
// //     }
// //   }

// //   useEffect(() => {
// //     fetchLogs();
// //   }, []);

// //   return (
// //     <div className="p-4">
// //         <section className="bg-white shadow-md rounded-2xl p-6">
// //             <h2 className="text-2xl font-bold mb-4">User Logs</h2>
// //             <div className="overflow-x-auto bg-white shadow-md rounded-2xl p-6 ">
// //                 <table className="min-w-full table-auto border border-gray-300 ">
// //                 <thead className="bg-gray-100">
// //                     <tr>
// //                     <th className="border px-4 py-2 text-left">User Name</th>
// //                     <th className="border px-4 py-2 text-left">Email</th>
// //                     <th className="border px-4 py-2 text-left">Event Type</th>
// //                     <th className="border px-4 py-2 text-left">Details</th>
// //                     <th className="border px-4 py-2 text-left">Date</th>
// //                     </tr>
// //                 </thead>

// //                 <tbody>
// //                     {logs.map((log) => (
// //                     <tr key={log.id} className="hover:bg-gray-50">
// //                         <td className="border px-4 py-2">{log.user?.name || "—"}</td>
// //                         <td className="border px-4 py-2">{log.user?.email || "—"}</td>
// //                         <td className="border px-4 py-2 font-semibold">{log.event_type}</td>
// //                         <td className="border px-4 py-2">{log.details}</td>
// //                         <td className="border px-4 py-2">
// //                         {new Date(log.created_at).toLocaleString()}
// //                         </td>
// //                     </tr>
// //                     ))}
// //                 </tbody>
// //                 </table>
// //             </div>
// //       </section>
// //     </div>
// //   );
// // }
// import { useState, useEffect, useMemo } from "react";
// import Api from "../../Api/Api";

// const TABS = [
//   { label: "All", value: "ALL" },
//   { label: "Screen", value: "SCREEN" },
//   { label: "Content", value: "CONTENT" },
//   { label: "User", value: "USER" },
// ];

// export default function Logs() {
//   const [logs, setLogs] = useState([]);
//   const [search, setSearch] = useState("");
//   const [eventFilter, setEventFilter] = useState("");
//   const [activeTab, setActiveTab] = useState("ALL");

//   const token = sessionStorage.getItem("authToken");

//   const [currentPage, setCurrentPage] = useState(1);
//   const ITEMS_PER_PAGE = 10;




//   async function fetchLogs() {
//     try {
//       const res = await fetch(`${Api}/api/v1/logs`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await res.json();
//       setLogs(data);
//     } catch (err) {
//       console.error("Error fetching logs:", err);
//     }
//   }

//   useEffect(() => {
//     fetchLogs();
//   }, []);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, eventFilter, activeTab]);


//   /* ---------- FILTER LOGIC ---------- */
//   const filteredLogs = useMemo(() => {
//     return logs.filter((log) => {
//       const text =
//         `${log.user?.name} ${log.user?.email} ${log.details}`.toLowerCase();

//       const matchesSearch = text.includes(search.toLowerCase());
//       const matchesEvent =
//         !eventFilter || log.event_type === eventFilter;

//       const matchesTab =
//         activeTab === "ALL" ||
//         log.event_type.startsWith(activeTab);

//       return matchesSearch && matchesEvent && matchesTab;
//     });
//   }, [logs, search, eventFilter, activeTab]);

//   const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

//   const paginatedLogs = useMemo(() => {
//     const start = (currentPage - 1) * ITEMS_PER_PAGE;
//     const end = start + ITEMS_PER_PAGE;
//     return filteredLogs.slice(start, end);
//   }, [filteredLogs, currentPage]);


//   const uniqueEvents = [...new Set(logs.map((l) => l.event_type))];

//   return (
//     <div className="p-6">
//       <section className="bg-white rounded-2xl shadow-md p-6">
//         <h2 className="text-2xl font-bold mb-6">User Activity Logs</h2>

//         {/* 🔍 SEARCH + FILTER */}
//         <div className="flex flex-wrap gap-4 mb-6">
//           <input
//             type="text"
//             placeholder="Search user, email or details..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border rounded-lg px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <select
//             value={eventFilter}
//             onChange={(e) => setEventFilter(e.target.value)}
//             className="border rounded-lg px-4 py-2 focus:outline-none"
//           >
//             <option value="">All Events</option>
//             {uniqueEvents.map((event) => (
//               <option key={event} value={event}>
//                 {event}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* 🗂️ TABS */}
//         <div className="flex gap-3 mb-6 border-b">
//           {TABS.map((tab) => (
//             <button
//               key={tab.value}
//               onClick={() => setActiveTab(tab.value)}
//               className={`px-4 py-2 font-semibold rounded-t-lg ${
//                 activeTab === tab.value
//                   ? "bg-blue-600 text-white"
//                   : "text-gray-600 hover:text-blue-600"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* 📋 TABLE */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full border rounded-lg">
//             <thead className="bg-gray-100 sticky top-0">
//               <tr>
//                 <th className="px-4 py-3 text-left">User</th>
//                 <th className="px-4 py-3 text-left">Email</th>
//                 <th className="px-4 py-3 text-left">Event</th>
//                 <th className="px-4 py-3 text-left">Details</th>
//                 <th className="px-4 py-3 text-left">Date</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredLogs.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan="5"
//                     className="text-center py-6 text-gray-500"
//                   >
//                     No logs found
//                   </td>
//                 </tr>
//               )}

//               {/* {filteredLogs.map((log) => (
//                 <tr
//                   key={log.id}
//                   className="border-t hover:bg-gray-50"
//                 >
//                   <td className="px-4 py-2">
//                     {log.user?.name || "—"}
//                   </td>
//                   <td className="px-4 py-2">
//                     {log.user?.email || "—"}
//                   </td>
//                   <td className="px-4 py-2 font-semibold text-blue-700">
//                     {log.event_type}
//                   </td>
//                   <td className="px-4 py-2">
//                     {log.details}
//                   </td>
//                   <td className="px-4 py-2 text-sm text-gray-600">
//                     {new Date(log.created_at).toLocaleDateString("en-GB", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                     })}
//                   </td>
//                 </tr>
//               ))} */}

//               {paginatedLogs.map((log) => (
//                 <tr key={log.id} className="border-t hover:bg-gray-50">
//                   <td className="px-4 py-2">{log.user?.name || "—"}</td>
//                   <td className="px-4 py-2">{log.user?.email || "—"}</td>
//                   <td className="px-4 py-2 font-semibold text-blue-700">
//                     {log.event_type}
//                   </td>
//                   <td className="px-4 py-2">{log.details}</td>
//                   <td className="px-4 py-2 text-sm text-gray-600">
//                     {new Date(log.created_at).toLocaleDateString("en-GB", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                     })}
//                   </td>
//                 </tr>
//               ))}

//             </tbody>
//           </table>
//           {/* 📄 PAGINATION */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between mt-6">
//               <p className="text-sm text-gray-600">
//                 Page {currentPage} of {totalPages}
//               </p>

//               <div className="flex gap-2">
//                 <button
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((p) => p - 1)}
//                   className={`px-3 py-1 rounded-lg border ${
//                     currentPage === 1
//                       ? "text-gray-400 cursor-not-allowed"
//                       : "hover:bg-gray-100"
//                   }`}
//                 >
//                   Previous
//                 </button>

//                 <button
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage((p) => p + 1)}
//                   className={`px-3 py-1 rounded-lg border ${
//                     currentPage === totalPages
//                       ? "text-gray-400 cursor-not-allowed"
//                       : "hover:bg-gray-100"
//                   }`}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}

//         </div>
//       </section>
//     </div>
//   );
// }
import { useState, useEffect, useMemo } from "react";
import Api from "../../Api/Api";
import { MdModeEditOutline } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
/* ---------------- LOG FILTER TABS ---------------- */
const LOG_TABS = [
  { label: "All", value: "ALL" },
  { label: "Screen", value: "SCREEN" },
  { label: "Content", value: "CONTENT" },
  { label: "User", value: "USER" },
];

/* ---------------- MAIN TABS ---------------- */
const MAIN_TABS = [
  { label: "Logs", value: "LOGS" },
  { label: "Management", value: "MANAGEMENT" },
];

export default function Logs() {
  const token = sessionStorage.getItem("authToken");

  /* ---------------- MAIN TAB ---------------- */
  const [mainTab, setMainTab] = useState("LOGS");

  /* ---------------- LOG STATES ---------------- */
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [activeLogTab, setActiveLogTab] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;


  /* -------- EDIT ROLE MODAL STATES -------- */
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");


  /* -------- ADD USER MODAL STATES -------- */
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user",
    permission: "viewer",
    password: "",
    confirmPassword: "",
  });
  const [isCreating, setIsCreating] = useState(false);




  /* ---------------- USER MANAGEMENT STATES ---------------- */
  const [users, setUsers] = useState([]);

  /* ---------------- FETCH LOGS ---------------- */
  async function fetchLogs() {
    try {
      const res = await fetch(`${Api}/api/v1/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setLogs(await res.json());
    } catch (err) {
      console.error(err);
    }
  }

  /* ---------------- FETCH USERS ---------------- */
  async function fetchUsers() {
    try {
      const res = await fetch(`${Api}/api/v1/logs/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUsers(await res.json());

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchLogs();
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, eventFilter, activeLogTab]);

  /* ---------------- LOG FILTER ---------------- */
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const text =
        `${log.user?.name} ${log.user?.email} ${log.details}`.toLowerCase();

      return (
        text.includes(search.toLowerCase()) &&
        (!eventFilter || log.event_type === eventFilter) &&
        (activeLogTab === "ALL" ||
          log.event_type.startsWith(activeLogTab))
      );
    });
  }, [logs, search, eventFilter, activeLogTab]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  const uniqueEvents = [...new Set(logs.map((l) => l.event_type))];

  /* ---------------- UPDATE ROLE ---------------- */
  const updateRole = async (userId, permission) => {
    console.log("Updating user:", userId, "to role:", permission);
    try {
      await fetch(`${Api}/api/v1/logs/${userId}/update_users_permission`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ permission }),
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, permission } : u
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-200 text-gray-700";
      case "banned":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-blue-100 text-blue-700";
      case "suspended":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };


  /* ---------------- USER MANAGEMENT FILTER STATES ---------------- */
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [userPage, setUserPage] = useState(1);
  const USERS_PER_PAGE = 10;


  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const text =
        `${user.name} ${user.email}`.toLowerCase();

      return (
        text.includes(userSearch.toLowerCase()) &&
        (!roleFilter || user.permission === roleFilter) &&
        (!statusFilter || user.status === statusFilter)
      );
    });
  }, [users, userSearch, roleFilter, statusFilter]);


  const totalUserPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (userPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, userPage]);



  useEffect(() => {
    setUserPage(1);
    console.log("Filters changed================", users);
  }, [userSearch, roleFilter, statusFilter]);

  const handleRoleChange = (userId, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, permission: newRole } : user
      )
    );
  };

  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(`${Api}/api/v1/logs/${userId}/delete_user`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userId)
        );
        alert("User deleted successfully.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createUser = async () => {
    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.password
    ) {
      alert("Name, Email and Password are required");
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setIsCreating(true);

      const payload = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        password_confirmation: newUser.password,
       role: newUser.role,
        permission: newUser.permission,
      };

      const res = await fetch(
        `${Api}/api/v1/create_user`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      console.log("Create User Response:", data);

      if (!res.ok) {
        throw new Error(
          data.message ||
          data.error ||
          "Failed to create user"
        );
      }


      /* REFRESH USERS TABLE */
      await fetchUsers();

      // reset form
      setNewUser({
        name: "",
        email: "",
        permission: "viewer",
        password: "",
        confirmPassword: "",
      });

      setShowAddUserModal(false);

      alert("User created successfully!");

    } catch (err) {
      console.error(err);

      alert(
        err.message || "Error creating user"
      );

    } finally {
      setIsCreating(false);
    }
  };



  return (
    <div className="p-6">
      <section className="bg-white rounded-2xl shadow-md p-6">

        {/* ================= MAIN TABS ================= */}
        <div className="flex gap-4 mb-6 border-b">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setMainTab(tab.value)}
              className={`px-6 py-3 font-semibold ${mainTab === tab.value
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-500"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= LOGS TAB ================= */}
        {mainTab === "LOG" && (
          <>
            <h2 className="text-3xl font-bold mb-6">User Activity Logs</h2>

            {/* SEARCH & FILTER */}
            <div className="flex flex-wrap gap-4 mb-6">
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg px-4 py-2 w-full md:w-1/3"
              />

              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                <option value="">All Events</option>
                {uniqueEvents.map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
            </div>

            {/* LOG TYPE TABS */}
            <div className="flex gap-3 mb-4 border-b">
              {LOG_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveLogTab(tab.value)}
                  className={`px-4 py-2 font-semibold ${activeLogTab === tab.value
                    ? "bg-blue-600 text-white rounded-t"
                    : "text-gray-600"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* LOG TABLE */}
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Event</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="border-t">
                    <td className="p-3">{log.user?.name}</td>
                    <td className="p-3">{log.user?.email}</td>
                    <td className="p-3 font-semibold text-blue-600">
                      {log.event_type}
                    </td>
                    <td className="p-3">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className={`px-3 py-1 rounded-lg border ${currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100"
                      }`}
                  >
                    Previous
                  </button>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className={`px-3 py-1 rounded-lg border ${currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100"
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {mainTab === "LOGS" && (
          <div className="space-y-6">

            {/* ===== HEADER ===== */}
            <div>
              <h2 className="text-3xl font-bold">User Activity Logs</h2>
              <p className="text-gray-500 mt-1">
                Track user actions, system events, and content changes
              </p>
            </div>

            {/* ===== TOOLBAR ===== */}
            <div className="flex flex-wrap items-center justify-between gap-4">

              <div className="flex flex-wrap gap-3">
                <input
                  placeholder="Search user, email or details"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-full px-4 py-2 w-64"
                />

                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="border rounded-full px-4 py-2"
                >
                  <option value="">All Events</option>
                  {uniqueEvents.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
              </div>

              {/* <button className="border rounded-full px-5 py-2 text-gray-700">
                Export Logs
              </button> */}
            </div>

            {/* ===== LOG TYPE TABS ===== */}
            <div className="flex gap-3 border-b">
              {LOG_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveLogTab(tab.value)}
                  className={`px-4 py-2 font-medium rounded-t-lg transition ${activeLogTab === tab.value
                    ? "bg-slate-800 text-white"
                    : "text-gray-500 hover:text-black"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ===== TABLE ===== */}
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="p-3 text-left">User</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Event</th>
                    <th className="p-3 text-left">Details</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">
                        {log.user?.name || "System"}
                      </td>

                      <td className="p-3 text-gray-600">
                        {log.user?.email || "-"}
                      </td>

                      <td className="p-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {log.event_type}
                        </span>
                      </td>

                      <td className="p-3 text-gray-700">
                        {log.details}
                      </td>

                      <td className="p-3 text-gray-500">
                        {log.created_at
                          ? new Date(log.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ===== PAGINATION ===== */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between text-sm text-gray-600">
                <p>
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} of{" "}
                  {filteredLogs.length}
                </p>

                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    «
                  </button>

                  <span className="px-3 py-1 border rounded bg-slate-800 text-white">
                    {currentPage}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </div>
        )}


        {/* ================= MANAGEMENT TAB ================= */}
        {mainTab === "MANAGEMENTS" && (
          <>
            <h2 className="text-3xl font-bold mb-6">User Management</h2>

            <table className="w-full table-fixed border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left w-1/4">Name</th>
                  <th className="p-3 text-left w-1/3">Email</th>
                  <th className="p-3 text-left w-1/6">Role</th>
                  <th className="p-3 text-left w-1/6">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-3 text-left">{user.name}</td>
                    <td className="p-3 text-left">{user.email}</td>
                    <td className="p-3 text-left font-semibold">
                      {user.permission}
                    </td>
                    <td className="p-3 text-left">
                      <select
                        value={user.permission}
                        onChange={(e) =>
                          updateRole(user.id, e.target.value)
                        }
                        className="border rounded px-3 py-1"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}


        {mainTab === "MANAGEMENT" && (
          <div className="space-y-6">

            {/* ===== HEADER ===== */}
            <div>
              <h2 className="text-3xl font-bold">User Management</h2>
              <p className="text-gray-500 mt-1">
                Manage all users in one place. Control access, assign roles, and monitor activity.
              </p>
            </div>

            {/* ===== TOOLBAR ===== */}
            <div className="flex flex-wrap items-center justify-between gap-4">

              <div className="flex flex-wrap gap-3">
                <input
                  type="text"
                  placeholder="Search name or email"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="border rounded-full px-4 py-2 w-64"
                />

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="border rounded-full px-4 py-2"
                >
                  <option value="">All Roles</option>
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>

                {/* <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-full px-4 py-2"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                  <option value="suspended">Suspended</option>
                </select> */}

              </div>

              <div className="flex gap-3">
                {/* <button className="border rounded-full px-5 py-2 text-gray-700">
                  Export
                </button> */}
                <button className="bg-slate-800 text-white rounded-full px-5 py-2"
                  onClick={() => setShowAddUserModal(true)}
                >
                  + Add User
                </button>
              </div>
            </div>

            {/* ===== TABLE ===== */}
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    {/* <th className="p-3"><input type="checkbox" /></th> */}
                    <th className="p-3 text-left">Full Name</th>
                    <th className="p-3 text-left">Email</th>
                    {/* <th className="p-3 text-left">Username</th> */}
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Joined Date</th>
                    {/* <th className="p-3 text-left">Last Active</th> */}
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      {/* <td className="p-3">
                        <input type="checkbox" />
                      </td> */}

                      <td className="p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                          {user.name?.[0]}
                        </div>
                        {user.name}
                      </td>

                      <td className="p-3">{user.email}</td>
                      {/* <td className="p-3">{user.username || "-"}</td> */}

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                            user.status
                          )}`}
                        >
                          {user.status || "active"}
                        </span>
                      </td>

                      <td className="p-3 font-medium">{user.permission}</td>
                      {/* <td className="p-3">{user.created_at || "-"}</td> */}
                      <td className="p-3">
                        {user.created_at
                          ? (() => {
                            const d = new Date(user.created_at);
                            return `${String(d.getDate()).padStart(2, "0")}/${String(
                              d.getMonth() + 1
                            ).padStart(2, "0")}/${d.getFullYear()}`;
                          })()
                          : "-"}
                      </td>

                      {/* <td className="p-3">{user.last_active || "-"}</td> */}

                      <td className="p-3 text-center flex justify-center gap-3">
                        <MdModeEditOutline
                          size={24}
                          className="cursor-pointer text-blue-600"
                          onClick={() => {
                            setSelectedUser(user);
                            setSelectedRole(user.permission);
                            setShowEditModal(true);
                          }}
                        />


                        <MdDeleteOutline
                          size={24}
                          color="red"
                          onClick={() => handleDeleteUser(user.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ===== PAGINATION ===== */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <p>
                Showing {(userPage - 1) * USERS_PER_PAGE + 1}–
                {Math.min(userPage * USERS_PER_PAGE, filteredUsers.length)} of{" "}
                {filteredUsers.length}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={userPage === 1}
                  onClick={() => setUserPage((p) => p - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  «
                </button>

                <span className="px-3 py-1 border rounded bg-slate-800 text-white">
                  {userPage}
                </span>

                <button
                  disabled={userPage === totalUserPages}
                  onClick={() => setUserPage((p) => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  »
                </button>
              </div>
            </div>


          </div>
        )}


        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">

              {/* ===== HEADER ===== */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Edit User Role</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              </div>

              {/* ===== USER INFO ===== */}
              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="font-medium">{selectedUser?.name}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{selectedUser?.email}</p>
                </div>
              </div>

              {/* ===== ROLE SELECT ===== */}
              <div className="mb-6">
                <label className="text-sm text-gray-500 block mb-1">Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>
              </div>

              {/* ===== ACTIONS ===== */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    await updateRole(selectedUser.id, selectedRole);
                    setShowEditModal(false);
                  }}
                  className="px-5 py-2 rounded-lg bg-slate-800 text-white"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}


        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">

              {/* ===== HEADER ===== */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Add New User</h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              </div>

              {/* ===== FORM ===== */}
              <div className="space-y-4">

                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="john@email.com"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">Password</label>

                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Enter password"
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    value={newUser.confirmPassword}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Confirm password"
                    autoComplete="new-password"
                  />

                  {newUser.confirmPassword &&
                    newUser.password !==
                    newUser.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        Passwords do not match
                      </p>
                    )}
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    User Role
                  </label>

                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        role: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-500">  Permission</label>
                  <select
                    value={newUser.permission}
                    onChange={(e) =>
                      setNewUser({ ...newUser, permission: e.target.value })
                    }
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
              </div>

              {/* ===== ACTIONS ===== */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>

                <button
                  onClick={createUser}
                  disabled={isCreating}
                  className="px-5 py-2 rounded-lg bg-slate-800 text-white disabled:opacity-60"
                >
                  {isCreating ? "Creating..." : "Create User"}
                </button>
              </div>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}
