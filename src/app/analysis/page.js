'use client';

import NavbarWrapper from '../public_components/NavbarWrapper';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import gradbg from '../../../public/images/grad-bg.png';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCookie } from 'cookies-next';
import ImproveText from "../public_components/ImproveText";
import axiosInstance from '@/utils/axios';


function AnalysisContent() {
  const searchParams = useSearchParams();
  const [statement, setStatement] = useState(
    searchParams.get('statement') ||
    'The Earth is flat, a vast and endless plane stretching beyond the horizons, uncurved and unwavering, defying the mainstream scientific narrative.'
  );
  const router = useRouter();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [classification, setClassification] = useState(true);
  const [accuracy_rating, setAccuracyRating] = useState(10);
  const [result, setResult] = useState();

  useEffect(() => {
    const statementParam = searchParams.get('statement');
    if (statementParam) {
      setStatement(statementParam);
    }
    const formBody = {
      text: statementParam
    };
    axiosInstance.post("/statements/validate", formBody).then((res) => {
      setResult(res.data);
    })
  }, [searchParams]);

  const handleNewStatement = () => {
    const token = getCookie('access_token');
    router.push(token ? '/dashboard/' : '/signup/');
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden relative p-4">
      {/* Background Image */}
      <div className="absolute bottom-0 -z-10 -mb-[100px] lg:-mb-[186px] right-1/2 lg:right-0 translate-x-1/2 lg:translate-x-0">
        <Image src={gradbg} alt="Background gradient" priority />
      </div>

      <NavbarWrapper />
      <main className="flex flex-col pt-4 max-w-7xl mx-auto w-full h-full overflow-y-auto relative">
        <div className="mb-8">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">STATEMENT</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="flex justify-between items-start mb-4">

            <div className="relative w-full justify-center">
              <div className="flex justify-between items-start bg-gray-100/50 my-3 p-4 rounded-lg w-full">
                <div className="flex-1">
                  <svg className="w-6 h-6 text-green-800 mb-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-700 italic ml-8">{statement}</p>
                </div>
                <div className="relative flex-shrink-0 ml-4 flex justify-end" style={{ width: '80px' }}>
                  <button
                    onClick={() => setIsShareOpen(!isShareOpen)}
                    className="w-[38.4px] h-[38.4px] flex items-center justify-center rounded-full bg-white shadow-[0px_5px_13px_0px_rgba(92,103,141,0.12)]"
                  >
                    <svg
                      className="w-[22.4px] h-[22.4px]"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M15 6.66667C16.3807 6.66667 17.5 5.54738 17.5 4.16667C17.5 2.78596 16.3807 1.66667 15 1.66667C13.6193 1.66667 12.5 2.78596 12.5 4.16667C12.5 5.54738 13.6193 6.66667 15 6.66667Z" stroke="#8c8c8c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 12.5C6.38071 12.5 7.5 11.3807 7.5 10C7.5 8.61929 6.38071 7.5 5 7.5C3.61929 7.5 2.5 8.61929 2.5 10C2.5 11.3807 3.61929 12.5 5 12.5Z" stroke="#8c8c8c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 18.3333C16.3807 18.3333 17.5 17.214 17.5 15.8333C17.5 14.4526 16.3807 13.3333 15 13.3333C13.6193 13.3333 12.5 14.4526 12.5 15.8333C12.5 17.214 13.6193 18.3333 15 18.3333Z" stroke="#8c8c8c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7.15833 11.2583L12.85 14.575" stroke="#8c8c8c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12.8417 5.425L7.15833 8.74167" stroke="#8c8c8c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {isShareOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                          Share
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <ImproveText
              statement={statement}
              setStatement={setStatement}
            />
            <button className="px-6 py-2 border-[1.5px] border-[#D6D6D8] rounded hover:bg-gray-100 active:bg-gray-200 transition-colors">
              Summarize
            </button>
            <button className="px-8 py-2 bg-green-800 text-white rounded ml-auto hover:bg-green-700 active:bg-green-900 transition-colors">
              Convert To Fact →
            </button>
          </div>

          <div className="">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">ANALYSIS</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <span className={`inline-block px-1.5 py-.5 text-sm border mt-6 rounded mb-3 font-bold ${classification
              ? 'border-green-900 text-green-900 bg-[#EDF9EA]'
              : 'border-[#FA4807] text-[#FA4807] bg-[#FFEBE3]'
              }`}>
              CLASSIFICATION: {result?.fact_check?.classification}
            </span>

            <p className="text-gray-700 mb-6">
              {result?.fact_check?.reason}
            </p>

            <span className={`inline-block px-1.5 py-.5 text-sm border rounded mb-3 mt-7 font-bold ${accuracy_rating >= 6
              ? 'border-green-900 text-green-900 bg-[#EDF9EA]'
              : 'border-[#FA4807] text-[#FA4807] bg-[#FFEBE3]'
              }`}>
              ACCURACY RATING: {result?.fact_check?.confidence_score * 10}/10
            </span>

            <p className="text-gray-700">
              The rating reflects that the statement is almost entirely inaccurate based on established scientific knowledge and observations.
            </p>
          </div>
        </div>

        <div className="fixed bottom-0 right-0 p-4 w-full">
          <div className="max-w-7xl mx-auto flex justify-end mb-8">
            <button
              onClick={handleNewStatement}
              className="px-8 py-3 bg-green-800 text-white rounded hover:bg-green-900 transition-colors"
            >
              + New Statement
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnalysisContent />
    </Suspense>
  );
}