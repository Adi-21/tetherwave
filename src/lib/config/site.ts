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
        TetherWave: "0xa9e64ae04f1451afb7fec2f19df7d5159d8eb774",
        // TetherWave: "0xad7284Bf6fB1c725a7500C51b71847fEf2D2d17C",
        Royalty: "0x0eCb9FfA18127d65472a9Ff91c8A8913940a3CE0",
    }
}

export type SiteConfig = typeof siteConfig
