const designers = [
  { name: "隈研吾", nameEn: "Kengo Kuma", category: "Japan" },
  { name: "安藤忠雄", nameEn: "Tadao Ando", category: "Japan" },
  { name: "内藤廣", nameEn: "Hiroshi Naito", category: "Japan" },
  { name: "中村拓志", nameEn: "Hiroshi Nakamura", category: "Japan" },
  { name: "Norman Foster", nameEn: "Norman Foster", category: "UK" },
  { name: "Renzo Piano", nameEn: "Renzo Piano", category: "International" },
  { name: "Zaha Hadid", nameEn: "Zaha Hadid", category: "International" },
];

export default function DesignerPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-xs tracking-widest uppercase text-gray-400 mb-8 border-b border-gray-100 pb-2">
        Designer
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {designers.map((d) => (
          <div
            key={d.nameEn}
            className="border border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="aspect-square bg-gray-100 mb-3 flex items-center justify-center text-gray-300 text-xs">
              Photo
            </div>
            <p className="text-sm font-medium">{d.name}</p>
            <p className="text-xs text-gray-400">{d.nameEn}</p>
            <p className="text-[10px] text-gray-300 uppercase tracking-wider mt-1">
              {d.category}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
