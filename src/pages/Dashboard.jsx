import React from "react";
import AdminNavBar from "../Nav/AdminNavBar";


export default function Dashboard() {
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  return (
    <div>
      <AdminNavBar />
      <div className="pt-36">
        <h1 className="text-3xl font-bold text-center">Dashboard Page</h1>
      </div>
    </div>
  );
};

