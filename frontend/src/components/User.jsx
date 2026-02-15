// import { useEffect, useState } from "react";
// import api from "../utils/api";

// function Users() {
//   const [users, setUsers] = useState([]);

//   const token = localStorage.getItem("token");
//   const currentUser = token
//     ? JSON.parse(atob(token.split(".")[1]))
//     : null;

//   useEffect(() => {
//     if (token) {
//       fetchUsers();
//     }
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const res = await api.get("/auth");
//       setUsers(res.data);
//     } catch (err) {
//       console.log("Error fetching users:", err);
//     }
//   };

//   const toggleRole = async (id) => {
//     try {
//       await api.patch(`/auth/${id}/toggle-role`);
//       fetchUsers();
//     } catch (err) {
//       console.log("Error toggling role:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-blue-200">
//       <div className="flex flex-col items-center space-y-4 mt-6">
//         {users.map((user) => (
//           <div
//             key={user.id}
//             className="bg-white p-4 rounded shadow w-96 flex justify-between items-center"
//           >
//             <div>
//               <p><b>Name:</b> {user.name}</p>
//               <p><b>Phone:</b> {user.phoneNumber}</p>
//               <p><b>Role:</b> {user.role}</p>
//             </div>

//             {currentUser?.role === "admin" && (
//               <button
//                 onClick={() => toggleRole(user.id)}
//                 className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//               >
//                 {user.role === "admin" ? "Make User" : "Make Admin"}
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Users;
