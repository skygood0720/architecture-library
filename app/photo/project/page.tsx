import Link from "next/link";
import { getPhotosByCategory } from "@/lib/photos";
import PhotoGrid from "@/components/PhotoGrid";

export default function ProjectPage() {
  const photos = getPhotosByCategory("project");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex gap-6 border-b border-gray-200 mb-8 text-sm">
        {[
          { label: "All", href: "/photo" },
          { label: "Japan", href: "/photo/japan" },
          { label: "UK", href: "/photo/uk" },
          { label: "Project", href: "/photo/project" },
        ].map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`pb-2 tracking-widest uppercase text-xs ${
              tab.href === "/photo/project"
                ? "border-b-2 border-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <PhotoGrid photos={photos} />
    </div>
  );
}
