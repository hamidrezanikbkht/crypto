"use client";
import React from "react";
import Hedeartop from "./hedeartop";
import Hedearbootm from "./hedearbootm";
export default function Hedear() {
  return (
    <header className="w-full  flex-wrap bg-white fixed top-0 left-0 py-2 items-center shadow z-50  hidden lg:flex">
      <Hedeartop />
      <Hedearbootm />
    </header>
  );
}
