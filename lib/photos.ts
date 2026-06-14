import photosData from "@/data/photos.json";
import type { Photo, PhotoCategory, PhotosData } from "./types";

const data = photosData as PhotosData;

export function getAllPhotos(): Photo[] {
  return data.photos;
}

export function getPhotosByCategory(category: PhotoCategory): Photo[] {
  return data.photos.filter((p) => p.category === category);
}

export function getPhoto(id: string): Photo | undefined {
  return data.photos.find((p) => p.id === id);
}

export function getUpdatedAt(): string {
  return data.updatedAt;
}
