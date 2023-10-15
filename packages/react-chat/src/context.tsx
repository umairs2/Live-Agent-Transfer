import { FeedbackName, useRuntime } from '@/hooks';
import { createNanoEvents } from 'nanoevents';
import { createContext, useMemo } from 'react';

import { LiveAgentPlatform } from '../../../shared/live-agent-platform.enum';
import { AccountInfoTrace } from './traces/account-info.trace';
import { CalendarTrace } from './traces/calendar.trace';
import { FileUploadTrace } from './traces/file-upload.trace';
import { TalkToAgentTrace } from './traces/talk-to-agent.trace';
import { VideoTrace } from './traces/video.trace';
import { SetConfigTrace } from './traces/set-config-trace';

export interface RuntimeEvents {
  live_agent: (platform: LiveAgentPlatform) => void;
}

const key = import.meta.env.VF_DM_API_KEY;

console.log(key);

export interface RuntimeContextValue {
  runtime: ReturnType<typeof useRuntime>;
  subscribe: <K extends keyof RuntimeEvents>(event: K, callback: RuntimeEvents[K]) => void;
}

export const RuntimeContext = createContext<RuntimeContextValue | null>(null);

export const RuntimeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const emitter = useMemo(() => createNanoEvents<RuntimeEvents>(), []);

  const runtime = useRuntime({
    verify: { authorization: key },
    session: { userID: `anonymous-${Math.random()}` },
    traces: [
      AccountInfoTrace,
      FileUploadTrace,
      SetConfigTrace,
      CalendarTrace,
      VideoTrace,
      TalkToAgentTrace((platform) => emitter.emit('live_agent', platform)),
    ],
  });

  const subscribe = (event: keyof RuntimeEvents, callback: (data?: any) => void) => emitter.on(event, callback);

  return <RuntimeContext.Provider value={{ runtime, subscribe }}>{children}</RuntimeContext.Provider>;
};
