import styled from 'styled-components/macro';

export const StyledHome = styled.div`
  background: rgba(220, 20, 60);
`;

export const ButtonContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 10vh;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;

  svg {
    fill: rgba(220, 20, 60);
  }
`;

export const Link = styled.a`
  &:not(:last-child) {
    margin-right: 2rem;
  }
`;