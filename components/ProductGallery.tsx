"use client";

import { useState } from "react";

export default function ProductGallery({
  photos,
  productName,
}: {
  photos: string[];
  productName: string;
}) {
  const [current, setCurrent] = useState(0);
  const hasMultiple = photos.length > 1;

  return (
    <div>
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[current]}
          alt={`${productName} - Foto ${current + 1}`}
          className="w-full aspect-square object-contain"
        />

        {hasMultiple && (
          <>
            <button
              onClick={() => setCurrent((c) => (c === 0 ? photos.length - 1 : c - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition"
              aria-label="Foto anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrent((c) => (c === photos.length - 1 ? 0 : c + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition"
              aria-label="Foto siguiente"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition ${
                    i === current ? "bg-gray-800" : "bg-gray-400/60"
                  }`}
                  aria-label={`Ver foto ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {photos.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`aspect-square rounded-lg border-2 overflow-hidden transition ${
                i === current ? "border-gray-800" : "border-gray-200 opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-full h-full object-contain bg-gray-50" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
