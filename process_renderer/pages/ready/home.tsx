import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { AiOutlinePlus } from 'react-icons/ai';
import { selectAlgorithm } from '../../../store/algorithm';
import { RootState } from '../../../store';
import {
  PROFILE_ICON, RANK_PLATE, RANK_EMBLEM, 꿀벌,
} from '../../../consts/riotConsts';

import Button from '../../components/buttons';
import SelectBox from '../../components/selectBox';

import { Algorithm_type, AlgoPropsToDesc, initAlgo } from '../../../types/algorithm.type';
import theme from '../../styles/theme';

const Container = styled.div`
    height:100%;
    color: white;
    display:flex;
    flex-direction: column;
    align-items:center ;
`;
const UserInfo = styled.div`
    height:250px;
    display: flex;
    align-items: center ;
    width:80%;
`;
const SummonerContainer = styled.div`
    width: 300px;
    height: 250px ;
    position: relative;
`;

const IconCover = styled.div`
    display: flex;
    justify-content: center;
    align-items: center ;
    width: 210px;
    height: 210px;
    border-radius: 105px;
    background: linear-gradient(
        ${(props) => props.color && props.theme.tier[props.color].main},
        ${(props) => props.color && props.theme.tier[props.color].sub}
        );
`;
const IconImage = styled.img<{url:string}>`
    background-image: url(${(props) => props.url});
    width: 200px;
    height: 200px;
    border-radius: 100px;
    background-size: cover;
    background-position: center;
`;

const Description = styled.div`
    position: absolute;
    right:0;
    bottom:0;
    border-radius: 5px;
`;
const DescBackground = styled.img`
    width:200px;
`;
const DescTextContainer = styled.div`
    position:absolute;
    right:0;
    bottom:0;
    width:130px;
    height:70px;
    margin-right: 37px; /* width의 50% */
    margin-bottom: 12px;
    display:flex;
    flex-direction:column ;
    color:silver;
`;
const DescText = styled.div`
    flex:1;
    display:flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    min-height: 0;
    padding:1px;
`;
const WinLoseBlock = styled.div<{ isWin: boolean }>`
    background-color: ${(props) => (props.isWin ? props.theme.palette.LCKBlue : props.theme.palette.LCKRed)};
    font-size:12px;
    padding:3px;
    border-radius:5px;
    margin: 0 2px ;
    font-family:${(props) => props.theme.font.bold};
`;
const Tierimg = styled.img`
    display: block;
    height: 100%;
`;

