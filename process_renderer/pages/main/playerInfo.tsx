import React, { useState } from 'react';
import styled from 'styled-components';
import { AiOutlineRead } from 'react-icons/ai';
import { shallowEqual, useSelector } from 'react-redux';
import mix from 'mix-color';
import ScoreCircle from '../../components/scoreCircle';

import { algoScoreType, essentialProps } from '../../../types/algorithm.type';

import { RootState } from '../../../store';
import { inGameDataType } from '../../../store/inGame';

interface infoProps{
    data:inGameDataType,
    isProgress:boolean
}

const Container = styled.div<{picked:boolean}>`
    flex:1;
    width:auto;
    height:100%;
    position: relative;
    padding-left: ${(props) => (props.picked ? '54px' : '24px')} ;
    display:flex;
    align-items: center ;
    transition: padding-left 0.5s linear ;
`;
const UserStateContainer = styled.div`
    height:16px;
    display: flex;
    align-self: flex-end ;
`;

const EssentialBlock = styled.div<{state:string}>`
    display:flex;
    justify-content:center;
    align-items: center ;
    height:auto;
    width:auto;
    font-size:8px;
    padding:4px;
    border-radius:5px;
    margin: 0 2px ;
    color:silver;
    font-weight: bold ;
    background-color:${(props) => props.theme.essential[props.state]};
`;
const ScoreBlock = styled.div<{total:number, picked:boolean}>`
    position:absolute;
    top:0;
    left:${(props) => (props.picked ? '86px' : '56px')};
    padding:3px;
    font-size:10px;
    color:white;
    border-radius:3px;
    font-weight: bold ;
    background-color: ${(props) => mix(props.theme.palette.winGreen, props.theme.palette.loseRed, props.total / 100)};
    transition: left 0.5s linear ;
`;

const Button = styled.div<{mouseOver:boolean}>`
  position: absolute;
  width: 56px;
  height: 56px;
  border-radius: 30px;
  background-color: ${({ mouseOver }) => (mouseOver ? 'black' : 'white')};
  margin-left: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${({ mouseOver }) => (mouseOver ? '70%' : '2%')};
  z-index: 0;
`;

const TradeButton = styled.div`
  background-color: transparent;
  z-index: 1;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  position: absolute;
  left: 90px;
  bottom: 6px;
   z-index: 999;
`;

function InfoButton({ onClick }:{onClick:any}) {
  const [mouseOver, setMouseOver] = useState(false);
  return (
    <Button
      onClick={onClick}
      mouseOver={mouseOver}
      onMouseOver={() => { setMouseOver(true); }}
      onMouseOut={() => { setMouseOver(false); }}
    >
      {mouseOver && (
      <AiOutlineRead style={{
        color: 'white', width: '60%', height: '60%',
      }}
      />
      )}
    </Button>
  );
}

function UserState({ essential, total, mycell }:
    {essential:essentialProps|undefined, total:number, mycell:boolean}) {
  console.log(mycell);
  return (
    <UserStateContainer>
      {mycell && total > 80
        ? <EssentialBlock state="내로남불">내로남불</EssentialBlock>
        : null}
      {essential && Object.keys(essential).map((key) => {
        switch (key) {
          case '쌩배':
            if (essential.쌩배.apiStatus && essential.쌩배.state) {
              return (
                <EssentialBlock state={key}>{key}</EssentialBlock>
              );
            }
            break;
          case '포꼬':
            if (essential.포꼬.state) {
              return (
                <EssentialBlock state={key}>{key}</EssentialBlock>
              );
            }
            break;
          case '꼴픽':
            if (essential.꼴픽.state) {
              return (
                <EssentialBlock state={key}>{key}</EssentialBlock>
              );
            }
            break;
          default:
            return null;
        }
        return null;
      })}
    </UserStateContainer>
  );
}
const openDetail = (id:number) => {
  window.api.send('Open-Detail', id);
};

function PlayerInfo({ data, isProgress }:infoProps) {
  const user = useSelector(((state:RootState) => state.USER));
  const score = useSelector(((state:RootState) => state.INGAMESCORE), shallowEqual);

  const getScore = (algoScore:algoScoreType) => {
    let sum = 0;
    // eslint-disable-next-line guard-for-in
    for (const value in algoScore) {
      const temp = algoScore[value];
      if ('score' in temp)sum += temp.score;
    }
    return parseFloat(sum.toFixed(1));
  };

  return (
    <Container picked={isProgress}>
      {('summonerMatchData' in data && score.length)
        // <Loading size={"56px"}/>
        // :
        // null
        // for debugging (
        && (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center',
          }}
          >
            <ScoreCircle main size={64} stroke={5} score={score[data.cellId % 5]} />
            <UserState
              essential={score[data.cellId % 5].essential}
              total={getScore(score[data.cellId % 5])}
              mycell={data.summonerId === user.localUserInfo.summonerId}
            />
            <InfoButton onClick={() => { openDetail(data.cellId % 5); }} />
          </div>
        )}
      {'summonerMatchData' in data && score.length ? <ScoreBlock picked={isProgress} total={getScore(score[data.cellId % 5])}>{`score:${getScore(score[data.cellId % 5]).toFixed(0)}`}</ScoreBlock> : null}
      <TradeButton />
    </Container>
  );
}
export default PlayerInfo;
