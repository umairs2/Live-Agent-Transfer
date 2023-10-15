import { styled } from '@/styles';

import { ButtonVariant } from './constants';
import { Container, tag } from './styled';

// This is the button with an icon to the left of the text.
export const IconButton = styled(tag(Container, ButtonVariant.SECONDARY), {
  display: 'flex', // Change the display to flex
  alignItems: 'center', // Center items vertically
  justifyContent: 'center', // Center items horizontally
  height: '$sm',
  border: '1px solid $fadedPrimary',
  color: '$primary',
  backgroundColor: '$white',
  boxShadow: '0 1px 2px $shadow2',
  paddingLeft: '12px', // Increase the padding on the left to accommodate the icon
  paddingRight: '16px', // Symmetrical padding on the right
  trans: ['border-color'],

  '&:hover': {
    borderColor: '$primary',
  },

  '& > img': {
    // Assuming the icon is an SVG. If it's not, adjust this selector.
    // marginRight: '8px', // Spacing between the icon and the text
    transform: ' translateX(-8px)',
  },
});
