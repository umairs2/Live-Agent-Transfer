import { ClassName } from '@/constants';
import { tagFactory } from '@/hocs';
import { styled } from '@/styles';

const tag = tagFactory(ClassName.LIVE_AGENT_STATUS);

export const Container = styled(tag('div'), {
  position: 'absolute',
  width: '100%',
  top: 56,
  left: 0,
  fontFamily: '$default',
  fontSize: '14px',
  padding: 8,
  color: 'white',
  background: 'orangered',
  zIndex: 1,
});
