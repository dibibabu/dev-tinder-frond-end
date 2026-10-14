import React from "react";
import { HeartIcon } from "./Icons";

const Footer = () => {
  return (
    <footer className="border-t border-base-300/60 py-6 text-center text-sm text-base-content/60">
      Made with <HeartIcon className="inline size-4 -translate-y-px text-primary" /> for
      developers · © {new Date().getFullYear()} devtinder
    </footer>
  );
};

export default Footer;
