import React, { useContext } from "react";
import Mycontext from "@/app/contextApi/contextapi";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LocalMallTwoToneIcon from "@mui/icons-material/LocalMallTwoTone";
import StarBorderTwoToneIcon from "@mui/icons-material/StarBorderTwoTone";
import CameraTwoToneIcon from "@mui/icons-material/CameraTwoTone";
export default function Hedeartop() {
  const { dataa } = useContext(Mycontext);
  const usdMarketCap = dataa?.data?.total_market_cap?.usd;
  const x =
    typeof usdMarketCap === "number" ? usdMarketCap : Number(usdMarketCap);
  const formattedMarketCap = !isNaN(x) ? x.toLocaleString("en-US") : "نامشخص";

  const m = dataa.data.active_cryptocurrencies;
  const q = typeof m === "number" ? m : Number(m);
  const b = !isNaN(q) ? q.toLocaleString("en-us") : "نام مشخص ";

  const v = dataa?.data?.markets;
  const c = typeof v === "number" ? v : Number(v);
  const z = !isNaN(c) ? c.toLocaleString("en-us") : "نام مشخص ";
  const trillionValue = x / 1_000_000_000_000;
  const display = !isNaN(trillionValue)
    ? `${trillionValue.toFixed(2)} تریلیون دلار`
    : "نامشخص";

  return (
    <div className="w-full flex flex-wrap justify-around pb-2 z-50  ">
      <div className="w-1/2 flex  gap-5 px-8 ">
        <div
          className="flex
justify-center
items-center
gap-1"
        >
          <PhoneIphoneIcon sx={{ color: "#748297", fontSize: "20px" }} />
        </div>
        <div className="h-5 border-r-1 my-auto border-[#748297] "></div>
        <div
          className="flex
justify-center
items-center
gap-1"
        >
          <span className="text-[#748297] font-iran text-sm cursor-pointer">خرید</span>
          <span>
            <LocalMallTwoToneIcon sx={{ color: "#748297", fontSize: "20px" }} />
          </span>
        </div>
        <div
          className="flex
justify-center
items-center
gap-1"
        >
          <span className="text-[#748297] font-iran text-sm cursor-pointer"> پروتفلیو</span>
          <span>
            <CameraTwoToneIcon sx={{ color: "#748297", fontSize: "20px" }} />
          </span>
        </div>
        <div
          className="flex
justify-center
items-center
gap-1"
        >
          <span className="text-[#748297] font-iran text-sm cursor-pointer">تحت نظر </span>
          <span>
            <StarBorderTwoToneIcon
              sx={{ color: "#748297", fontSize: "20px" }}
            />
          </span>
        </div>
      </div>

      <div className="w-1/2  flex flex-wrap justify-end px-8 font-iran  gap-5">
        <div>
          {" "}
          <span className="font-iran text-sm">تعداد صرافی : </span>
          <span className="text-[#137870]">{z}</span>
        </div>
        <div>
          {" "}
          <span className="font-iran text-sm">ارزش بازار : </span>{" "}
          <span className="text-[#137870]">
            {!isNaN(x)
              ? `${(x / 1_000_000_000_000).toFixed(2)} تریلیون دلار`
              : "نامشخص"}
          </span>
        </div>
        <div>
          {" "}
          <span className="font-iran text-sm">تعداد ارزها : </span>
          <span className="text-[#137870]">{b}</span>
        </div>
      </div>
    </div>
  );
}
