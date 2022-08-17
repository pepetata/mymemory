/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // set lang to pt-BR - https://melvingeorge.me/blog/set-html-lang-attribute-in-nextjs
  i18n: {
    locales: ["pt-BR"],
    defaultLocale: "pt-BR",
  },
}

module.exports = nextConfig
