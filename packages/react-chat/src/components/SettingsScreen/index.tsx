import React, { MouseEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Prompt from '@/components/Prompt';
import { chain } from '@/utils/functional';

import language from '../../assets/svg/language.svg';
import { IconButton } from '../Button/IconButton';
import { PrimaryButton } from '../Button/Primary';
import { SecondaryButton } from '../Button/Secondary';
import { Overlay } from '../Chat/styled';
import ChangeLanguage from './ChangeLanguage';
import { ButtonContainer, Container } from './styled';

interface SettingsScreenProps {
  handleResume: () => void;
  handleCloseSettings: () => void;
  onStart: MouseEventHandler<HTMLButtonElement> | undefined;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onStart, handleResume, handleCloseSettings }) => {
  const [hasAlert, setAlert] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleChangeLanguage = (): void => {
    i18n.changeLanguage(i18n.language === 'en' ? 'no' : 'en');
  };

  const handleCancel = (): void => setAlert(false);

  return (
    <>
      {isOpen && <ChangeLanguage onStart={onStart} handleResume={handleResume} handleCloseSettings={handleCloseSettings} setIsOpen={setIsOpen} />}
      <Container withPrompt={hasAlert} isVisible={true}>
        <ButtonContainer>
          <IconButton style={{ width: '200px' }} onClick={() => setIsOpen(true)}>
            <img src={language} alt="settings" style={{ width: '18px', height: '18px' }}></img>
            {t('change_language')}
          </IconButton>
          <SecondaryButton style={{ width: '200px' }} onClick={() => setAlert(true)}>
            {t('restart_chat')}
          </SecondaryButton>
          <SecondaryButton style={{ width: '200px' }}>{t('end_chat')}</SecondaryButton>
          <PrimaryButton onClick={() => handleCloseSettings()} style={{ width: '200px' }}>
            {t('return_to_chat')}
          </PrimaryButton>
        </ButtonContainer>
        {hasAlert && (
          <>
            <Overlay />
            <Prompt
              accept={{ label: t('restart_chat'), type: 'warn', onClick: chain(onStart, handleResume, handleCloseSettings) }}
              cancel={{ label: t('cancel'), onClick: handleCancel }}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default SettingsScreen;
