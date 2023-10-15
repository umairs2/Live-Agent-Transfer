import { CustomMessage } from '../custom-message.enum';
import { Trace } from './types';

export const FileUploadTrace: Trace = {
  canHandle: ({ type }) => type === 'file_upload',
  handle: ({ context }, trace) => {
    console.log(JSON.parse(trace.payload));

    context.messages.push({
      type: CustomMessage.FILE_UPLOAD,
      googleCreds: JSON.parse(trace.payload),
    });
    return context;
  },
};
