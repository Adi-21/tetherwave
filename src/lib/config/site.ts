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
        Royalty: "0x0bD838fcEAfee0B08b1B6EC5f2D63536Cb16A337",
    }
}

export type SiteConfig = typeof siteConfig
