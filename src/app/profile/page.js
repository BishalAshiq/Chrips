// "use client";
// import NavbarWrapper from '../public_components/NavbarWrapper';
// import { useEffect, useState } from 'react';
// import { getCookie } from 'cookies-next';

// export default function Profile() {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     document.title = "Profile";
//     const token = getCookie("access_token");

//     if (!token) {
//       setError("Access token not found.");
//       return;
//     }

//     fetch('https://auth.chirpchecker.com/api/profile/', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setProfile(data);
//       })
//       .catch((err) => {
//         setError(err.message);
//       });
//   }, []);

//   // Helper to display a value or a default message if null
//   const displayValue = (value) => (value !== null && value !== undefined ? value : "Not provided");

//   return (
//     <div className="h-screen w-screen flex flex-col bg-white overflow-hidden p-4">
//       <NavbarWrapper />
//       <main className="flex-1 flex flex-col items-center justify-center">
//         <h1 className="text-2xl font-bold">Profile</h1>
//         {error && <p className="mt-4 text-red-500">Error: {error}</p>}
//         {profile ? (
//           <div className="mt-4 bg-gray-100 p-4 rounded text-sm">
//             <div><strong>Full Name:</strong> {displayValue(profile.full_name)}</div>
//             <div><strong>Bio:</strong> {displayValue(profile.bio)}</div>
//             <div><strong>Profile Photo:</strong> {displayValue(profile.profile_photo)}</div>
//             <div><strong>Subscription Type:</strong> {displayValue(profile.subscription_type)}</div>
//             <div><strong>Credibility Score:</strong> {displayValue(profile.credibility_score)}</div>
//             <div><strong>Address:</strong> {displayValue(profile.address)}</div>
//             <div><strong>Phone:</strong> {displayValue(profile.phone)}</div>
//           </div>
//         ) : (
//           !error && <p className="mt-4">Loading profile...</p>
//         )}
//       </main>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import NavbarWrapper from "../public_components/NavbarWrapper";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [selectedTab, setSelectedTab] = useState("History");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "User Profile";
    fetchUserProfile();
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
      const response = await fetch(API_URL+"/profile/", {
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
      console.error("Error fetching profile:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

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
            {/* Profile Header */}
            <div className="text-center relative">
              <div className="absolute top-0 left-0 right-0 h-16 bg-green-300 rounded-t-lg"></div>
              <div className="relative -top-8">
                <Image
                  src={profile.profilePic}
                  alt="Profile Picture"
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-white shadow-md mx-auto"
                />
                <h2 className="text-2xl font-semibold mt-2">{profile.fullName}</h2>
                <p className="text-gray-600">{profile.email}</p>
              </div>

              {/* Credibility Score Bar (Fixed Width) */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 my-4 overflow-hidden">
                <div
                  className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${(profile.credibilityScore / 10) * 100}%`,
                    maxWidth: "100%",
                  }}
                ></div>
              </div>
              <p className="text-sm font-semibold">{profile.credibilityScore} OUT OF 10</p>
            </div>

            {/* Tabs */}
            <div className="mt-6 border-b flex justify-center space-x-6">
              {["History", "Basic Info", "Score", "Billing", "Settings"].map((tab) => (
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
              ))}
            </div>

         
            {selectedTab === "History" && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold">History</h3>
                <div className="mt-4">
                  {profile.history.length > 0 ? (
                    profile.history.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between p-3 border-b border-gray-200"
                      >
                        <span className="text-gray-700">{item.date}</span>
                        <span className="text-blue-500 cursor-pointer">Analysis →</span>
                        <span
                          className={`text-sm font-semibold px-2 py-1 rounded ${
                            item.score > 5 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.score}/10
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No history available.</p>
                  )}
                </div>
              </div>
            )}

          
            {selectedTab === "Basic Info" && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Profile Details</h3>
                <div className="bg-gray-100 p-4 rounded text-sm mt-3">
                  <div><strong>Full Name:</strong> {profile.fullName}</div>
                  <div><strong>Bio:</strong> {profile.bio}</div>
                  <div><strong>Subscription Type:</strong> {profile.subscriptionType}</div>
                  <div><strong>Credibility Score:</strong> {profile.credibilityScore}</div>
                  <div><strong>Address:</strong> {profile.address}</div>
                  <div><strong>Phone:</strong> {profile.phone}</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}



// import { headers } from "next/headers";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// const PROFILE_API = process.env.NEXT_PUBLIC_PROFILE_API;

