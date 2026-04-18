/**
 * Construct the correct path for images based on the environment
 * In production (GitHub Pages), assets are served from /E-ommerce_shop/
 * In development, they're served from /
 */
export const getImagePath = (filename: string): string => {
  const basePath = import.meta.env.PROD ? '/E-ommerce_shop/images/' : '/images/';
  return `${basePath}${filename}`;
};
