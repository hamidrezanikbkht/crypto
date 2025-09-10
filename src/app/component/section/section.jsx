"use client";
import React, { useContext, useEffect, useState } from "react";
import Mycontext from "@/app/contextApi/contextapi";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function generateFakeData() {
  const data = [];
  let base = 100;
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.5) * 5;
    base = Math.max(base + change, 10);
    data.push({ day: i + 1, price: parseFloat(base.toFixed(2)) });
  }
  return data;
}

function normalizeData(data) {
  const prices = data.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  return data.map((d) => ({
    day: d.day,
    price: ((d.price - min) / range) * 100,
  }));
}

export default function Section() {
  const { fetchmarket } = useContext(Mycontext);
  const [dailyPrices, setDailyPrices] = useState({});
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoinId, setSelectedCoinId] = useState(null);

  useEffect(() => {
    async function fetchDailyData() {
      setLoading(true);
      try {
        const coins = fetchmarket.slice(0, 10);
        const proxyBase = "https://api.allorigins.win/get?url=";

        const promises = coins.map(async (coin) => {
          const targetUrl = encodeURIComponent(
            `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=30&interval=daily`
          );

          try {
            const res = await fetch(proxyBase + targetUrl);
            if (!res.ok) throw new Error(`خطا در دریافت داده ${coin.id}`);

            const proxyData = await res.json();
            const data = JSON.parse(proxyData.contents);

            if (
              !data ||
              !data.prices ||
              !Array.isArray(data.prices) ||
              data.prices.length === 0
            ) {
              return { id: coin.id, prices: generateFakeData() };
            }

            return {
              id: coin.id,
              prices: data.prices.map((item, i) => ({
                day: i + 1,
                price: item[1],
              })),
            };
          } catch (error) {
            return { id: coin.id, prices: generateFakeData() };
          }
        });

        const results = await Promise.all(promises);
        const formatted = {};
        results.forEach((item) => {
          formatted[item.id] = item.prices;
        });
        setDailyPrices(formatted);
      } catch (err) {
        console.error("خطا در گرفتن داده روزانه:", err.message);
      } finally {
        setLoading(false);
      }
    }

    if (fetchmarket.length > 0) {
      fetchDailyData();
    }
  }, [fetchmarket]);

  function getLineColor(change) {
    if (change > 0) return "#14d199";
    else if (change < 0) return "#ff4d4f";
    else return "#999999";
  }

  function getNormalizedData(coinId) {
    const raw = dailyPrices[coinId] || generateFakeData();
    return normalizeData(raw);
  }

  function openModal(coinId) {
    setSelectedCoinId(coinId);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedCoinId(null);
  }

  // پیدا کردن نام ارز برای نمایش در مودال
  const selectedCoin = fetchmarket.find((c) => c.id === selectedCoinId);

  return (
    <>
      <div className="w-[95%] flex justify-center flex-wrap mt-16 lg:mt-32 border border-[#e5eaf2]">
        <div className="w-full  flex flex-wrap  lg:justify-between bg-gray-100 text-sm font-bold text-gray-700 px-1 py-3 border-b border-[#e5eaf2]">
          <div className="w-6 text-center ">#</div>
          <div className=" lg:w-44  text-center ml-5 lg:ml-0 font-iran">ارز دیجیتال</div>
          <div className="lg:w-24  text-center ml-26 lg:ml-0 font-iran">قیمت</div>
          <div className="w-32 text-center hidden lg:flex font-iran">قیمت تومانی</div>
          <div className="w-40 text-center justify-center hidden lg:flex font-iran">حجم بازار</div>
          <div className="w-36 text-center hidden lg:flex">معاملات روزانه</div>
          <div className="lg:w-24  text-center  ml-15 lg:ml-0 font-iran">روزانه</div>
          <div className="w-28 text-center  hidden lg:flex font-iran">نمودار روزانه</div>
          <div className="w-24 text-center hidden lg:flex font-iran">امکانات</div>
        </div>

        {loading && (
         <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
  <div className="w-24 h-24 rounded-full border-4 border-t-[#1aa089] border-gray-200 animate-spin"></div>
</div>
        )}

        {fetchmarket.map((val, index) => {
          const chartData = getNormalizedData(val.id);
          const lineColor = getLineColor(val.price_change_percentage_24h);

          return (
            <div
              key={val.id}
              className="w-full flex flex-wrap  justify-between  items-center px-1 lg:px-4 lg:gap-2 py-3 border-b border-[#e5eaf2] text-sm font-medium hover:bg-gray-50 transition-all"
            >
              <div className="w-6 text-center  ">{index + 1}</div>

              <div className="flex items-center gap-2 w-40  ">
                <img
                  className=" w-4 h-4 lg:w-8 lg:h-8  rounded-full  shake "
                  src={val.image}
                  alt={val.name}
                />
                <span className="font-bold">{val.name}</span>
              </div>

              <div className="lg:w-24 text-center text-green-600 ">
                ${val.current_price.toLocaleString()}
              </div>

              <div className="w-32 text-center hidden lg:flex gap-1 text-black font-iran">
                <span className="">تومان</span>
                <span className="font-iran">{Math.round(val.current_price * 88000).toLocaleString()}</span>
              </div>

              <div className="w-40 text-center hidden lg:flex text-gray-700 font-iran">
                {val.market_cap.toLocaleString()}
              </div>

              <div className="w-36 text-center hidden lg:flex text-gray-700 font-iran">
                {val.total_volume.toLocaleString()}
              </div>

              <div
                className={`w-24 text-center lg:border rounded-3xl font-iran ${
                  val.price_change_percentage_24h >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {val.price_change_percentage_24h?.toFixed(2)}%
              </div>

              <div className="w-28 h-20  items-center hidden lg:flex">
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={chartData}>
                    <YAxis
                      domain={[
                        "dataMin - (dataMax - dataMin) * 0.1",
                        "dataMax + (dataMax - dataMin) * 0.1",
                      ]}
                      hide={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={lineColor}
                      strokeWidth={3}
                      dot={{ r: 2, strokeWidth: 1, stroke: lineColor }}
                      isAnimationActive={false}
                      strokeLinecap="round"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="w-24 text-center">
                <button
                  onClick={() => openModal(val.id)}
                  className="text-white bg-indigo-500 hover:bg-indigo-600 px-2 py-1 rounded cursor-pointer font-iran"
                >
                  امکانات
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* مودال */}
      {modalOpen && selectedCoinId && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-60 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-4xl w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-extrabold mb-6 text-center text-indigo-700">
              نمودار قیمت ارز دیجیتال{" "}
              <span className="text-indigo-900">{selectedCoin?.name}</span>
            </h2>

            <div style={{ width: "100%", height: 450 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getNormalizedData(selectedCoinId)}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity={1} />
                    </linearGradient>
                    <filter id="shadow" height="130%">
                      <feDropShadow
                        dx="0"
                        dy="0"
                        stdDeviation="4"
                        floodColor="#7c3aed"
                        floodOpacity="0.4"
                      />
                    </filter>
                  </defs>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
                  <XAxis
                    dataKey="day"
                    label={{
                      value: "روز",
                      position: "insideBottomRight",
                      offset: -5,
                      fill: "#4f46e5",
                      fontWeight: "bold",
                    }}
                    tickCount={10}
                    stroke="#4f46e5"
                    tick={{ fontWeight: "bold", fill: "#4f46e5" }}
                    axisLine={{ stroke: "#4f46e5" }}
                  />
                  <YAxis
                    label={{
                      value: "قیمت (نرمال شده)",
                      angle: -90,
                      position: "insideLeft",
                      offset: 10,
                      fontWeight: "bold",
                      fill: "#4f46e5",
                    }}
                    stroke="#4f46e5"
                    tick={{ fontWeight: "bold", fill: "#4f46e5" }}
                    axisLine={{ stroke: "#4f46e5" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f3f4f6",
                      borderRadius: "10px",
                      border: "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                    itemStyle={{ color: "#4f46e5", fontWeight: "bold" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="url(#lineGradient)"
                    strokeWidth={4}
                    dot={{
                      r: 6,
                      strokeWidth: 3,
                      stroke: "#a78bfa",
                      fill: "#c4b5fd",
                      opacity: 0.8,
                      filter: "drop-shadow(0 0 2px rgba(124, 58, 237, 0.5))",
                    }}
                    activeDot={{
                      r: 8,
                      strokeWidth: 4,
                      stroke: "#7c3aed",
                      fill: "#a78bfa",
                      opacity: 1,
                    }}
                    isAnimationActive={true}
                    animationDuration={1500}
                    strokeLinecap="round"
                    filter="url(#shadow)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* اسم ارز زیر نمودار */}
            <div className="text-center mt-6 text-lg font-semibold text-indigo-700">
              {selectedCoin?.name}
            </div>

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-indigo-500 hover:bg-indigo-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow-lg transition-colors"
              aria-label="بستن مودال"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
