import Prompt from '@/components/Prompt';
import { ClassName } from '@/constants';
import { tagFactory } from '@/hocs';
import { createTransition, CSS, fadeIn, shift, styled } from '@/styles';

const PROMPT_OVERFLOW = 10;
const SHIFT_DISTANCE = 12;

const animationStyles = ({ distance = SHIFT_DISTANCE, duration, delay }: { distance?: number; duration: number; delay: number }): CSS => ({
  opacity: 0,
  animation: [fadeIn, shift(distance)].map((animation) => `${animation} ${duration}ms ease-out ${delay}ms forwards`).join(', '),
});

const tag = tagFactory(ClassName.SETTINGS_SCREEN);

export const Overlay = styled(tag('div', 'overlay'), {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '$shadow12',
});

export const Container = styled(tag('div'), {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: '$white',
  zIndex: 99999,

  transform: 'translateY(100%)', // Initialize it off the bottom of the screen
  transition: 'transform 0.3s ease-in-out', // Transition effect for sliding
  ...animationStyles({ duration: 300, delay: 10 }),

  [`& ${Prompt.Container}`]: {
    position: 'absolute',
    bottom: '60px',
    width: '100%',
    boxSizing: 'border-box',
    paddingBottom: `calc($3 + ${PROMPT_OVERFLOW}px)`,
    transition: `transform 320ms cubic-bezier(0.45, 1.29, 0.64, 1), ${createTransition(['box-shadow'], 300)}`,
    transform: `translateY(calc(100% + ${PROMPT_OVERFLOW}px))`,
  },

  variants: {
    isVisible: {
      true: {
        transform: 'translateY(0%)', // Slide up to its original position
      },
      false: {
        transform: 'translateY(100%)', // Slide down out of view
      },
    },

    withPrompt: {
      true: {
        [`& ${Overlay}`]: {
          opacity: 1,
          zIndex: 1,
          pointerEvents: 'auto',
        },

        [`& ${Prompt.Container}`]: {
          zIndex: 1,
          transform: `translateY(${PROMPT_OVERFLOW}px)`,
        },
      },
      false: {
        [`& ${Prompt.Container}`]: {
          boxShadow: 'none',
        },
      },
    },
  },
});

export const ButtonContainer = styled(tag('div'), {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  rowGap: '12px',
  marginBottom: '50px',
});
