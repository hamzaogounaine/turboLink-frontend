// next.config.js

const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();
 
const nextConfig = {
    // Your standard Next.js configuration options go here
    // For example:
    // output: 'standalone', 
};
 
module.exports = withNextIntl(nextConfig);