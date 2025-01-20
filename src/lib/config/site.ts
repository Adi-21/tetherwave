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
        TetherWave: "0xEe0Cbfb7cb321E9Ec7e61a03DF9a4D36180ca714",
        Royalty: "0xd39B729993050dc5160A5F78fe1cDC566361ce9A",
    }
}

export type SiteConfig = typeof siteConfig
