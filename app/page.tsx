import Link from "next/link";
import { getAllPhotos } from "@/lib/photos";
import PhotoGrid from "@/components/PhotoGrid";

export default function HomePage() {
  const allPhotos = getAllPhotos();
  const featured = allPhotos.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-gray-200 py-16 px-4 text-center">
        <h1 className="text-3xl font-bold tracking-widest uppercase mb-3">
          Architecture Library
        </h1>
        <p className="text-sm text-gray-500 mb-1">建築作品の総合ライブラリー</p>
        <p className="text-xs text-gray-400">Japan · UK · Project</p>
      </section>

      {/* Category links */}
      <section className="max-w-5xl mx-auto px-4 py-8 flex flex-wrap gap-4 justify-center">
        {[
          { label: "Japan", href: "/photo/japan" },
          { label: "UK", href: "/photo/uk" },
          { label: "Project", href: "/photo/project" },
          { label: "Designer", href: "/designer" },
          { label: "Book", href: "/book" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-6 py-2 border border-gray-300 text-sm tracking-widest uppercase hover:bg-gray-50 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </section>

      {/* Latest photos */}
      {featured.length > 0 ? (
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <h2 className="text-xs tracking-widest uppercase text-gray-400 mb-6 border-b border-gray-100 pb-2">
            Latest
          </h2>
          <PhotoGrid photos={featured} />
          <div className="text-center mt-8">
            <Link
              href="/photo"
              className="text-xs tracking-widest uppercase border-b border-black hover:opacity-60"
            >
              View All Photos →
            </Link>
          </div>
        </section>
      ) : (
        <section className="max-w-5xl mx-auto px-4 pb-16 text-center text-gray-400 py-24">
          <p className="text-sm">
            Google Drive に写真をアップロードすると、ここに表示されます。
          </p>
        </section>
      )}
    </div>
  );
}
