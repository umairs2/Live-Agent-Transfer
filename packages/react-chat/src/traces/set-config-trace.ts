import { CustomMessage } from '../custom-message.enum';
import { Trace } from './types';

import { initializeApp } from 'firebase/app';

export const SetConfigTrace: Trace = {
  canHandle: ({ type }) => type === 'set_config',
  handle: ({ context }, trace) => {
    const firebaseConfig = {
      apiKey: 'AIzaSyA_JzZHOKZaFM_4QdJZz2FhaLRD6Z5tb74',
      authDomain: 'seilvind-cloud-storage.firebaseapp.com',
      projectId: 'seilvind-cloud-storage',
      storageBucket: 'seilvind-cloud-storage.appspot.com',
      messagingSenderId: '726146106524',
      appId: '1:726146106524:web:ac0186f48c938845565959',
    };

    const app = initializeApp(firebaseConfig);

    context.messages.push({
      app: app,
    });
    return context;
  },
};
