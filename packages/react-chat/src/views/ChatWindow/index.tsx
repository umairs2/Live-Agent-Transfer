import '../../styles.css';

import React, { useCallback, useContext } from 'react';

import { Assistant, ChatConfig, Listeners, PostMessage, SessionOptions, SessionStatus, useTheme } from '@/common';
import { Chat, UserResponse, SystemResponse } from '@/components';
import { RuntimeAPIProvider } from '@/contexts';
import { TurnType, UserTurnProps } from '@/types';

import LiveAgentStatus from '../../components/LiveAgentStatus';
//import { RuntimeContext } from '../../context';
import { useLiveAgent } from '../../use-live-agent.hook';
import { ChatWindowContainer } from './styled';
import { sendMessage } from './utils';
import { match } from 'ts-pattern';
import i18n from '../../utils/i18n';
import { I18nextProvider } from 'react-i18next';
import { useRuntime } from '@/hooks';

const ChatWindow: React.FC<ChatConfig & { assistant: Assistant; session: SessionOptions }> = ({
  assistant,
  versionID,
  verify,
  user,
  url,
  session,
}) => {
  // emitters
  const close = useCallback(() => sendMessage({ type: PostMessage.Type.CLOSE }), []);
  const saveSession = useCallback((session: SessionOptions) => sendMessage({ type: PostMessage.Type.SAVE_SESSION, payload: session }), []);

  //const { runtime } = useContext(RuntimeContext)!;
  const runtime = useRuntime({ versionID, verify, url, user, session, saveSession }, [verify.projectID]);

  const liveAgent = useLiveAgent(runtime);

  // listeners
  Listeners.useListenMessage(PostMessage.Type.INTERACT, ({ payload }) => runtime.interact(payload));
  Listeners.useListenMessage(PostMessage.Type.OPEN, async (): Promise<void> => {
    if (runtime.isStatus(SessionStatus.IDLE)) {
      await handleStart();
    }
  });

  const handleStart = async (): Promise<void> => {
    await runtime.launch();
  };

  const handleSend = (message: string, attachmentUrls) => {
    if (liveAgent.isEnabled) {
      liveAgent.sendUserReply(message, attachmentUrls);
    } else {
      runtime.reply(message);
    }
  };

  const closeAndEnd = useCallback((): void => {
    runtime.setStatus(SessionStatus.ENDED);
    close();
  }, []);

  const theme = useTheme(assistant);

  const getPreviousUserTurn = useCallback(
    (turnIndex: number): UserTurnProps | null => {
      const turn = runtime.session.turns[turnIndex - 1];
      return turn?.type === TurnType.USER ? turn : null;
    },
    [runtime.session.turns]
  );

  return (
    <I18nextProvider i18n={i18n}>
      <RuntimeAPIProvider {...runtime}>
        <ChatWindowContainer className={theme}>
          <Chat
            title={assistant.title}
            description={assistant.description}
            image={assistant.image}
            avatar={assistant.avatar}
            withWatermark={assistant.watermark}
            startTime={runtime.session.startTime}
            hasEnded={runtime.isStatus(SessionStatus.ENDED)}
            isLoading={!runtime.session.turns.length}
            onStart={handleStart}
            onEnd={closeAndEnd}
            onSend={handleSend}
            onMinimize={close}
            isLiveAgentEnabled={liveAgent.isEnabled}
            liveAgent={liveAgent}
          >
            {liveAgent.isEnabled && <LiveAgentStatus talkToRobot={liveAgent.talkToRobot} />}
            {runtime.session.turns.map((turn, turnIndex) =>
              match(turn)
                .with({ type: TurnType.USER }, ({ id, ...rest }) => <UserResponse {...rest} key={id} />)
                .with({ type: TurnType.SYSTEM }, ({ id, ...rest }) => (
                  <SystemResponse
                    {...rest}
                    key={id}
                    Message={({ message, ...props }) => <SystemResponse.SystemMessage {...props} message={message} />}
                    avatar={assistant.avatar}
                    isLast={turnIndex === runtime.session.turns.length - 1}
                  />
                ))
                .exhaustive()
            )}
            {runtime.indicator && <SystemResponse.Indicator avatar={assistant.avatar} />}
          </Chat>
        </ChatWindowContainer>
      </RuntimeAPIProvider>
    </I18nextProvider>
  );
};

export default Object.assign(ChatWindow, { sendMessage, Container: ChatWindowContainer });
