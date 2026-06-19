// utils/assetPath.js

export const assetPath = (path) => {
  const baseUrl = import.meta.env.BASE_URL || "/";
  const cleanUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const cleanPath = path.replace(/^\//, "");
  return `${cleanUrl}${cleanPath}`;
};
