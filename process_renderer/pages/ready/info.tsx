/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import styled from 'styled-components';
import { useSelector, shallowEqual } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { AiOutlineSafetyCertificate, AiOutlineWarning, AiOutlineHourglass } from 'react-icons/ai';
import mix from 'mix-color';
import { RootState } from '../../../store';

import Loading from '../../components/loading';
import IconCircle from '../../components/iconCircle';
import ScoreCircle from '../../components/scoreCircle';

import { inGameDataType } from '../../../store/inGame';
import {
  algoScoreType,
} from '../../../types/algorithm.type';

import { CHAMP_ICON, POSITION } from '../../../consts/riotConsts';
import { Match } from '../../../types/matchData.type';

const positionList = ['top', 'jungle', 'middle', 'bottom', 'utility'];

const Container = styled.div`
    width: 100%;
    height: 480px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column ;
`;
const NotPickBolck = styled.div`
    width:100%;
    height:80px; 
    display:flex;
    color: white; 
    justify-content:space-around;
    align-items: center;
`;

const PlayerContainer = styled(Link) <{ cell: number }>`
    position: relative ;
    flex: 1;
    width: 90%;
    display: flex;
    align-items: center ;
    ${(props) => ((props.cell) ? 'border-top: 1px solid silver' : null)};
    text-decoration: none ;
`;

const Score = styled.div<{ total: number }>`
    display: flex ;
    justify-content: center ;
    align-items: center ;
    position: absolute;
    left:55px;
    top: 8px;
    width:60px;
    height: 20px;
    color:black;
    font-size:10px ;
    font-weight: bold ;
    border-radius: 5px;
    background-color: ${(props) => mix(props.theme.palette.winGreen, props.theme.palette.loseRed, props.total / 100)};
`;

const UserDescription = styled.div`
    width:120px;
    margin-left: 10px;
    color:white;
    flex-wrap: nowrap;
`;
const WinLoseBlock = styled.div<{ isWin: boolean }>`
    background-color: ${(props) => (props.isWin ? props.theme.palette.LCKBlue : props.theme.palette.LCKRed)};
    font-weight: bold;
    height:12px;
    color:silver;
    font-size:10px;
    padding:5px;
    border-radius:5px;
    margin: 0 2px ;
    font-family:${(props) => props.theme.font.bold};
`;
const TierBlock = styled.div<{ rank: string }>`
    display: flex ;
    justify-content: center ;
    align-items: center ;
    height:12px;
    font-weight: bold;
    font-size:10px;
    padding:5px;
    border-radius:5px;
    margin: 0 2px ;
    color:silver;
    background-color:${(props) => props.theme.tier[props.rank].main} ;
    font-family:${(props) => props.theme.font.bold};
`;

const UserDetail = styled.div`
    position:absolute;
    left:68px;
    bottom:10px;
    display: flex ;
`;

const UserEssential = styled.div`
    position:absolute;
    right:20px;
    display:flex;
    flex-direction: column;
    justify-content: space-around;
    height:80% ;
`;
const EssentialBlock = styled.div<{ state: string }>`
    display:flex;
    justify-content:center;
    align-items: center ;
    height:15px;
    width:30px;
    font-size:12px;
    padding:5px;
    border-radius:5px;
    margin: 0 2px ;
    color:silver;
    background-color:${(props) => props.theme.essential[props.state]} ;
    font-family:${(props) => props.theme.font.bold};
`;
const getScore = (score: algoScoreType) => {
  let sum = 0;
  // eslint-disable-next-line guard-for-in
  for (const data in score) {
    const temp = score[data];
    if ('score' in temp) sum += temp.score;
  }
  return parseFloat(sum.toFixed(1));
};

