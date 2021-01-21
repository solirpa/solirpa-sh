import React from "react";
import { Nav } from "./nav";
import { ProfileImage } from "../base/profile-image";

export const Hero: React.FC = () => (
  <section className="bg-gray-100">
    <Nav />
    <div className="container">
      <div className="flex flex-col items-center my-16">
        <ProfileImage />
        <h1 className="text-4xl font-bold mt-2">Hey, I'm Solirpa!</h1>
        <p className="text-2xl text-gray-700 text-center">
          I design and build apps, and everything that comes with it.
        </p>
        <div className="max-w-sm md:mx-auto my-6 -ml-2">
          <a
            className="mx-1 md:mx-2 py-1 px-2 rounded bg-blue-200 hover:bg-blue-300 text-blue-800"
            data-splitbee-event="Open Twitter"
            href="https://twitter.com/solirpa7"
          >
            Twitter
          </a>
          <a
            className="mx-1 md:mx-2 py-1 px-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
            data-splitbee-event="Open GitHub"
            href="https://github.com/solirpa"
          >
            GitHub
          </a>
          <a
            className="mx-1 md:mx-2 py-1 px-2 rounded bg-pink-200 hover:bg-pink-300 text-pink-800"
            data-splitbee-event="RSS"
            href="/api/rss.xml"
          >
            RSS
          </a>
        </div>
      </div>
    </div>
  </section>
);
