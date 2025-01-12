export const truncateAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
}
