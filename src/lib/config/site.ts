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
        USDT: "0xe6Ad72C499ce626b10De645E25BbAb40C5A34C9f",
        TetherWave: "0x57546c747F715ad15b83b1fA9c81cA59c997901E",
        Royalty: "0x5e5A1F17d6E297E0bc60862F6537B3f1e2Be1779",
    }
}

export type SiteConfig = typeof siteConfig
