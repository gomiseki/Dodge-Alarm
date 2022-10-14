import React from 'react';
import {
  HashRouter, Route, Routes,
} from 'react-router-dom';
import styled from 'styled-components';
import { AiOutlineClose, AiOutlineMinus } from 'react-icons/ai';

import { darken } from 'polished';
import { useSelector } from 'react-redux';
import Button from '../../components/buttons';
import Nav from '../../components/nav';

import Home from './home';
import { RootState } from '../../../store';
import theme from '../../styles/theme';
import Algo from './algo';
import Info from './info';

const Container = styled.div<{editionId: string}>`
    width: 100%;
    height: 100%;
    background-color: ${(props) => (props.theme.editions[props.editionId] ? props.theme.editions[props.editionId].themeMain : props.theme.palette.themeMain)};
    display: flex;
    flex-direction: column ;
    align-items: center;
`;
const Title = styled.div`
    width: 100%;
    display:flex;
    flex-basis: 90px;
    -webkit-app-region: drag;
`;
const Logo = styled.div`
    flex:5;
    padding:20px ;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color:white;
`;
const KR = styled.h1`
    -webkit-user-select: none;
    font-size: medium;
    font-weight:550;
    border-bottom: 1px solid white;
    padding:5px;
`;
const EN = styled.div`
    -webkit-user-select: none;
    padding:5px;
    font-size: x-small;
    font-weight:500;
`;

const Team = styled.span<{teamColor: string}>`
  background-color: ${(props) => darken(0.15, props.teamColor)};
  padding: 2px;
  border-radius: 5px;
  font-weight:600;
  margin-right: 5px;
`;

const Icons = styled.div`
    flex:1;
    padding:20px 20px 0 0;
    display:flex;
    justify-content: space-around;
`;
const NavContainer = styled.div`
    width: 90%;
    height: 40px;
`;
const Main = styled.main<{ editionId?: string }>`
    width: 90%;
    background-color:${(props) => darken(0.2, props.theme.editions[props.editionId] ? props.theme.editions[props.editionId].themeMain : props.theme.palette.themeMain)};
    border-radius: 0 5px 5px 5px;
    padding: 10px 0;
`;
const Footer = styled.footer`
    width: 90%; 
    height: 70px;
    border-radius: 0 0 5px 5px ;
    margin: 0 20px 20px;
`;

const minWindow = () => {
  window.api.send('Minimize-Window');
};

const closeWindow = () => {
  window.api.send('Close-Window');
};

function Ready() {
  const userState = useSelector((state: RootState) => state.USER);
  console.log(userState.apiStatus.league, userState.leagueUserInfo.summonerId, theme);
  return (
    <HashRouter>
      <Container editionId={userState.leagueUserInfo.summonerId}>
        <Title>
          <Logo>
            <KR>너 쌩배지! - 닷지 경보기</KR>
            <EN>
              {userState.apiStatus.league
              && theme.editions[userState.leagueUserInfo.summonerId]
                ? (
                  <>
                    <Team teamColor={theme.editions[userState.leagueUserInfo.summonerId].themeMain}>
                      {theme.editions[userState.leagueUserInfo.summonerId].team}
                    </Team>
                    {theme.editions[userState.leagueUserInfo.summonerId].name}
                    {' '}
                    Edition
                  </>
                )
                : 'League of Legends Dodge analysis tool'}
            </EN>
          </Logo>
          <Icons>
            <Button onClick={minWindow}><AiOutlineMinus style={{ width: '20px', height: '20px' }} /></Button>
            <Button onClick={closeWindow}><AiOutlineClose style={{ width: '20px', height: '20px' }} /></Button>
          </Icons>
        </Title>
        <NavContainer>
          <Nav />
        </NavContainer>
        <Main editionId={userState.leagueUserInfo.summonerId}>
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="algo" element={<Algo />} />
            <Route path="info" element={<Info />} />
          </Routes>
        </Main>
        <Footer />
      </Container>
    </HashRouter>
  );
}

export default Ready;
