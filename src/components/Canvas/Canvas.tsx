import React from 'react';
import { CanvasStyled } from './styled';

export type props = {
  id: string;
}

const Canvas: React.FC<props> = ({id}): React.ReactElement => {
  return (
    <CanvasStyled></CanvasStyled>
  )
}

export default Canvas;