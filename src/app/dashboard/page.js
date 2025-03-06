"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from 'cookies-next';
import { jwtDecode } from "jwt-decode";
import NavbarWrapper from "../public_components/NavbarWrapper";
import WaveformPlayer from "../public_components/WaveformPlayer"; 
import Image from "next/image";
import gradbg from "../../../public/images/grad-bg.png";
import { withAuthProtection } from "../utils/withAuthProtection";
import ImproveText from "../public_components/ImproveText";

function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isExternalClaims, setIsExternalClaims] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [statement, setStatement] = useState("");
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(null);
  const maxCharacters = 500;
  const warningThreshold = 450;

  useEffect(() => {
    document.title = "Dashboard | ChirpChecker";

    const checkAuth = () => {
      const token = getCookie("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setCurrentTime(Math.floor(new Date().getTime() / 1000));

        setTimeout(() => {
          if (decoded.exp < currentTime) {
            router.replace("/login");
            return;
          }

          if (decoded.role !== "end_user") {
            router.replace("/login");
            return;
          }

          setIsLoading(false);
        }, 10);
      } catch (error) {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router, currentTime]); 

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment({
        file,
        type: file.type.startsWith("image/") ? "image" : "audio",
        url: URL.createObjectURL(file),
      });
    }
  };

  const removeAttachment = () => {
    if (attachment?.url) {
      URL.revokeObjectURL(attachment.url);
    }
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleVerify = () => {
    const params = new URLSearchParams();
    params.set('statement', statement);
    router.push(`/analysis?${params.toString()}`);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden relative p-4">
      <div className="absolute bottom-0 -z-10 -mb-[100px] lg:-mb-[186px] right-1/2 lg:right-0 translate-x-1/2 lg:translate-x-0">
        <Image src={gradbg} alt="Background gradient" priority />
      </div>

      <NavbarWrapper />

      <main className="flex-1 flex flex-col items-center justify-end px-4 sm:px-12 lg:px-24 pb-[3.5rem]">
        <div className="text-center">
          <h1 className="headline-text">Hi User, <br />Check before you Chirp.</h1>
        </div>

        <div className="submit-box mt-6 w-full max-w-5xl bg-white p-4 sm:p-4">
          <textarea
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            placeholder="Type or paste a statement to verify or fact-check"
            className="w-full p-4 textarea-input-text resize-none focus:outline-none focus:ring-1 focus:ring-gray-100 focus:bg-gray-50 focus:rounded-lg"
            rows="6"
            maxLength={550}
            style={{
              wordWrap: "break-word",
              overflowWrap: "break-word", 
              whiteSpace: "pre-wrap",
              resize: "vertical",
            }}
          ></textarea>

          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center space-x-2 relative">
              <span className={`${!isExternalClaims ? "toggle-text-on" : "toggle-text-off"}`}>
                My Statement
              </span>

              <button
                onClick={() => setIsExternalClaims(!isExternalClaims)}
                className="relative w-8 h-5 flex items-center bg-green-900 rounded-full p-1 transition duration-300"
              >
                <div
                  className={`absolute left-1 w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    isExternalClaims ? "translate-x-3" : "translate-x-0"
                  }`}
                ></div>
              </button>

              <div className="relative flex items-center">
                <span className={`${isExternalClaims ? "toggle-text-on" : "toggle-text-off"}`}>
                  External Claims
                </span>

                <button
                  onClick={() => setShowTooltip(!showTooltip)}
                  className="ml-2 border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold blue-600 hover:bg-gray-100 hover:border-gray-400 transition"
                  title="Click to learn more"
                >
                  ?
                </button>

                {showTooltip && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-6 bg-blue-600 text-white text-xs rounded-md px-3 py-2 w-64 shadow-lg font-semibold text-center">
                    Your own statements affect your credibility score. External claims don&apos;t.
                  </div>
                )}
              </div>
            </div>

            <span
              className={`text-sm ${
                statement.length >= warningThreshold ? "text-red-700 font-bold" : "text-gray-500"
              }`}
            >
              {statement.length}/{maxCharacters}
              <span className="hidden md:inline">
                {" "}
                [{maxCharacters - statement.length > 0 ? maxCharacters - statement.length : `-${statement.length - maxCharacters}`} left]
              </span>
            </span>
          </div>

          {statement.length >= warningThreshold && (
            <div className="mt-2 bg-[#f8e6e6] text-[#B80003] p-3 rounded-md text-sm sm:text-base font-inter leading-[18px] tracking-tight font-medium">
              Upgrade to premium for long-text support.
            </div>
          )}

          {attachment && (
            <div className="relative mt-4 inline-block">
              {attachment.type === "audio" ? (
                <WaveformPlayer audioUrl={attachment.url} onRemove={removeAttachment} />
              ) : (
                <Image
                  src={attachment.url}
                  alt="Attached image"
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
              )}
              <button
                onClick={removeAttachment}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 leading-none"
              >
                <span className="inline-block translate-y-[-1px]">×</span>
              </button>
            </div>
          )}

          <div className="mt-6 mb-2 flex justify-between items-center">
            <ImproveText
              statement={statement}
              setStatement={setStatement}
              isExternalClaims={isExternalClaims}
            />



            <div className="flex items-center space-x-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,audio/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={!!attachment}
                className={`text-gray-600 hover:text-blue-600 flex items-center gap-2 ${attachment ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M13.2071 7.2929C13.5976 7.68342 13.5976 8.31659 13.2071 8.70715L8.2071 13.7071C7.81658 14.0976 7.18342 14.0976 6.79289 13.7071C6.40237 13.3165 6.40237 12.6834 6.79289 12.2928L11.7929 7.2929C12.1834 6.90237 12.8166 6.90237 13.2071 7.2929Z" fill="#204618"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.2929 2.33705C11.7423 -0.11235 15.7136 -0.11235 18.163 2.33705C20.6124 4.78645 20.6124 8.75775 18.163 11.2071L15.7071 13.663C15.3166 14.0535 14.6834 14.0535 14.2929 13.663C13.9024 13.2725 13.9024 12.6393 14.2929 12.2488L16.7487 9.79285C18.4171 8.12455 18.4171 5.41962 16.7487 3.75127C15.0804 2.08292 12.3755 2.08292 10.7071 3.75127L8.2513 6.20711C7.86074 6.59764 7.22757 6.59764 6.83705 6.20711C6.44652 5.81659 6.44652 5.18342 6.83705 4.7929L9.2929 2.33705ZM5.70711 7.33705C6.09763 7.72758 6.09763 8.36074 5.70711 8.75125L3.25126 11.2071C1.58291 12.8754 1.58291 15.5803 3.25126 17.2487C4.91961 18.917 7.62454 18.917 9.2929 17.2487L11.7487 14.7929C12.1393 14.4024 12.7724 14.4024 13.1629 14.7929C13.5535 15.1835 13.5535 15.8165 13.1629 16.2071L10.7071 18.663C8.2577 21.1124 4.28645 21.1124 1.83705 18.663C-0.61235 16.2136 -0.61235 12.2423 1.83705 9.79285L4.29289 7.33705C4.68342 6.94653 5.31658 6.94653 5.70711 7.33705Z" fill="#204618"/>
                </svg>
              </button>
              <button 
                onClick={handleVerify} 
                className="solid-button"
              >
                Verify →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuthProtection(DashboardPage, "protected");