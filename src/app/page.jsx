"use client";
import React, { useEffect, useState } from "react";
import Mycontext from "./contextApi/contextapi";
import Hedear from "./component/hedear/hedear";
import Section from "./component/section/section";
import Hedearsm from "./component/hedear/hedearsm";
import Pop from "./component/hedear/pop";

export default function Page() {
    const [inpu,setinpu]=useState('')
  const [dataa, setdata] = useState(null);
  const [fetchmarket, setfetchmarket] = useState([]);
    const [pop ,setpop]=useState(false)

  useEffect(() => {
    const fetchglobal = async () => {
      const globalfetch = await fetch(
        "https://api.coingecko.com/api/v3/global"
      );
      try {
        const g = await globalfetch.json();
        setdata(g);
      } catch {
        console.log("error");
      }
    };
    fetchglobal();
  }, []);
  useEffect(() => {
    const fetchmarket = async () => {
      const globalfetch = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
      );
      try {
        const market = await globalfetch.json();
        setfetchmarket(market);
      } catch {
        console.log("error");
      }
    };
    fetchmarket();
  }, []);

  if (!dataa || !dataa.data) {
    return <div>در حال بارگذاری...</div>;
  }
  return (
    <div className="w-full flex justify-center relative flex-wrap overflow-hidden">
      <Mycontext.Provider
        value={{
          dataa,
          fetchmarket,
          setfetchmarket,
          setpop,
          pop,
          inpu,
          setinpu,
          
        }}
      >
        <Hedear />
        <Hedearsm />
        <Section />
        {pop && <Pop />}
      </Mycontext.Provider>
    </div>
  );
}