function Player({ data, score }: { data: inGameDataType, score: algoScoreType }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (score) {
      setTotal(getScore(score));
    }
  }, [score]);

  return (
    (data.summonerMatchData.player && data.summonerMatchData.playerAPI && score)
      ? (
        <PlayerContainer to={`?index=${data.cellId % 5}`} cell={data.cellId % 5}>
          <IconCircle size="60px" total={total} position={data.assignedPosition} pick={data.championId} />
          <Score total={total}>{`SCORE: ${total.toFixed(0)}`}</Score>
          <UserDescription>
            <p style={{
              flex: '1', fontWeight: 'bold', fontSize: '13px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
            }}
            >
              {data!.summonerMatchData!.playerAPI?.summonerName}
            </p>
          </UserDescription>
          <UserDetail>
            {(data.summonerMatchData.player.lol.rankedLeagueTier
            && data.summonerMatchData.player.lol.rankedLeagueDivision)
            && (
            <TierBlock rank={data.summonerMatchData.player.lol.rankedLeagueTier.toLowerCase()}>
              {`${data.summonerMatchData.player.lol.rankedLeagueTier} ${data.summonerMatchData.player.lol.rankedLeagueDivision}`}
            </TierBlock>
            )}
            <WinLoseBlock isWin>
              W
              {' '}
              {data!.summonerMatchData!.playerAPI?.wins}
            </WinLoseBlock>
            <WinLoseBlock isWin={false}>
              L
              {' '}
              {data!.summonerMatchData!.playerAPI?.losses}
            </WinLoseBlock>
          </UserDetail>
          <UserEssential>
            {score.essential && Object.keys(score.essential).map((prop: string) => (
              score.essential![prop].state
                ? <EssentialBlock state={prop}>{prop}</EssentialBlock>
                : null
            ))}
          </UserEssential>
        </PlayerContainer>
      )
      : null
  );
}

const DetailContainer = styled.div`
    width:100%;
    height:100%;
    display:flex;
    flex-direction: column;
    overflow-y: auto ;
    &::-webkit-scrollbar {
        width: 5px;
        background-color: silver;
        border-radius:2px;
    }
    &::-webkit-scrollbar-thumb {
        width:5px;
        background-color: black;
        border-radius: 2px;
    }
`;
const PositionLevel = styled.div`
    position:absolute;
    display:flex;
    justify-content:space-between;
    left:15px;
    bottom:2px;
    align-items: center;
`;

const CommonIMG = styled.img`
    background-color: #283c43;
    border-radius: 5px;
`;

const Level = styled.div`
    display:flex;
    justify-content: center ;
    align-items: center ;
    font-weight: bold;
    background-color: #283c43;
    color:white;
    padding:5px;
    font-size:12px;
    border-radius:5px;
    height:15px;
`;
const MatchCount = styled.div`
    position:absolute;
    right:5px;
    top:2px;
    justify-content: center ;
    align-items: center ;
    font-weight: bold;
    background-color: #283c43;
    color:white;
    padding:5px;
    font-size:12px;
    border-radius:5px;
`;
const Status = styled.div`
    flex:1;
    display:flex;
    flex-direction: column;
    height:100%;
    align-items: center ;
`;
const Proficiency = styled.div`
    flex:1;
    display:flex;
    flex-direction: column;
`;
const EssentialStateContainer = styled.div`
    height:100%;
    width:95px;
    font-size: 12px;
    font-weight: bold ;
    color:white;
    display: flex;
    align-items: center ;
`;
const KDABlock = styled.div<{ win: boolean }>`
    display: flex ;
    justify-content: center;
    align-items: center ;
    border-radius: 5px;
    width:80px;
    color: white;
    font-size: 12px;
    font-weight: bold ;
    background-color: ${(props) => (props.win ? props.theme.palette.LCKBlue : props.theme.palette.LCKRed)} ;
    padding:5px;
`;
function EssentialState({
  dataKey, data, position, match,
}: { dataKey: string, data: any, position: string, match: number }) {
  if (dataKey === '쌩배') {
    return (
      <EssentialStateContainer>
        {data.apiStatus
          ? (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <TierBlock rank={data.prevTier.toLowerCase()}>{`${data.prevTier} ${data.prevLeague}`}</TierBlock>
            </div>
          )
          : (
            <div>
              API Error
            </div>
          )}
      </EssentialStateContainer>
    );
  }
  if (dataKey === '꼴픽') {
    return (
      <EssentialStateContainer>
        픽
        {' '}
        {data.champUse}
        /
        {match}
        회
      </EssentialStateContainer>
    );
  }
  if (dataKey === '포꼬') {
    return (
      <EssentialStateContainer>
        포지션
        {' '}
        {data.positionRate[positionList.findIndex((v) => v === position)]}
        /
        {match}
        회
      </EssentialStateContainer>
    );
  }

  return null;
}

