'use client';

import Image from 'next/image';
import logo from '../../../public/images/logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-8 border-t border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center mb-6 md:mb-0">
            <Image 
              src={logo}
              alt="ChirpChecker Logo"
              width={170}
              height={30}
              className="h-[28px] md:h-[calc(20px_+_(16_*_(100vw_-_768px)_/_432))] lg:h-[36px] w-auto"
            />
          </div>

          {/* Links Section */}
          <div className="flex flex-row justify-between md:flex-row gap-4 md:gap-8 w-full md:w-auto">
            <a 
              href="/privacy/"
              className="text-green-800 text-center font-inter text-[16px] md:text-[18px] font-[500] leading-[32px] tracking-[-0.4px] hover:text-green-800"
            >
              Privacy Policy
            </a>
            <a
              href="/terms/"
              className="text-green-800 text-center font-inter text-[16px] md:text-[18px] font-[500] leading-[32px] tracking-[-0.4px] hover:text-green-800"
            >
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
