export interface Session {
  id?: string;
  title: string;
  start: string;
  end: string;
  speaker?: string;
  kind?: string;
  description?: string;
  ingress?: string;
  tag?: string;
  teams?: string;    // URL to Teams meeting
  recording?: string; // URL to session recording
  room: string;      // Now required, not optional
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

export interface Break {
  title: string;
  start: string;
  end: string;
}

export type TimelineItem = (
  | { isBreak: false; isCommon?: boolean; room: string } & Session
  | { isBreak: true } & Break
) & {
  startTime: number;
  endTime: number;
};

export type TimeBlock = {
  time: number;
  displayTime: string;
  items: any[];
};