// /**
//  * Fetch Profile Data (Server Component)
//  */
// async function fetchProfile() {
//     try {
//       const token = await getAuthToken();
      
//       if (!token) {
//         // console.error("No valid authentication token found.");
//         return { error: "Authentication token is missing or invalid" };
//       }
  
//       console.log("🔄 Fetching profile using token...");
  
//       const response = await fetch(`${API_BASE_URL}${PROFILE_API}`, {
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         cache: "no-store", // Always fetch fresh data
//       });
  
//       return await handleAPIResponse(response);
//     } catch (error) {
//       console.error("Profile API Error:", error.message);
//       return { error: error.message || "Failed to fetch profile data" };
//     }
//   }

// /**
//  * Fetch Authentication Token Securely
//  */
// async function getAuthToken() {
//     try {
//       if (typeof window === "undefined") {
//         //  1. Server-Side: Retrieve from Environment Variable
//         const serverToken = process.env.AUTH_TOKEN;
//         if (serverToken) {
//           console.log("Using Server Token (ENV)");
//           return serverToken;
//         }
  
//         //  2. Server-Side: Retrieve Token from Headers
//         const requestHeaders = headers();
//         const authHeader = requestHeaders.get("Authorization");
//         if (authHeader) {
//           console.log(" Using Server Token (Headers)");
//           return authHeader.replace("Bearer ", ""); // Extract token
//         }
  
//         throw new Error(" No server-side authentication token found.");
//       }
  
//       //  3. Client-Side: Retrieve from LocalStorage
//       const clientToken = localStorage.getItem("auth_token");
//       if (!clientToken) throw new Error(" No client-side authentication token found.");
      
//       console.log("Using Client Token (LocalStorage)");
//       return clientToken;
//     } catch (error) {
//     //   console.error("Token Fetch Error:", error.message);
//       return null;
//     }
//   }
// /**
//  *  Handle API Responses Properly
//  */
// async function handleAPIResponse(response) {
//   try {
//     const contentType = response.headers.get("Content-Type");
//     let responseData;

//     if (contentType && contentType.includes("application/json")) {
//       responseData = await response.json();
//     } else {
//       responseData = await response.text();
//     }

//     if (!response.ok) {
//       const errorMsg = responseData?.error || response.statusText || "API request failed";
//       throw new Error(`Error ${response.status}: ${errorMsg}`);
//     }

//     return responseData;
//   } catch (error) {
//     console.error("API Response Handling Error:", error.message);
//     return { error: error.message || "Failed to process API response" };
//   }
// }

// /**
//  * Profile Component (Server Component)
//  */
// export default async function Profile() {
//   const data = await fetchProfile();

//   return (
//     <div>
//       {data.error ? (
//         <p style={styles.error}>{data.error}</p>
//       ) : (
//         <ul>
//           <ProfileDetail label="Full Name" value={data.full_name} />
//           <ProfileDetail label="Bio" value={data.bio} />
//           <ProfileDetail label="Subscription Type" value={data.subscription_type} />
//           <ProfileDetail label="Credibility Score" value={data.credibility_score} />
//           <ProfileDetail label="Address" value={data.address} />
//           <ProfileDetail label="Phone" value={data.phone} />
//           <li>
//             <strong>Profile Photo:</strong>{" "}
//             {data.profile_photo ? <img src={data.profile_photo} alt="Profile" width={100} /> : "N/A"}
//           </li>
//         </ul>
//       )}
//     </div>
//   );
// }

// /**
//  *  Reusable Profile Detail Component
//  */
// const ProfileDetail = ({ label, value }) => (
//   <li>
//     <strong>{label}:</strong> {value || "N/A"}
//   </li>
// );

// /**
//  * Styles
//  */
// const styles = {
//   error: { color: "red" },
// };



// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { getCookie } from "cookies-next";
// import { jwtDecode } from "jwt-decode";
// import NavbarWrapper from "../public_components/NavbarWrapper";

// const API_URL = process.env.NEXT_PUBLIC_PROFILE_API;
// const UPDATE_PROFILE_URL = process.env.NEXT_PUBLIC_UPDATE_PROFILE_ENDPOINT;
// const CHANGE_PASSWORD_URL = process.env.NEXT_PUBLIC_CHANGE_PASSWORD_ENDPOINT;

// export default function ProfilePage() {
//   const [user, setUser] = useState({
//     fullName: "John Doe",
//     email: "john.doe123@gmail.com",
//     profilePic: "/images/user-avatar.png",
//     credibilityScore: 7,
//   });