// color:${props=>props.theme.tier[props.color].sub};
function Summoner() {
  const userState = useSelector((state: RootState) => state.USER);
  return (
    userState.apiStatus.league && userState.localUserInfo.accountId
      ? (
        <SummonerContainer>
          <IconCover color={userState.leagueUserInfo.tier.toLowerCase()} style={{}}>
            <IconImage url={
              theme.editions[userState.leagueUserInfo.summonerId]
                ? theme.editions[
                  userState.leagueUserInfo.summonerId].tier[
                  userState.leagueUserInfo.tier.toLowerCase()].profile
                : PROFILE_ICON(userState.localUserInfo.profileIconId)
              }
            />
          </IconCover>
          <Description>
            <DescBackground src={RANK_PLATE} />
            <DescTextContainer color={userState.leagueUserInfo.tier.toLowerCase()}>
              <DescText>
                <p style={{
                  fontWeight: 'bold', fontSize: '13px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                }}
                >
                  {theme.editions[userState.leagueUserInfo.summonerId]
                  && theme.editions[userState.leagueUserInfo.summonerId]
                    .tier[userState.leagueUserInfo.tier.toLowerCase()]
                    ? theme.editions[userState.leagueUserInfo.summonerId]
                      .tier[userState.leagueUserInfo.tier.toLowerCase()].nickname
                    : userState.localUserInfo.displayName}
                </p>
              </DescText>
              <DescText>
                <WinLoseBlock isWin>
                  W
                  {' '}
                  {userState.leagueUserInfo.wins}
                  {' '}
                </WinLoseBlock>
                /
                <WinLoseBlock isWin={false}>
                  L
                  {userState.leagueUserInfo.losses}
                </WinLoseBlock>
              </DescText>
              <DescText>
                <Tierimg src={RANK_EMBLEM(userState.leagueUserInfo.tier.toLowerCase())} />
                <p style={{ fontWeight: 'bold', fontSize: '13px' }}>
                  {userState.leagueUserInfo.tier}
                  {userState.leagueUserInfo.rank}
                </p>
              </DescText>
            </DescTextContainer>
          </Description>
        </SummonerContainer>
      )
      : (
        <SummonerContainer>
          <IconCover color="iron">
            <IconImage url={꿀벌} />
          </IconCover>
          <Description color="iron">
            <DescBackground src={RANK_PLATE} />
            <DescTextContainer color={userState.leagueUserInfo.tier.toLowerCase()}>
              <DescText>
                <pre style={{ fontWeight: 'bold', fontSize: '13px', lineHeight: '1.3' }}>
                  {`롤 클라이언트 
실행 시 자동으로 
attach 됩니다.`}
                </pre>
              </DescText>
            </DescTextContainer>
          </Description>
        </SummonerContainer>
      )
  );
}

const AlgoDescContainer = styled.div`
    width:100%;
    display:flex;
    flex-direction: column ;
    overflow-y: auto;
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
const AlgoBlock = styled.div`
    display: flex ;
    height: 20px ;
    margin:5px 0;
    font-size: 12px;
    justify-content: space-between ;
`;
const PropBlock = styled.div<{ color?: string }>`
    min-width: 20px;
    padding:5px;
    font-size: 8px;
    background-color:${(props) => props.color && props.theme.palette[props.color]} ;
    margin-right: 5px;
    border-radius: 5px;
    text-align: center;
    color:black;
    font-weight:bold ;
`;

function AlgoDesc({ algoData }: { algoData: Algorithm_type }) {
  const [sorted, setSorted] = useState<string[]>();

  useEffect(() => {
    if (algoData) {
      const arr = Object.keys(algoData).filter((key) => (key !== 'matchCount') && algoData[key]);
      arr.sort((a, b) => algoData[b].ratio - algoData[a].ratio);
      setSorted(() => arr);
    }
  }, [algoData]);

  const propColor: { [index: string]: string } = {
    maxScore: 'LCKRed',
    minScore: 'LCKBlue',
    maxDeath: 'loseRed',
    maxRatio: 'LCKRed',
    minRatio: 'LCKBlue',
    ratio: 'silver',
  };
  const propName: { [index: string]: string } = {
    maxScore: 'Danger',
    minScore: 'Safe',
    maxDeath: 'Death',
    maxRatio: 'Danger',
    minRatio: 'Safe',
    ratio: 'Ratio',
  };
  return (
    <AlgoDescContainer>
      <AlgoBlock>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{AlgoPropsToDesc.matchCount.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PropBlock style={{ backgroundColor: 'darkgrey' }}>{algoData.matchCount}</PropBlock>
        </div>
      </AlgoBlock>
      {sorted ? sorted.map((key) => (
        <AlgoBlock>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{AlgoPropsToDesc[key].name}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {Object.keys(algoData[key]).map((prop) => prop !== 'type' && (
            <PropBlock color={propColor[prop]}>
              {propName[prop]}
              {' '}
              {algoData[key][prop]}
            </PropBlock>
            ))}
          </div>
        </AlgoBlock>
      ))
        : null}
    </AlgoDescContainer>
  );
}

const AlgoContainer = styled.div`
    height:230px;
    width:90%;
    display: flex;
    flex-direction: column;
`;

const AlgoSelect = styled.select`
    width: 85%;
    height: 30px;
    margin-right: 10px;
`;
type optionType = {
  name: string;
  select: boolean
}

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.USER);
  const algoState = useSelector((state: RootState) => state.ALGORITHM);
  const [algoArr, setAlgoArr] = useState(algoState.map((algo) => (
    { name: algo.algoName, select: algo.selected })));

  useEffect(() => {
    setAlgoArr(
      algoState.map((algo) => ({ name: algo.algoName, select: algo.selected })),
    );
  }, [algoState]);

  const algoChange = (e: string) => {
    dispatch(selectAlgorithm(e));
    window.api.send('dispatch', selectAlgorithm(e));
  };

  const algoRoute = () => {
    navigate('/algo');
  };

  return (
    <Container>
      <UserInfo>
        <Summoner />
      </UserInfo>
      <AlgoContainer>
        <p style={{ borderBottom: '1px solid silver', padding: '10px' }}>Algorithm Select</p>
        <div style={{
          display: 'flex', padding: '10px', justifyContent: 'space-between', alignItems: 'center',
        }}
        >
          {algoArr.length > 0
            ? (
              <SelectBox
                width="90%"
                editionId={userState.leagueUserInfo.summonerId}
                options={algoArr.map((algo) => algo.name).filter((name) => name !== 'New')}
                defaultValue={algoArr.filter((algo) => algo.select)[0].name}
                selectedOption={algoArr.filter((algo) => algo.select)[0].name}
                requestFunc={algoChange}
              />
            )
            : null}
          <Button editionId={userState.leagueUserInfo.summonerId} onClick={algoRoute}><AiOutlinePlus style={{ width: '60%', height: '60%' }} /></Button>
        </div>
        <AlgoDesc
          algoData={algoState.length
            ? algoState.filter((algo) => algo.selected)[0].algoData : initAlgo}
        />
      </AlgoContainer>
    </Container>
  );
}
