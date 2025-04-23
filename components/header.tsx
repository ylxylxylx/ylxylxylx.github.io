/*
 * @Author: ylx
 * @Description: 
 * @Date: 2025-04-22 15:47:27
 * @LastEditors: ylx
 * @LastEditTime: 2025-04-23 10:36:37
 * @FilePath: \ylxylxylx.github.io\components\header.tsx
 */
import Link from "next/link";

const Header = () => {
  const LINKS = JSON.parse(process.env.NEXT_PUBLIC_LINKS || "[]");
  return (
    <header className="sticky top-0 left-0 z-10 w-full h-20 leading-20 flex items-center justify-between px-8 bg-white shadow">
      <Link className="text-3xl" href="/">
        {process.env.NEXT_PUBLIC_TITLE}{" "}
        <span className="text-sm hidden md:inline-block ml-2">
          {process.env.NEXT_PUBLIC_SUB_TITLE}
        </span>
        <p className="md:hidden text-sm mt-1 text-gray-500">
          {process.env.NEXT_PUBLIC_SUB_TITLE}
        </p>
      </Link>

      <ul className="flex gap-4">
        {LINKS.map((link: { label: string; src: string }) => (
          <Link
            target="_black"
            className="text-gray-500"
            href={link.src}
            key={link.label}
          >
            {link.label}
          </Link>
        ))}
        <Link className="text-gray-500" href="/about">
          About
        </Link>
        {/* <Link
          className="text-gray-500 flex items-center"
          href="/rss.xml"
          target="_blank"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 mr-1"
          >
            <path
              fillRule="evenodd"
              d="M3.75 4.5a.75.75 0 0 1 .75-.75h.75c8.284 0 15 6.716 15 15v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75C18 11.708 12.292 6 5.25 6H4.5a.75.75 0 0 1-.75-.75V4.5Zm0 6a.75.75 0 0 1 .75-.75h.75a8.25 8.25 0 0 1 8.25 8.25v.75a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75v-.75a6 6 0 0 0-6-6H4.5a.75.75 0 0 1-.75-.75v-.75Zm0 7.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
              clipRule="evenodd"
            />
          </svg>
          RSS
        </Link> */}
      </ul>
    </header>
  );
};

export default Header;
