export const siteConfig = {
    name: "Tether Waves",
    description: "Building Networks, Growing Wealth Together",
    mainNav: [
        {
            title: "Home",
            href: "/",
        },
        {
            title: "Dashboard",
            href: "/dashboard",
        },
    ],
    links: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
    },
    contracts: {
        USDT: "0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3",
        TetherWave: "0xe6Ad72C499ce626b10De645E25BbAb40C5A34C9f",
        Royalty: "0xb93d3DAC527c6382B7f000E71b9b32f02a79a563",
    }
}

export type SiteConfig = typeof siteConfig
