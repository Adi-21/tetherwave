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
        Royalty: "0x901891784E3316B9f35Dac92a79c2FDC9100d9D5",
    }
}

export type SiteConfig = typeof siteConfig