const WinRate = styled.p`
    display:flex ;
    justify-content: center;
    align-items: center ;
    font-size:12px;
    font-weight: bold ;
    background: linear-gradient(
        to right,
        ${(props) => props.theme.palette.LCKBlue},
        ${(props) => props.theme.palette.LCKRed}
        );
    color: white;
    height:20px;
    width:80%;
    margin:0 auto;
    border-radius: 5px;
`;

const ScoreRate = styled.p<{ total: number }>`
    display:flex ;
    justify-content: center;
    align-items: center ;
    font-size:12px;
    font-weight: bold ;
    background-color: ${(props) => mix(props.theme.palette.winGreen, props.theme.palette.loseRed, props.total / 100)};
    color: white;
    height:20px;
    width:80%;
    margin:0 auto;
    border-radius: 5px;
`;

const ScoreDetail = styled.div`
    display:flex ;
    flex-direction: column ;
    justify-content: center;
    align-items: center ;
    font-size:12px;
    font-weight: bold ;
    color: white;
    width:80%;
`;

function ScoreState({ score, prop }: { score: algoScoreType, prop: string }) {
  const algoData = useSelector(
    (state: RootState) => state.ALGORITHM.find((algo) => algo.selected)?.algoData,
    shallowEqual,
  );
  if (algoData) {
    return (
      <ScoreDetail>
        <p style={{ fontSize: '12px', alignSelf: 'flex-start' }}>{score[prop].state.split(':')[0]}</p>
        <p style={{ margin: '5px 0', fontSize: '14px', alignSelf: 'flex-end' }}>{score[prop].state.split(':')[1]}</p>
        <p style={{ fontSize: '12px', alignSelf: 'flex-start' }}>DodgeScore</p>
        <p style={{ fontSize: '16px', alignSelf: 'flex-end' }}>{`${score[prop].score.toFixed(2)}/${algoData[prop].ratio} max`}</p>
      </ScoreDetail>
    );
  }
  return null;
}

