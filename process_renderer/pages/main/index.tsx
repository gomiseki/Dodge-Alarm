import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import styled from 'styled-components';

import State from './state';
import PlayerInfo from './playerInfo';

import { RootState } from '../../../store';
import useIngame from '../../hooks/useInGame';

const Container = styled.div`
  width: 320px;
  height: 495px;
`;
// for debugging
// width: 320px;
// height: 495px;
// position: absolute;
// left: 5px;
// top:158px;

// width: 320px;
// height: 495px;
const Top = styled.div`
  height: 95px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Pick = styled.div`
    display: flex;
    flex-direction: column;
    height: 400px;
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
  const inGameData = useSelector((state: RootState) => state.INGAME, shallowEqual);
  const pickPhase = useSelector((state: RootState) => state.GAMEASSET.pickPhase, shallowEqual);
  useIngame();

  const onClick = () => {
    window.api.send('Ready-Window');
  };

  return (
    <Container>
      <Top>
        <Logo><LogoSpan onClick={onClick}>Powerd by 너 쌩배지 v1</LogoSpan></Logo>
        {(pickPhase && inGameData) && <State />}
      </Top>
      <Pick>
        {
          pickPhase && inGameData.map((member) => (
            <PlayerInfo
              key={member.cellId % 5}
              data={member}
              isProgress={pickPhase[member.cellId]}
            />
          ))
        }
      </Pick>
    </Container>
  );
}
// {
//   inGameData.map((member, index) => (
//     <PlayerInfo key={member.cellId % 5} data={member} isProgress />
//   ))
// }
