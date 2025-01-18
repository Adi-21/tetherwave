export const siteConfig = {
    name: "Tether Ventures",
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
        TetherWave: "0xf8B1e537B3e4C95AeeE39e5A8E3650674241F3f7",
        Royalty: "0x4E31D7f03c4BC9189ac3813aeC62D16aC99f9782",
    }
}

export type SiteConfig = typeof siteConfig
