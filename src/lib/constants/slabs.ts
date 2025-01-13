export const SLABS = [
  { title: 'FFR1', description: 'Royalty Slab 1', bg: "bg-gradient dark:bg-gradient-dark" },
  { title: 'FFR2', description: 'Royalty Slab 2', bg: "bg-gradient dark:bg-gradient-dark" },
  { title: 'FFR3', description: 'Royalty Slab 3', bg: "bg-gradient dark:bg-gradient-dark" },
  { title: 'FFR4', description: 'Royalty Slab 4', bg: "bg-gradient dark:bg-gradient-dark" },
] as const;

export type SlabType = typeof SLABS[number]; 