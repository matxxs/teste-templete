/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Use 'export' for GitHub Pages, not 'standalone'
  images: {
    unoptimized: true, // Necessary for static exports on GitHub Pages
  },
};

export default nextConfig;
