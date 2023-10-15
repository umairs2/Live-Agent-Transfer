import React from 'react';

import { Container } from './styled';
import { useTranslation } from 'react-i18next';

const LiveAgentStatus = ({ talkToRobot }: any) => {
  const { t } = useTranslation();

  return (
    <Container>
      {t('talking_to_agent')}{' '}
      <a onClick={talkToRobot} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
        {t('here')}
      </a>{' '}
    </Container>
  );
};

export default LiveAgentStatus;
