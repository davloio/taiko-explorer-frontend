/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql',
  },
}

module.exports = nextConfig