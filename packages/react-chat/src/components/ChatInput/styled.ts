import Bubble from '@/components/Bubble';
import Icon from '@/components/Icon';
import Input from '@/components/Input';
import { inputFocusStyles, inputStyles } from '@/components/Input/styled';
import { ClassName } from '@/constants';
import { tagFactory } from '@/hocs';
import { styled } from '@/styles';

const tag = tagFactory(ClassName.CHAT_INPUT);

export const ButtonContainer = styled(tag('label', 'button'), {
  ...inputStyles,
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '$md',
  cursor: 'text',

  [`& ${Bubble.Container}`]: {
    transform: 'scale(0)',
    trans: ['background-color', 'transform'],
  },

  variants: {
    withContent: {
      true: {
        [`& ${Bubble.Container}`]: {
          transform: 'scale(1)',
          cursor: 'pointer',
        },
      },
    },
  },
});

export const Container = styled(tag('div'), {
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 1px 12px $shadow2',
  trans: ['border-color', 'box-shadow'],

  [`& ${Input.Container}`]: {
    margin: 0,
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingRight: 7,
    boxShadow: 'none',
  },

  [`& ${ButtonContainer}`]: {
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },

  [`& ${Icon.Frame}`]: {
    color: '$white',
  },

  [`& ${Input.Container}:focus`]: {
    borderRightWidth: 0,
  },

  [`& ${Input.Container}:focus + ${ButtonContainer}`]: {
    ...inputFocusStyles,
    borderLeftWidth: 0,
  },
});

export const FileInputLabel = styled('label', {
  position: 'relative',
  display: 'inline-block',

  '&:hover': {
    cursor: 'pointer',
  },
});

export const FileInput = styled('input', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0,

  '&:hover': {
    cursor: 'pointer',
  },
});

export const AttachmentIcon = styled('img', {
  marginRight: '7px',
  width: '25px',
  height: '25px',

  '&:hover': {
    cursor: 'pointer',
  },
});
