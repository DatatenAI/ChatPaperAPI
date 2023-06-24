/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        swcPlugins: [
            [
                'next-superjson-plugin',
                {
                    excluded: [],
                },
            ],
        ],
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });
        config.externals = [...config.externals, "canvas"];
        return config;
    },

}

module.exports = nextConfig
