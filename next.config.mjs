/** @type {import('next').NextConfig} */
const OLD_TO_BHS_CATEGORY = {
  music: "muzika",
  photo_video: "fotografija",
  wedding_salon: "svadbeni-salon",
  cakes: "torte",
  decoration: "dekoracija",
  transport: "limuzine",
  beauty: "ljepota",
};

const nextConfig = {
  async redirects() {
    const categoryRedirects = Object.entries(OLD_TO_BHS_CATEGORY).map(
      ([old, bhs]) => ({
        source: `/kategorija/${old}`,
        destination: `/kategorija/${bhs}`,
        permanent: true,
      })
    );
    return [
      { source: "/dodaj-biznis", destination: "/postanite-partner", permanent: true },
      ...categoryRedirects,
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
