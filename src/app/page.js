'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import NavbarWrapper from './public_components/NavbarWrapper';
import Footer from './public_components/Footer';
import Image from 'next/image';
import bgHero from '../../public/images/bg-hero2.png';
import lpbias from '../../public/images/lp-bias.png';
import how1 from '../../public/images/How1.png';
import how2 from '../../public/images/How2.png';
import how3 from '../../public/images/How3.png';
import how4 from '../../public/images/How4.png';
import uimock from '../../public/images/uimock.png';
import Link from 'next/link';
import { getCookie } from 'cookies-next';

export default function LandingPage() {

  const router = useRouter(); //

  //  Function to handle guest access
  const handleGuestAccess = () => {
    router.push("/dashboard"); // 
  };
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   setIsAuthenticated(!!getCookie(''));
  // }, []);

  // const router = useRouter();

  // const handleGuestAccess = () => {
  //   router.push("/dashboard"); // Directly goes to Dashboard
  // };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar with sticky positioning and hero background */}
      <div 
        className="sticky top-0 z-50 w-full"
        style={{
          backgroundColor: '#f8f0e0',
        }}
      >
        <NavbarWrapper className="pb-12" />
      </div>
    
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="bg-gray-50 px-4 relative text-center w-full"
          style={{
            backgroundImage: `url(${bgHero.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <h1 className="text-[2.5rem] md:text-[4rem] font-inter font-normal text-black-1 pt-14 tracking-[-0.04em] leading-none">
            <span className="font-playfair text-[3rem] md:text-[5rem] font-family-playfair italic">Welcome to </span><span className="font-[700] green-brand">ChirpChecker</span>
          </h1>
          <p className="text-black-1 text-cc-para text-lg max-w-3xl mx-auto mb-8 mt-6">
            Ensure the credibility of your &quot;chirps&quot; before sharing them with the world. ChirpChecker helps you verify the credibility of your posts and build a reliable reputation on social media.
          </p>
          <button 
             onClick={handleGuestAccess}
            className="inline-block bg-green-brand text-white font-inter font-semibold px-12 py-4 rounded-[4px] hover:bg-green-800 transition text-[16px] sm:text-[20px]"
          >
            Continue as Guest →
          </button>
          <div className="mt-10">
            <Image
              src={uimock}
              alt="ChirpChecker UI Preview"
              width={973}
              height={445}
              priority
              className="w-[120%] md:w-[80%] mx-auto" 
            />
          </div>
        </section>


{/* ------------------------------------------------------------------------------------------------ */}
        
        
        {/* About Bias In CC Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-[800] uppercase mb-10 text-black-1">
              About Bias in <span className="text-[#327b3d]">ChirpChecker&apos;s</span> Analysis
            </h2>
            <div className="flex flex-col md:flex-row items-center mt-8 gap-8 md:gap-2">
              <div className="w-full mr-6 md:w-1/2">
                <Image 
                  src={lpbias}
                  alt="Bias Analysis Illustration"
                  className="w-[60vw] md:w-[90%] mx-auto h-auto" 
                />
              </div>
              <p className="text-cc-para md:w-1/2 text-black-1 text-lg leading-relaxed text-left">
                These tools are built on large, diverse datasets and are designed to minimize bias while delivering accurate and up-to-date assessments. <br/> <br/> Google Gemini is particularly valuable for current events, ensuring that the most relevant information is used in real-time evaluations. <br/> <br/> We continually work to ensure that the analysis remains as objective and fair as possible.
              </p>
            </div>
          </div>
        </section>



        {/* ------------------------------------------------------------------------------------------------ */}

        {/* How It Works Section */}
        <section className="py-16 px-6 bg-[#f8f0e0]">
          <h2 className="text-center text-3xl font-extrabold uppercase text-gray-800 mb-12">
            Here&apos;s How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-5">
               {/* ------------------------------------------------------------------------------------------------ */}
            {/* Step 1 */}
            <div className="bg-[#FAFAFA] p-8 rounded-[20px] text-center border border-[#EDEDED] max-w-[calc(100vw-2.5rem)] md:max-w-full mx-auto">
              <Image
                src={how1}
                alt="Step 1"
                width={104}
                height={104}
                className="mx-auto mb-6"
              />
              <h3 className="text-[1.25rem] font-inter font-[800] uppercase tracking-[-0.048em] text-center text-[#494949] mb-4">
                Validate Your Chirp
              </h3>
              <p className="text-[#535862] text-center font-inter text-[14px] md:text-[16px] font-[500] leading-[28px] md:leading-[32px] tracking-[-0.28px] md:tracking-[-0.32px] max-w-[480px] mx-auto">
                Before posting, check the credibility of your statement to avoid sharing misinformation.
              </p>
            </div>

               {/* ------------------------------------------------------------------------------------------------ */}

            {/* Step 2 */}
            <div className="bg-[#FAFAFA] p-8 rounded-[20px] text-center border border-[#EDEDED] max-w-[calc(100vw-2.5rem)] md:max-w-full mx-auto">
              <Image
                src={how2}
                alt="Step 2"
                width={104}
                height={104}
                className="mx-auto mb-6"
              />
              <h3 className="text-[1.25rem] font-inter font-[800] uppercase tracking-[-0.048em] text-center text-[#494949] mb-4">
                Post with Confidence
              </h3>
              <p className="text-[#535862] text-center font-inter text-[14px] md:text-[16px] font-[500] leading-[28px] md:leading-[32px] tracking-[-0.28px] md:tracking-[-0.32px] max-w-[480px] mx-auto">
                Share your validated chirps on social media, complete with a link back to the credibility analysis.
              </p>
            </div>

   {/* ------------------------------------------------------------------------------------------------ */}
            {/* Step 3 */}
            <div className="bg-[#FAFAFA] p-8 rounded-[20px] text-center border border-[#EDEDED] max-w-[calc(100vw-2.5rem)] md:max-w-full mx-auto">
              <Image
                src={how3}
                alt="Step 3"
                width={104}
                height={104}
                className="mx-auto mb-6"
              />
              <h3 className="text-[1.25rem] font-inter font-[800] uppercase tracking-[-0.048em] text-center text-[#494949] mb-4">
                Track Your Credibility
              </h3>
              <p className="text-[#535862] text-center font-inter text-[14px] md:text-[16px] font-[500] leading-[28px] md:leading-[32px] tracking-[-0.28px] md:tracking-[-0.32px] max-w-[480px] mx-auto">
                Monitor your overall credibility rating based on the chirps you share and build a trusted profile over time.
              </p>
            </div>

   {/* ------------------------------------------------------------------------------------------------ */}
            {/* Step 4 */}
            <div className="bg-[#FAFAFA] p-8 rounded-[20px] text-center border border-[#EDEDED] max-w-[calc(100vw-2.5rem)] md:max-w-full mx-auto">
              <Image
                src={how4}
                alt="Step 4"
                width={104}
                height={104}
                className="mx-auto mb-6"
              />
              <h3 className="text-[1.25rem] font-inter font-[800] uppercase tracking-[-0.048em] text-center text-[#494949] mb-4">
                Validate Others&apos; Posts
              </h3>
              <p className="text-[#535862] text-center font-inter text-[14px] md:text-[16px] font-[500] leading-[28px] md:leading-[32px] tracking-[-0.28px] md:tracking-[-0.32px] max-w-[480px] mx-auto">
                Copy and paste any post into ChirpChecker to verify its credibility and stop the spread of misinformation.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------------------------------------------ */}
      <Footer />
    </div>
  );
}
