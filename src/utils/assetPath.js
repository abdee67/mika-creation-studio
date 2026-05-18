// utils/assetPath.js

export const assetPath = (path) => {
  const url = import.meta.env.BASE_URL;
  if (!url || url === "/") {
    return path;
  }
  const cleanUrl = url.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");
  return `${cleanUrl}/${cleanPath}`;
};
