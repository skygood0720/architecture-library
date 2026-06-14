"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/lib/types";

interface Props {
  photo: Photo;
}

export default function PhotoCard({ photo }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden bg-gray-100 group aspect-square">
      {photo.thumbnailUrl ? (
        <Image
          src={photo.thumbnailUrl}
          alt={photo.title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className={`object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs">
          No image
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-end">
        <div className="w-full px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <p className="text-white text-xs font-medium truncate">{photo.title}</p>
          <p className="text-white/70 text-[10px] uppercase tracking-wider">
            {photo.category}
          </p>
        </div>
      </div>
    </div>
  );
}