//   const [editName, setEditName] = useState(user.fullName);
//   const [passwords, setPasswords] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [selectedTab, setSelectedTab] = useState("Basic Info");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   const fetchUserProfile = async () => {
//     setLoading(true);
//     const token = getCookie("access_token");
//     if (!token) {
//       console.error("No access token found!");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(API_URL, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch profile");
//       }

  
//       const data = await response.json();
//       console.log("Fetched User Data:", data);

//       setUser({
//         fullName: `${data.first_name} ${data.last_name || ""}`,
//         email: data.email,
//         profilePic: data.profile_picture || "/images/user-avatar.png",
//         credibilityScore: data.credibility_score || 7,
//       });
//       setEditName(`${data.first_name} ${data.last_name || ""}`);
//     } catch (error) {
//       console.error("Error fetching profile:", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSaveChanges = async () => {
//     setLoading(true);
//     const token = getCookie("access_token");

//     try {
//       const response = await fetch(UPDATE_PROFILE_URL, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ full_name: editName }),
//       });

//       // if (!response.ok) throw new Error("Failed to update profile");

//       alert("Profile updated successfully!");
//       fetchUserProfile();
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordUpdate = async () => {
//     if (passwords.newPassword !== passwords.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     setLoading(true);
//     const token = getCookie("access_token");

//     try {
//       const response = await fetch(CHANGE_PASSWORD_URL, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           old_password: passwords.oldPassword,
//           new_password: passwords.newPassword,
//         }),
//       });

//       if (!response.ok) throw new Error("Failed to change password");

//       alert("Password updated successfully!");
//       setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
//     } catch (error) {
//       console.error("Error changing password:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <NavbarWrapper />

//       <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
//         <div className="text-center relative">
//           <div className="absolute top-0 left-0 right-0 h-16 bg-green-300 rounded-t-lg"></div>
//           <div className="relative -top-8">
//             <Image
//               src={user.profilePic}
//               alt="Profile Picture"
//               width={100}
//               height={100}
//               className="rounded-full border-4 border-white shadow-md mx-auto"
//             />
//             <h2 className="text-2xl font-semibold mt-2">{user.fullName}</h2>
//             <p className="text-gray-600">{user.email}</p>
//           </div>

//           <div className="w-full bg-gray-200 rounded-full h-2.5 my-4">
//             <div
//               className="bg-yellow-400 h-2.5 rounded-full"
//               style={{ width: `${(user.credibilityScore / 10) * 100}%` }}
//             ></div>
//           </div>
//           <p className="text-sm font-semibold">{user.credibilityScore} OUT OF 10</p>
//         </div>

//         <div className="mt-6 border-b flex justify-center space-x-6">
//           {["History", "Basic Info", "Score", "Billing", "Settings"].map((tab) => (
//             <button
//               key={tab}
//               className={`pb-2 ${
//                 selectedTab === tab
//                   ? "border-b-4 border-green-500 text-black font-semibold"
//                   : "text-gray-500"
//               }`}
//               onClick={() => setSelectedTab(tab)}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {selectedTab === "Basic Info" && (
//           <div className="mt-6">
//             <h3 className="text-lg font-semibold">Full Name</h3>
//             <input
//               type="text"
//               value={editName}
//               onChange={(e) => setEditName(e.target.value)}
//               className="w-full border rounded-md p-2 mt-2"
//             />
//             <div className="flex justify-end space-x-3 mt-4">
//               <button className="px-4 py-2 border rounded" onClick={() => setEditName(user.fullName)}>
//                 Cancel
//               </button>
//               <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSaveChanges}>
//                 {loading ? "Saving..." : "Save Changes"}
//               </button>
//             </div>

//             <h3 className="text-lg font-semibold mt-6">Change Password</h3>
//             <input type="password" placeholder="Enter Old Password" className="w-full border rounded-md p-2 mt-2" />
//             <input type="password" placeholder="Type New Password" className="w-full border rounded-md p-2 mt-2" />
//             <input type="password" placeholder="Retype New Password" className="w-full border rounded-md p-2 mt-2" />
//             <div className="flex justify-end space-x-3 mt-4">
//               <button className="px-4 py-2 border rounded">Cancel</button>
//               <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handlePasswordUpdate}>
//                 {loading ? "Updating..." : "Update Password"}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import Profile from "../profile/profile";

// export default function ProfilePage() {
//   return (
//     <div style={styles.container}>
//       <h1>User Profile</h1>
//       <Profile />
//     </div>
//   );
// }

// // ✅ Styles
// const styles = {
//   container: { padding: "20px", fontFamily: "Arial" },
// };