function PlayerDetail({ data, score }:
  { data: inGameDataType, score: algoScoreType }) {
  const [positionProf, setPositionProf] = useState<any>([]);
  const [champProf, setChampProf] = useState<any>([]);
  const [winRate, setWinRate] = useState<any>([]);
  const [scoreState, setScoreState] = useState<string>();
  const { patchVersion } = useSelector((state: RootState) => state.GAMEASSET);

  const getSortedPositionIndex = (arr: number[]) => {
    const sorted: { position: string, prof: number }[] = [];
    arr.forEach((v, i) => {
      sorted.push({ position: positionList[i], prof: v });
    });
    sorted.sort((a, b) => b.prof - a.prof);
    return sorted;
  };
  const getSortedChampIndex = (name: string, arr: Match[]) => {
    const sorted: { champ: string, prof: number }[] = [];
    arr.forEach((match) => {
      for (const participant of match.matchData!.info.participants) {
        if (participant.summonerName === name) {
          if (sorted.map((v) => v.champ).includes(participant.championName)) {
            sorted.find((value) => value.champ === participant.championName)!.prof += 1;
          } else {
            sorted.push({ champ: participant.championName, prof: 1 });
          }
          break;
        }
      }
    });
    sorted.sort((a, b) => b.prof - a.prof);
    return sorted;
  };
  const getWinRate = (name: string, arr: Match[]) => {
    let [win, lose, rate] = [0, 0, ''];
    arr.forEach((v) => {
      for (const participant of v.matchData!.info.participants) {
        if (participant.summonerName === name) {
          if (participant.win) win += 1;
          else lose += 1;
        }
      }
    });
    rate = ((win / (lose + win)) * 100).toFixed(1);
    return [win, lose, rate];
  };

  const onHover = (event: React.MouseEvent<SVGCircleElement>, prop: string) => {
    setScoreState(prop);
  };

  useEffect(() => {
    if (
      data
      && 'summonerMatchData' in data
      && data.summonerMatchData.player
      && data.summonerMatchData.match
      && data.summonerMatchData.playerAPI
      && score) {
      if (score.essential && data.summonerMatchData.player && data.summonerMatchData.match) {
        setWinRate(
          getWinRate(data.summonerMatchData.player.gameName, data.summonerMatchData.match),
        );
        setPositionProf(getSortedPositionIndex(score.essential.포꼬.positionRate));
        setChampProf(
          getSortedChampIndex(data.summonerMatchData.player.gameName, data.summonerMatchData.match),
        );
      }
    }
  }, [data, score]);

  if (
    data
    && 'summonerMatchData' in data
    && data.summonerMatchData.player
    && data.summonerMatchData.match
    && data.summonerMatchData.playerAPI
    && score) {
    return (
      <DetailContainer>
        <div style={{
          position: 'relative', height: '80px', padding: '5px', display: 'flex', justifyContent: 'space-around',
        }}
        >
          <IconCircle size="80px" total={getScore(score)} userIcon={data.summonerMatchData.player.icon} pick={data.championId} />
          <div style={{
            width: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}
          >
            <p style={{
              marginLeft: '5px', color: 'white', width: '120px', fontSize: '15px', fontWeight: 'bold',
            }}
            >
              {data.summonerMatchData.player.gameName}
            </p>
            <div style={{ display: 'flex', marginTop: '10px' }}>
              <TierBlock rank={data.summonerMatchData.player.lol.rankedLeagueTier.toLowerCase()}>{`${data.summonerMatchData.player.lol.rankedLeagueTier} ${data.summonerMatchData.player.lol.rankedLeagueDivision}`}</TierBlock>
              <WinLoseBlock isWin>
                W
                {data.summonerMatchData.playerAPI.wins}
              </WinLoseBlock>
              <WinLoseBlock isWin={false}>
                L
                {data.summonerMatchData.playerAPI.losses}
              </WinLoseBlock>
            </div>
          </div>
          <PositionLevel>
            <CommonIMG
              style={{
                width: '20px', height: '20px', marginRight: '45px', padding: '5px',
              }}
              src={POSITION(data.assignedPosition)}
            />
            <Level>{data.summonerMatchData.player.lol.level}</Level>
          </PositionLevel>
          <MatchCount>
            분석 게임:
            {data.summonerMatchData.match.length}
          </MatchCount>
        </div>
        <div style={{ height: '120px', padding: '5px', display: 'flex' }}>
          <Status>
            <p style={{
              width: '80%', height: '15px', marginBottom: '5px', padding: '2.5px', color: 'white', fontSize: '12px', fontWeight: 'bold', borderBottom: '1px solid white',
            }}
            >
              {'<상태>'}
            </p>
            {score.essential && Object.keys(score.essential)
              .map((key:string) => (
                <div style={{
                  height: '30px', width: '100%', display: 'flex', justifyContent: 'center', position: 'relative',
                }}
                >
                  <div style={{
                    width: '80%', display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                  }}
                  >
                    <EssentialBlock style={{ position: 'relative' }} state={key}>{key}</EssentialBlock>
                    {score.essential && (
                    <EssentialState
                      match={data.summonerMatchData.match!.length}
                      dataKey={key}
                      position={data.assignedPosition}
                      data={score.essential[key]}
                    />
                    )}
                  </div>
                  {(score.essential && key === '쌩배') && (score.essential[key].apiStatus ? (
                    score.essential[key].state
                      ? (
                        <AiOutlineWarning style={{
                          color: 'red', position: 'absolute', left: '5', top: '0',
                        }}
                        />
                      )
                      : (
                        <AiOutlineSafetyCertificate style={{
                          color: 'green', position: 'absolute', left: '5', top: '0',
                        }}
                        />
                      )

                  )
                    : (
                      <AiOutlineHourglass style={{
                        color: 'gold', position: 'absolute', left: '5', top: '0',
                      }}
                      />
                    ))}
                  {score.essential && (key === '꼴픽' || key === '포꼬') && (score.essential[key].state
                    ? (
                      <AiOutlineWarning style={{
                        color: 'red', position: 'absolute', left: '5', top: '0',
                      }}
                      />
                    )
                    : (
                      <AiOutlineSafetyCertificate style={{
                        color: 'green', position: 'absolute', left: '5', top: '0',
                      }}
                      />
                    )
                  )}
                </div>
              ))}
          </Status>
          <Proficiency>
            <p style={{
              width: '80%', height: '15px', padding: '2.5px', color: 'white', fontSize: '12px', fontWeight: 'bold', borderBottom: '1px solid white',
            }}
            >
              {'<숙련도>'}
            </p>
            <div style={{
              height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around',
            }}
            >
              <div style={{ display: 'flex' }}>
                {positionProf.map((position: any, i: any) => {
                  let size;
                  if (i === 0 || i === 1) {
                    size = (i === 0 ? 30 : 26);
                  } else {
                    size = 20;
                  }
                  return (
                    <div style={{
                      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', flex: '1', color: 'white', fontSize: '10px', fontWeight: 'bold',
                    }}
                    >
                      <CommonIMG style={{ width: `${size}px`, height: `${size}px` }} src={POSITION(position.position)} />
                      <p>{position.prof}</p>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex' }}>
                {champProf.map((champ: any, i: any) => {
                  let size;
                  if (i === 0 || i === 1) {
                    size = (i === 0 ? 30 : 26);
                  } else {
                    size = 20;
                  }
                  if (i < 5) {
                    return (
                      <div style={{
                        display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', flex: '1', color: 'white', fontSize: '10px', fontWeight: 'bold',
                      }}
                      >
                        <CommonIMG style={{ width: `${size}px`, height: `${size}px` }} src={CHAMP_ICON(patchVersion || '1', champ.champ)} />
                        <p>{champ.prof}</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </Proficiency>
        </div>
        <div style={{ padding: '5px', display: 'flex' }}>
          <div style={{ flex: '1' }}>
            <p style={{
              height: '15px', color: 'white', fontWeight: 'bold', fontSize: '12px', textAlign: 'center',
            }}
            >
              Match History(최신순)
            </p>
            <WinRate>
              {winRate[0]}
              {' '}
              /
              {' '}
              {winRate[1]}
              {' '}
              /
              {' '}
              {winRate[2]}
              %
            </WinRate>
            {data.summonerMatchData.match
              .map((match) => match.matchData!.info.participants
                // eslint-disable-next-line max-len
                .filter((participant) => participant.summonerName === data.summonerMatchData.player!.gameName)
                .map((info) => (
                  <div style={{
                    display: 'flex', height: '25px', width: '100%', margin: '5px', justifyContent: 'space-around',
                  }}
                  >
                    <KDABlock win={info.win}>
                      {info.kills}
                      /
                      {info.deaths}
                      /
                      {info.assists}
                    </KDABlock>
                    <CommonIMG style={{ width: '25px', height: '25px' }} src={POSITION(info.individualPosition.toLowerCase())} />
                    <CommonIMG style={{ width: '25px', height: '25px' }} src={CHAMP_ICON(patchVersion || '1', info.championName)} />
                  </div>
                )))}
          </div>
          <div style={{
            flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}
          >
            <p style={{
              height: '15px', color: 'white', fontWeight: 'bold', fontSize: '12px', textAlign: 'center',
            }}
            >
              DodgeScore
            </p>
            <ScoreRate total={getScore(score)}>
              Total Score:
              {getScore(score)}
            </ScoreRate>
            <ScoreCircle
              size={120}
              stroke={15}
              score={score}
              main={false}
              onHover={(e, prop) => onHover(e, prop)}
            />
            {scoreState && <ScoreState score={score} prop={scoreState} />}
          </div>
        </div>
      </DetailContainer>
    );
  }

  return null;
}

export default function Info() {
  const location = useLocation();
  const { index } = queryString.parse(location.search);
  const inGameData = useSelector((state: RootState) => state.INGAME, shallowEqual);
  const inGameScore = useSelector((state: RootState) => state.INGAMESCORE);

  if (!(index)) {
    return (
      <Container>
        {inGameData.length && inGameScore.length
          ? inGameData.map((data, i) => (
            ('summonerMatchData' in data && !Array.isArray(inGameScore[i]))
              ? <Player data={data} key={data.cellId % 5} score={inGameScore[data.cellId % 5]} />
              : (
                <PlayerContainer to="" key={data.cellId % 5} cell={data.cellId % 5}>
                  <Loading size="60px" />
                </PlayerContainer>
              )

          ))
          : (
            <NotPickBolck>
              <Loading size="60px" />
              <p>챔피언 픽 진행 시 자동으로 실행됩니다.</p>
            </NotPickBolck>
          )}
      </Container>
    );
  }

  return (
    <Container>
      {(typeof index === 'string' && inGameData.length && inGameScore.length) && <PlayerDetail data={inGameData[parseInt(index, 10)]} score={inGameScore[parseInt(index, 10)]} />}
    </Container>
  );
}
