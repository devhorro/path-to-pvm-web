export interface EventData {
  eventId: string;
  eventName: string;
  paths: {
    boss: string;
    killCount: number;
  }[];
  startDate: string;
  endDate: string;
}

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
