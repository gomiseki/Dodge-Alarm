import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 320px;
  height: 495px;

`;

const Top = styled.div`
  height: 95px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  justify-content: flex-start; 
  align-items: center;
  height: 20px;
  padding-left: 2px;
  color: white;
  margin-top: 2px;
`;

const LogoSpan = styled.div`
  background-color: black;
  height: 16px;
  cursor: pointer;
  &:hover {
      background-color: #000;
      opacity:0.8;
  }
`;

export default function Main() {
  const onClick = () => {
    window.api.send('Ready-Window');
  };

  return (
    <Container>
      <Top>
        <Logo><LogoSpan onClick={onClick}>Powerd by 너 쌩배지 v1</LogoSpan></Logo>
        {/* {(pickPhase && inGameData) && <State />} */}
      </Top>
    </Container>
  );
}
