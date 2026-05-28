"use client";

import { useLayoutEffect } from "react";

export function ProtectedLightTheme() {
  useLayoutEffect(() => {
    const applyLightTheme = () => {
      const root = document.documentElement;
      const body = document.body;

      if (root.classList.contains("dark")) {
        root.classList.remove("dark");
      }
      if (root.dataset.theme !== "light") {
        root.dataset.theme = "light";
      }
      if (root.style.colorScheme !== "light") {
        root.style.colorScheme = "light";
      }
      if (body.classList.contains("dark")) {
        body.classList.remove("dark");
      }
      if (body.dataset.theme !== "light") {
        body.dataset.theme = "light";
      }
      if (body.style.colorScheme !== "light") {
        body.style.colorScheme = "light";
      }
    };

    applyLightTheme();

    const observer = new MutationObserver(applyLightTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
