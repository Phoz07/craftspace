"use client";

import { ChevronsLeftRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatioClass?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "สภาพห้องเปล่าก่อนตกแต่ง",
  afterAlt = "ผลงานบิวท์อินตกแต่งสมบูรณ์สไตล์ Japandi",
  beforeLabel = "BEFORE (ห้องเปล่า)",
  afterLabel = "AFTER (งานบิวท์อิน)",
  aspectRatioClass = "aspect-[4/3] sm:aspect-[16/9]",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    window.addEventListener("resize", updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handleMove(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already released
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPosition((prev) => Math.max(prev - 5, 0));
    } else if (e.key === "ArrowRight") {
      setSliderPosition((prev) => Math.min(prev + 5, 100));
    }
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-label="Before and After Comparison"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`relative w-full ${aspectRatioClass} rounded-2xl sm:rounded-3xl overflow-hidden select-none touch-pan-y cursor-ew-resize border border-[#EAE4DA] shadow-xl focus:outline-none focus:ring-2 focus:ring-[#8F653B] group`}
    >
      {/* After Image (Background full layer) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={afterImage}
          alt={afterAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-full bg-[#1F1D1A]/80 backdrop-blur-md text-[#FBF9F5] text-xs font-semibold tracking-wider border border-white/20 shadow-md">
          {afterLabel}
        </div>
      </div>

      {/* Before Image (Clipped overlay layer) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="relative w-full h-full" style={{ minWidth: "100%" }}>
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              width: containerWidth ? `${containerWidth}px` : "100%",
            }}
          >
            <Image
              src={beforeImage}
              alt={beforeAlt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
              className="object-cover w-full h-full grayscale-[30%] brightness-[90%]"
            />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-full bg-[#1F1D1A]/80 backdrop-blur-md text-[#FBF9F5] text-xs font-semibold tracking-wider border border-white/20 shadow-md">
          {beforeLabel}
        </div>
      </div>

      {/* Divider Line & Draggable Handle */}
      <div
        className="absolute top-0 bottom-0 z-20 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#1F1D1A] flex items-center justify-center shadow-2xl border-2 border-[#8F653B] hover:scale-110 active:scale-95 transition-transform"
        >
          <ChevronsLeftRight className="w-5 h-5 text-[#8F653B]" />
        </div>
      </div>

      {/* Top Helper Tooltip on Hover */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium tracking-wide">
          ลากเพื่อเปรียบเทียบ Before & After
        </span>
      </div>
    </div>
  );
}
