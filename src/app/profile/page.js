"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import NavbarWrapper from "../public_components/NavbarWrapper";
import Image from "next/image";
// import coverImgdots from "../../../public/images/profilehedaerco.png";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL_HISTORY = process.env.NEXT_PUBLIC_SPS_SERVICE_URL;

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [selectedTab, setSelectedTab] = useState("History");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  const [editingField, setEditingField] = useState(() => null);

  const [updatedProfile, setUpdatedProfile] = useState(profile);

  const handleEdit = (field) => {
      setEditingField(field);
  };

  const handleChange = (e, field) => {
      setUpdatedProfile({ ...updatedProfile, [field]: e.target.value });
  };

  const handleUpdate = async (field) => {
      const token = getCookie("access_token");
      if (!token) return;

      try {
          await fetch(`${API_URL}/api/profile/`, {
              method: "PATCH",
              headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ [field]: updatedProfile[field] })
          });
          setEditingField(null);
      } catch (error) {
          console.error("Error updating profile:", error);
      }
  };

  

  useEffect(() => {
    document.title = "User Profile";
    fetchUserProfile();
    fetchHistoryData();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    const token = getCookie("access_token");

    if (!token) {
      setError("Access token not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL + "/api/profile/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      console.log("Fetched User Data:", data);

      setProfile({
        fullName: data.full_name || "User",
        email: data.email || "No email provided",
        bio: data.bio || "Not provided",
        profilePic: data.profile_picture || "/images/user-avatar.png",
        subscriptionType: data.subscription_type || "free",
        credibilityScore: data.credibility_score,
        address: data.address || "Not provided",
        phone: data.phone || "Not provided",
        history: data.history || [],
      });
    } catch (err) {
      // console.error("Error fetching profile:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score <= 3) return "#FDA303";
    if (score <= 7) return "#CCD611";
    return "#78B62C";
  };

  // HIstory

  const [filter, setFilter] = useState("All");

  const fetchHistoryData = async () => {
    setLoading(true);
    const token = getCookie("access_token");

    try {
      const response = await fetch(`${API_URL_HISTORY}/feeds/validation-histories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch history");

      const data = await response.json();
      setHistory(data.history || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((item) => {
    if (filter === "All") return true;
    if (filter === "Recent") return new Date(item.created_at) > new Date() - 7 * 24 * 60 * 60 * 1000;
    if (filter === "High Score") return item.credibility_score > 7;
    return true;
  });



  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarWrapper />

      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
        {loading ? (
          <p className="text-center text-gray-500">Loading profile...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <h2 className="profile-tag">User Profile</h2>

            <div className="text-center relative">
              <div className="coverimgdots absolute top-0 left-0 right-0 h-32 bg-green-300 overflow-hidden flex justify-center">
                <Image
                  src={""}
                  alt="Cover Background"
                  layout="fill"
                  objectFit="cover"
                  className="opacity-90"
                />
              </div>

              <div className="relative top-6">
                <Image
                  src={profile.profilePic}
                  alt="Profile Picture"
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-white shadow-md mx-auto"
                />
                <h2 className="text-2xl font-semibold mt-2">
                  {profile.fullName}
                </h2>
                <p className="text-gray-600">{profile.email}</p>
              </div>

              <div className="credibility-div">
                <div className="relative w-full bg-gray-200 rounded-full h-2.5 my-4 overflow-hidden">
                  
                  <div
                    className="h-2.5 rounded-full transition-all duration-500 relative"
                    style={{
                      width: `${(profile.credibilityScore / 10) * 100}%`,
                      maxWidth: "100%",
                      background: `linear-gradient(90deg, #FA4807 0%, #FFEA00 51.5%, ${getScoreColor(
                        profile.credibilityScore
                      )} 100%)`,
                    }}
                  >
                    
                    <div
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        left: `calc(${
                          (profile.credibilityScore / 10) * 100
                        }% - 8px)`, 
                        transform: "translateX(-50%)", 
                      }}
                    >
                     
                      <svg
                        width="27"
                        height="24"
                        viewBox="0 0 27 24"
                        fill={getScoreColor(profile.credibilityScore)}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.5 0L26.9234 23.25H0.0766058L13.5 0Z"
                          fill={getScoreColor(profile.credibilityScore)}
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-semibold text-center">
                  {profile.credibilityScore} OUT OF 10
                </p>
              </div>
            </div>

          
            <div className="mt-6 border-b flex justify-center space-x-6">
              {["History", "Basic Info", "Score", "Billing", "Settings"].map(
                (tab) => (
                  <button
                    key={tab}
                    className={`pb-2 ${
                      selectedTab === tab
                        ? "border-b-4 border-green-500 text-black font-semibold"
                        : "text-gray-500"
                    }`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            <div className="p-6">
      {selectedTab === "History" && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">History</h3>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">History</h2>
            <select
              className="border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All ({history.length})</option>
              <option value="Recent">Recent</option>
              <option value="High Score">High Score</option>
            </select>
          </div>

          {loading ? (
            <p>Loading history...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredHistory.length > 0 ? (
            filteredHistory.map((item, index) => (
              <div key={index} className="p-3 bg-gray-100 rounded-lg mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col text-sm">
                    <span className="text-gray-500">{item.created_at}</span>
                    <span className="text-gray-500">{item.time}</span>
                  </div>
                  <div className={`px-2 py-1 text-xs font-semibold text-white rounded-md ${getScoreColor(item.credibility_score)}`}>
                    {item.credibility_score}/10
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-700">{item.output_text}</div>

                <div className="flex justify-between items-center mt-3">
                  <a href="#" className="text-blue-500 text-sm font-semibold hover:underline">
                    Analysis →
                  </a>
                  <button className="p-1 bg-gray-200 rounded-full hover:bg-gray-300">
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M28 8.6665C28 10.8756 26.2092 12.6665 24 12.6665C21.7908 12.6665 20 10.8756 20 8.6665C20 6.45737 21.7908 4.6665 24 4.6665C26.2092 4.6665 28 6.45737 28 8.6665Z"
                        stroke="#007BFF"
                        strokeWidth="2"
                      />
                      <path
                        d="M12 16C12 18.2092 10.2091 20 8 20C5.79087 20 4 18.2092 4 16C4 13.7908 5.79087 12 8 12C10.2091 12 12 13.7908 12 16Z"
                        stroke="#007BFF"
                        strokeWidth="2"
                      />
                      <path
                        d="M28 23.3335C28 25.5427 26.2092 27.3335 24 27.3335C21.7908 27.3335 20 25.5427 20 23.3335C20 21.1243 21.7908 19.3335 24 19.3335C26.2092 19.3335 28 21.1243 28 23.3335Z"
                        stroke="#007BFF"
                        strokeWidth="2"
                      />
                      <path opacity="0.4" d="M11.6379 14.3328L20.3046 10.3335M11.6379 17.6668L20.3046 21.6662" stroke="#007BFF" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No history available.</p>
          )}
        </div>
      )}
    </div>

            {selectedTab === "Basic Info" && (
                  <div className="mt-6">
                  <h3 className="text-lg font-semibold">Profile Details</h3>
                  <div className="bg-gray-100 p-4 rounded text-sm mt-3">
                      {['fullName', 'bio', 'subscriptionType', 'credibilityScore', 'address', 'phone'].map(field => (
                          <div key={field}>
                              <strong>{field.replace(/([A-Z])/g, ' $1').trim()}:</strong>
                              {editingField === field ? (
                                  <input 
                                      type="text" 
                                      value={updatedProfile[field]} 
                                      onChange={(e) => handleChange(e, field)} 
                                      onBlur={() => handleUpdate(field)} 
                                      onKeyDown={(e) => e.key === 'Enter' && handleUpdate(field)}
                                      autoFocus
                                  />
                              ) : (
                                  <span onClick={() => handleEdit(field)} className="cursor-pointer"> {updatedProfile[field]}</span>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import { getCookie } from "cookies-next";
// import NavbarWrapper from "../public_components/NavbarWrapper";
// import Image from "next/image";
// import coverImgdots from "../../../public/images/profilehedaerco.png";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export default function ProfilePage() {
//   const [profile, setProfile] = useState(null);
//   const [selectedTab, setSelectedTab] = useState("History");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   // const [history, setHistory] = useState([]);
  

//   useEffect(() => {
//     document.title = "User Profile";
//     fetchUserProfile();
//     // fetchHistoryData();
//   }, []);

//   const fetchUserProfile = async () => {
//     setLoading(true);
//     const token = getCookie("access_token");

//     if (!token) {
//       setError("Access token not found.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(API_URL + "/api/profile/", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) throw new Error("Failed to fetch profile");

//       const data = await response.json();
//       console.log("Fetched User Data:", data);

//       setProfile({
//         fullName: data.full_name || "User",
//         email: data.email || "No email provided",
//         bio: data.bio || "Not provided",
//         profilePic: data.profile_picture || "/images/user-avatar.png",
//         subscriptionType: data.subscription_type || "free",
//         credibilityScore: data.credibility_score,
//         address: data.address || "Not provided",
//         phone: data.phone || "Not provided",
//         history: data.history || [],
//       });
//     } catch (err) {
//       // console.error("Error fetching profile:", err.message);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getScoreColor = (score) => {
//     if (score <= 3) return "#FDA303";
//     if (score <= 7) return "#CCD611";
//     return "#78B62C";
//   };

//   // HIstory

//   const [filter, setFilter] = useState("All");

//   const historyData = [
//     {
//       date: "11/10/2022",
//       time: "11:00 AM",
//       description:
//         "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incid...",
//       link: "Analysis",
//       score: "1/10",
//       scoreColor: "bg-red-400",
//     },
//     {
//       date: "11/10/2022",
//       time: "11:00 AM",
//       description:
//         "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incid...",
//       link: "Analysis",
//       score: "9/10",
//       scoreColor: "bg-green-400",
//     },
//     {
//       date: "11/10/2022",
//       time: "11:00 AM",
//       description:
//         "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incid...",
//       link: "Analysis",
//       score: "1/10",
//       scoreColor: "bg-red-400",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <NavbarWrapper />

//       <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
//         {loading ? (
//           <p className="text-center text-gray-500">Loading profile...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : (
//           <>
//             <h2 className="profile-tag">User Profile</h2>

//             <div className="text-center relative">
//               <div className="coverimgdots absolute top-0 left-0 right-0 h-32 bg-green-300 overflow-hidden flex justify-center">
//                 <Image
//                   src={coverImgdots}
//                   alt="Cover Background"
//                   layout="fill"
//                   objectFit="cover"
//                   className="opacity-90"
//                 />
//               </div>

//               <div className="relative top-6">
//                 <Image
//                   src={profile.profilePic}
//                   alt="Profile Picture"
//                   width={100}
//                   height={100}
//                   className="rounded-full border-4 border-white shadow-md mx-auto"
//                 />
//                 <h2 className="text-2xl font-semibold mt-2">
//                   {profile.fullName}
//                 </h2>
//                 <p className="text-gray-600">{profile.email}</p>
//               </div>

//               <div className="credibility-div">
//                 <div className="relative w-full bg-gray-200 rounded-full h-2.5 my-4 overflow-hidden">
                  
//                   <div
//                     className="h-2.5 rounded-full transition-all duration-500 relative"
//                     style={{
//                       width: `${(profile.credibilityScore / 10) * 100}%`,
//                       maxWidth: "100%",
//                       background: `linear-gradient(90deg, #FA4807 0%, #FFEA00 51.5%, ${getScoreColor(
//                         profile.credibilityScore
//                       )} 100%)`,
//                     }}
//                   >
                    
//                     <div
//                       className="absolute top-1/2 -translate-y-1/2"
//                       style={{
//                         left: `calc(${
//                           (profile.credibilityScore / 10 ) * 100
//                         }% - 8px)`, 
//                         transform: "translateX(-50%)", 
//                       }}
//                     >
//                       <svg
//                         width="27"
//                         height="24"
//                         viewBox="0 0 27 24"
//                         fill={getScoreColor(profile.credibilityScore)}
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           d="M13.5 0L26.9234 23.25H0.0766058L13.5 0Z"
//                           fill={getScoreColor(profile.credibilityScore)}
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>

//                 <p className="text-sm font-semibold text-center">
//                   {profile.credibilityScore / 10} OUT OF 10
//                 </p>
//               </div>
//             </div>

          
//             <div className="mt-6 border-b flex justify-center space-x-6">
//               {["History", "Basic Info", "Score", "Billing", "Settings"].map(
//                 (tab) => (
//                   <button
//                     key={tab}
//                     className={`pb-2 ${
//                       selectedTab === tab
//                         ? "border-b-4 border-green-500 text-black font-semibold"
//                         : "text-gray-500"
//                     }`}
//                     onClick={() => setSelectedTab(tab)}
//                   >
//                     {tab}
//                   </button>
//                 )
//               )}
//             </div>

//             {selectedTab === "History" && (
//               <div className="mt-6">
//                 <h3 className="text-lg font-semibold">History</h3>
//                 <div className="mt-4">
//                   {profile.history.length > 0 ? (
//                     profile.history.map((item, index) => (
//                       <div
//                         key={index}
//                         className="flex justify-between p-3 border-b border-gray-200"
//                       >
//                         <span className="text-gray-700">{item.date}</span>
//                         <span className="text-blue-500 cursor-pointer">
//                           Analysis →
//                         </span>
//                         <span
//                           className={`text-sm font-semibold px-2 py-1 rounded ${
//                             item.score > 5
//                               ? "bg-green-100 text-green-700"
//                               : "bg-red-100 text-red-700"
//                           }`}
//                         >
//                           {item.score}/10
//                         </span>
//                       </div>
//                     ))
//                   ) : (
//                     // <p className="text-gray-500">No history available.</p>
//                     <div>
//                       <div className="p-4 bg-white shadow-md rounded-lg w-full max-w-3xl mx-auto">
                        
//                         <div className="flex justify-between items-center mb-4">
//                           <h2 className="text-lg font-semibold">History</h2>
//                           <select
//                             className="border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none"
//                             value={filter}
//                             onChange={(e) => setFilter(e.target.value)}
//                           >
//                             <option value="All">All (88)</option>
//                             <option value="Recent">Recent</option>
//                             <option value="High Score">High Score</option>
//                           </select>
//                         </div>

//                         <div className="space-y-3">
//                           {historyData.map((item, index) => (
//                             <div
//                               key={index}
//                               className="p-3 bg-gray-100 rounded-lg"
//                             >
//                               <div className="flex items-center justify-between">
//                                 <div className="flex flex-col text-sm">
//                                   <span className="text-gray-500">
//                                     {item.date}
//                                   </span>
//                                   <span className="text-gray-500">
//                                     {item.time}
//                                   </span>
//                                 </div>

//                                 <div
//                                   className={`px-2 py-1 text-xs font-semibold text-white rounded-md ${item.scoreColor}`}
//                                 >
//                                   {item.score}
//                                 </div>
//                               </div>

//                               <div className="mt-2 text-sm text-gray-700">
//                                 {item.description}
//                               </div>

//                               <div className="flex justify-between items-center mt-3">
//                                 <a
//                                   href="#"
//                                   className="text-blue-500 text-sm font-semibold hover:underline"
//                                 >
//                                   {item.link} &raquo;
//                                 </a>

//                                 <button className="p-1 bg-gray-200 rounded-full hover:bg-gray-300">
//                                   <svg
//                                     width="32"
//                                     height="32"
//                                     viewBox="0 0 32 32"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       d="M28 8.6665C28 10.8756 26.2092 12.6665 24 12.6665C21.7908 12.6665 20 10.8756 20 8.6665C20 6.45737 21.7908 4.6665 24 4.6665C26.2092 4.6665 28 6.45737 28 8.6665Z"
//                                       stroke="#007BFF"
//                                       strokeWidth="2"
//                                     />
//                                     <path
//                                       d="M12 16C12 18.2092 10.2091 20 8 20C5.79087 20 4 18.2092 4 16C4 13.7908 5.79087 12 8 12C10.2091 12 12 13.7908 12 16Z"
//                                       stroke="#007BFF"
//                                       strokeWidth="2"
//                                     />
//                                     <path
//                                       d="M28 23.3335C28 25.5427 26.2092 27.3335 24 27.3335C21.7908 27.3335 20 25.5427 20 23.3335C20 21.1243 21.7908 19.3335 24 19.3335C26.2092 19.3335 28 21.1243 28 23.3335Z"
//                                       stroke="#007BFF"
//                                       strokeWidth="2"
//                                     />
//                                     <path
//                                       opacity="0.4"
//                                       d="M11.6379 14.3328L20.3046 10.3335M11.6379 17.6668L20.3046 21.6662"
//                                       stroke="#007BFF"
//                                       strokeWidth="2"
//                                     />
//                                   </svg>
//                                 </button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {selectedTab === "Basic Info" && (
//               <div className="mt-6">
//                 <h3 className="text-lg font-semibold">Profile Details</h3>
//                 <div className="bg-gray-100 p-4 rounded text-sm mt-3">
//                   <div>
//                     <strong>Full Name:</strong> {profile.fullName}
//                   </div>
//                   <div>
//                     <strong>Bio:</strong> {profile.bio}
//                   </div>
//                   <div>
//                     <strong>Subscription Type:</strong>{" "}
//                     {profile.subscriptionType}
//                   </div>
//                   <div>
//                     <strong>Credibility Score:</strong>{" "}
//                     {profile.credibilityScore}
//                   </div>
//                   <div>
//                     <strong>Address:</strong> {profile.address}
//                   </div>
//                   <div>
//                     <strong>Phone:</strong> {profile.phone}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

