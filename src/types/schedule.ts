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
  room?: string;      // Now optional, not required
}

export interface Track {
  room: string;
  sessions: Session[];
}

// Move Break interface here from sessionProcessing.ts
export interface Break {
  title: string;
  start: string;
  end: string;
}

export interface Day {
  date: string;
  start: string;
  end: string;
  breaks?: Break[]; // Now references the Break interface
  commonSessions?: Session[];
  tracks?: Track[];
}

export interface ScheduleData {
  schedule: {
    days: Day[];
  };
}