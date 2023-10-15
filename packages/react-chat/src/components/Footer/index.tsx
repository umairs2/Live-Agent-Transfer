import { useState, useEffect } from 'react';

import Button from '@/components/Button';
import ChatInput from '@/components/ChatInput';

import { Container, Watermark } from './styled';
import { useLiveAgent } from '@/use-live-agent.hook';

import axios from 'axios';

import storage from '../../utils/firebaseConfig';

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import app from '../../utils/firebaseConfig';

export interface FooterProps {
  /**
   * If true, shows a watermark indicating that the conversation is powered by Voiceflow.
   */
  withWatermark: boolean;

  /**
   * If true, shows a prompt to start a new chat by calling the {@link onStart} handler.
   * If false, renders controls for the user to write a response.
   */
  hasEnded?: boolean | undefined;

  /**
   * A callback to start a new conversation.
   */
  onStart?: React.MouseEventHandler<HTMLButtonElement> | undefined;

  /**
   * A callback to submit a user response.
   */
  onSend?: ((message: string) => void) | undefined;

  isLiveAgentEnabled?: boolean;

  liveAgent?: any;
}

const Footer: React.FC<FooterProps> = ({ withWatermark, hasEnded, onStart, onSend, isLiveAgentEnabled, liveAgent }) => {
  const [message, setMessage] = useState('');
  const [filePreviewURLs, setFilePreviewURLs] = useState<string[]>([]);

  const [files, setFiles] = useState<File[]>([]);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const dataUrl = event.target?.result as string;
        setFilePreviewURLs((prevURLs) => [...prevURLs, dataUrl]);
      };

      reader.readAsDataURL(newFile);

      setFiles((prevFiles) => [...prevFiles, newFile]);
    }
  };

  const handleUpload = async (): Promise<string[]> => {
    const storageInstance = getStorage(app);

    // Hold URLs for each uploaded file
    const uploadedURLs = [];

    for (let file of files) {
      console.log('Running');
      const storageRef = ref(storageInstance, 'uploads/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      await uploadTask;
      const downloadURL = await getDownloadURL(storageRef);
      uploadedURLs.push(downloadURL);
    }

    return uploadedURLs;
  };

  const handleSend = async (): Promise<void> => {
    if (!message) return;

    const uploadedURLs = await handleUpload();

    // Clear the files and file URLs state when the user sends a message
    onSend?.(message, uploadedURLs);
    setFiles([]);
    setFilePreviewURLs([]);
    setMessage('');
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newUrls = [...filePreviewURLs];
    newUrls.splice(index, 1);
    setFilePreviewURLs(newUrls);
  };

  return (
    <Container withShadow={!!hasEnded} withWatermark={withWatermark}>
      {filePreviewURLs.map((url, index) => (
        <div key={index} style={{ position: 'relative', display: 'inline-block', margin: '5px' }}>
          <img src={url} alt="Uploaded preview" style={{ width: '50px', borderRadius: '5px' }} />
          <button
            onClick={() => removeFile(index)}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              background: 'rgb(210, 210, 210)',
              borderRadius: '50%',
              transform: 'translate(5px, -5px)',
              width: '15px',
              height: '15px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              cursor: 'pointer',
            }}
          >
            X
          </button>
        </div>
      ))}
      {hasEnded ? (
        <Button onClick={onStart}>Start New Chat</Button>
      ) : (
        // eslint-disable-next-line jsx-a11y/no-autofocus
        <ChatInput
          value={message}
          placeholder="Message…"
          autoFocus
          onValueChange={setMessage}
          onSend={handleSend}
          isLiveAgentEnabled={isLiveAgentEnabled}
          onFileChange={handleChange}
        />
      )}
      {withWatermark && (
        <Watermark>
          Assistant ⚡️ by
          <a target="_blank" href="https://voiceflow.com" rel="noreferrer">
            Voiceflow
          </a>
        </Watermark>
      )}
    </Container>
  );
};

/**
 * Footer for the chat widget; displays input controls or a prompt to restart the conversation.
 *
 * @see {@link https://voiceflow.github.io/react-chat/?path=/docs/components-chat-footer--running}
 */
export default Object.assign(Footer, {
  Container,
  Watermark,
});
