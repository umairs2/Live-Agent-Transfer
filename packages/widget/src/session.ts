import { ChatPersistence, cuid, SessionOptions } from '@voiceflow/react-chat';

const VOICEFLOW_SESSION_KEY = 'voiceflow-session';

const getSessionKey = (projectID: string) => `${VOICEFLOW_SESSION_KEY}-${projectID}`;

const getStorageSession = (storage: Storage, projectID: string): SessionOptions | null => {
  try {
    return JSON.parse(storage.getItem(getSessionKey(projectID))!);
  } catch {
    return null;
  }
};

const setStorageSession = (storage: Storage, projectID: string, options: SessionOptions) => {
  storage.setItem(getSessionKey(projectID), JSON.stringify(options));

  return options;
};

const resolveSession = (storage: Storage, projectID: string, userID: string) => {
  const session = getStorageSession(storage, projectID);

  if (!session || (userID && session.userID !== userID)) {
    return setStorageSession(storage, projectID, { userID });
  }

  return session;
};

export const getSession = (persistence: ChatPersistence, projectID: string, userID: string = cuid()): SessionOptions => {
  switch (persistence) {
    case ChatPersistence.MEMORY:
      return { userID };
    case ChatPersistence.LOCAL_STORAGE:
      return resolveSession(localStorage, projectID, userID);
    case ChatPersistence.SESSION_STORAGE:
    default:
      return resolveSession(sessionStorage, projectID, userID);
  }
};

export const saveSession = (persistence: ChatPersistence, projectID: string, session: SessionOptions): void => {
  if (persistence === ChatPersistence.LOCAL_STORAGE) {
    setStorageSession(localStorage, projectID, session);
  } else if (persistence === ChatPersistence.SESSION_STORAGE) {
    setStorageSession(sessionStorage, projectID, session);
  }

  if (persistence !== ChatPersistence.LOCAL_STORAGE) {
    localStorage.removeItem(getSessionKey(projectID));
  }
  if (persistence !== ChatPersistence.SESSION_STORAGE) {
    sessionStorage.removeItem(getSessionKey(projectID));
  }
};
