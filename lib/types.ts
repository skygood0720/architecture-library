export type PhotoCategory = "project" | "japan" | "uk";

export interface Photo {
  id: string;
  name: string;
  title: string;
  description?: string;
  category: PhotoCategory;
  driveId: string;
  webViewLink: string;
  thumbnailUrl: string;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface PhotosData {
  updatedAt: string;
  photos: Photo[];
}
