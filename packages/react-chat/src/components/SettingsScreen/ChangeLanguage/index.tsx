import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Prompt from '@/components/Prompt';
import { chain } from '@/utils/functional';

import language from '../../../assets/svg/language.svg';
import { IconButton } from '../../Button/IconButton';
import { PrimaryButton } from '../../Button/Primary';
import { SecondaryButton } from '../../Button/Secondary';
import { Overlay } from '../../Chat/styled';
import { ButtonContainer, Container } from './styled';

interface SettingsScreenProps {
  handleResume: () => void;
  handleCloseSettings: () => void;
  onStart: MouseEventHandler<HTMLButtonElement> | undefined;
}

const ChangeLanguage: React.FC<SettingsScreenProps> = ({ onStart, handleResume, handleCloseSettings, setIsOpen }) => {
  const [hasAlert, setAlert] = useState(false);
  const { t, i18n } = useTranslation();

  const handleCancel = (): void => setAlert(false);

  return (
    <Container withPrompt={hasAlert} isVisible={true}>
      <ButtonContainer>
        <SecondaryButton style={{ width: '200px' }} onClick={() => i18n.changeLanguage('en')}>
          {t('english')}
        </SecondaryButton>
        <SecondaryButton style={{ width: '200px' }} onClick={() => i18n.changeLanguage('no')}>
          {t('norwegian')}
        </SecondaryButton>

        <PrimaryButton onClick={() => setIsOpen(false)} style={{ width: '200px' }}>
          {t('back')}
        </PrimaryButton>
      </ButtonContainer>
      <Overlay />
      <Prompt
        accept={{ label: t('restart_chat'), type: 'warn', onClick: chain(onStart, handleResume, handleCloseSettings) }}
        cancel={{ label: t('cancel'), onClick: handleCancel }}
      />
    </Container>
  );
};

export default ChangeLanguage;
