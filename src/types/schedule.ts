export interface Session {
  title: string;
  speaker?: string;
  start: string;
  end: string;
  kind?: string;
  tag?: string;
  description?: string;
  ingress?: string;
}

export interface Track {
  room: string;
  sessions: Session[];
}

export interface Day {
  date: string;
  start: string;
  end: string;
  breaks?: {
    title: string;
    start: string;
    end: string;
  }[];
  commonSessions?: Session[];
  tracks?: Track[];
}

export interface ScheduleData {
  schedule: {
    days: Day[];
  };
}