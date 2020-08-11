import React, { RefObject, Ref } from 'react';
import { CanvasStyled } from './styled';

export type Props = {
  id: string;
  ref?: RefObject<HTMLCanvasElement>;
}

const CanvasElement = React.forwardRef<HTMLCanvasElement, Props>((props: Props, ref?: Ref<HTMLCanvasElement>) => (
    <CanvasStyled ref={ref}></CanvasStyled>
  )
)

export default CanvasElement;