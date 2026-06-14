import type { Photo } from "@/lib/types";
import PhotoCard from "./PhotoCard";

interface Props {
  photos: Photo[];
}

export default function PhotoGrid({ photos }: Props) {
  if (photos.length === 0) {
    return (
      <div className="text-center text-gray-400 py-24 text-sm">
        写真がありません。Google Drive にアップロードしてください。
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
}
