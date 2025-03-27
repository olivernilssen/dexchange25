import { Session, Break } from './schedule';

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

// Add any other processing-specific types here
export interface ConnectedSessionGroup {
  isBreak: false;
  isConnectedGroup: true;
  startTime: number;
  endTime: number;
  group: TimelineItem[];
  room: string;
  start: string;
  end: string;
  title: string;
}