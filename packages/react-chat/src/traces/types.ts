import { FeedbackName, useRuntime } from '@/hooks';

export type Trace = Exclude<Parameters<typeof useRuntime>[0]['traces'], undefined>[number];
