import React, { useState } from 'react';
import { serializeToMarkdown } from '@voiceflow/slate-serializer/markdown';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import app from '../../utils/firebaseConfig';

import Message from '@/components/Message';
import type { TextMessageProps } from '@/components/SystemResponse/types';
import { FeedbackName, useRuntime } from '@/hooks';

import Markdown from './Markdown';

export interface DefaultTextProps {
  /**
   * text whether in string or slate format
   */
  text: TextMessageProps['text'];
  onFileUploaded?: (url: string) => void; // Callback for when file is uploaded
}

const FileUpload: React.FC<DefaultTextProps> = ({ text, onFileUploaded, googleCreds }) => {
  console.log(googleCreds);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files ? e.target.files[0] : null;
    setFile(newFile);
  };

  const handleUpload = async (): Promise<string | null> => {
    if (!file) return null;

    app.options.apiKey = googleCreds.apiKey;
    app.options.authDomain = googleCreds.authDomain;
    app.options.projectId = googleCreds.projectId;
    app.options.storageBucket = googleCreds.storageBucket;
    app.options.messagingSenderId = googleCreds.messagingSenderId;
    app.options.appId = googleCreds.appId;

    console.log(app);

    const storageInstance = getStorage(app);
    const storageRef = ref(storageInstance, 'uploads/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    await uploadTask;
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  };

  const uploadAndNotify = async () => {
    const url = await handleUpload();
    if (url && onFileUploaded) {
      onFileUploaded(url);
    }
  };

  return (
    <Message from="system">
      <Markdown>{typeof text === 'string' ? text : serializeToMarkdown(text)}</Markdown>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadAndNotify}>Upload File</button>
    </Message>
  );
};

export default FileUpload;
