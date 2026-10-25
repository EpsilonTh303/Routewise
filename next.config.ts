import type { NextConfig } from "next";

const staticExport=process.env.NEXT_PUBLIC_STATIC_EXPORT==='true';
const basePath=staticExport?(process.env.NEXT_PUBLIC_BASE_PATH??''):'';
if(basePath&&!/^\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(basePath)) throw new Error('Invalid static base path');
const nextConfig: NextConfig = {
  output: staticExport?"export":"standalone",
  basePath,
  ...(staticExport?{pageExtensions:['tsx','jsx'],trailingSlash:true,images:{unoptimized:true},typescript:{tsconfigPath:'tsconfig.pages.json'}}:{}),
  reactStrictMode: false,
};

export default nextConfig;
