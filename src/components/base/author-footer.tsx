import React from "react";
import { ProfileImage } from "./profile-image";
import { config } from "../../../config";

export const AuthorFooter = () => (
  <div className="flex space-x-3 items-center py-6 my-2 border-t">
    <ProfileImage size={56} />
    <div>
      <div className="font-semibold">{config.name}</div>
      <div>Developer from 🇨🇳</div>
      <div>
        <a
          className="inline-flex text-gray-500 transition-colors duration-200 hover:text-gray-600"
          href="https://twitter.com/solirpa7"
        >
          <span>@solirpa</span>
        </a>
      </div>
    </div>
  </div>
);
