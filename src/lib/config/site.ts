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
        Royalty: "0xc222e5f03f90F1eE7a97af53F0CfDe0CD05c7018",
    }
}

export type SiteConfig = typeof siteConfig
