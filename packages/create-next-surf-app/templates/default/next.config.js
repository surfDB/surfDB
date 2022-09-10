/** @type {import('next').NextConfig} */
const { SurfClient, SurfRealtime } = require("@surfdb/client-sdk");

const surfClient = new SurfClient({
  client: "http://localhost:3000",
});

const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    surfClient,
  },
};

module.exports = nextConfig;
