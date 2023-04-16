export interface Boss {
    name: string;
    image: string;
}

export interface Path {
    pathId: number;
    prevPathId: number | null;
    prevBosses: string[];
    bosses: Boss[];
}