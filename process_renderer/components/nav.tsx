/* eslint-disable no-nested-ternary */
import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { darken } from 'polished';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface LinkType {
  isActive: boolean,
  editionId: string
}

const navData = [
  {
    title: '홈',
    path: '/',
  },
  {
    title: '알고리즘',
    path: '/algo',
  },
  {
    title: '유저정보',
    path: '/info',
  },
];

const Container = styled.nav`
    width:100%;
    height :100%;
`;
const Ulist = styled.ul`
    height: 100%;
    display:flex;
    align-items: flex-end ;
`;

const List = styled.li<LinkType>`
    margin-right: 1px;
    flex-basis: ${(props) => (props.isActive ? '88px' : '80px')};
    height: ${(props) => (props.isActive ? '100%' : '90%')};
    z-index: ${(props) => (props.isActive ? 0 : null)};
    color : ${(props) => (props.isActive ? 'white' : props.theme.editions[props.editionId] ? props.theme.editions[props.editionId].themeMain : props.theme.palette.themeMain)};
    background-color:${(props) => (props.isActive ? darken(0.2, props.theme.editions[props.editionId] ? props.theme.editions[props.editionId].themeMain : props.theme.palette.themeMain) : props.theme.palette.silver)};
    border-radius:5px 5px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover{
        z-index: ${(props) => (props.isActive ? 0 : null)};
        color : ${(props) => (props.isActive ? null : 'white')};
        background-color:${(props) => (props.isActive ? null : darken(0.2, props.theme.editions[props.editionId] ? props.theme.editions[props.editionId].themeMain : props.theme.palette.themeMain))};
        height:100%;
        flex-basis: ${(props) => (props.isActive ? null : '88px')};
    }
`;

const StyledLink = styled(Link)`
    color: inherit;
    width: 100% ;
    height: 100% ;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: small;
    text-decoration: none;
    border-radius:5px 5px 0 0;
`;
export default function Nav() {
  const userState = useSelector((state: RootState) => state.USER);
  const { pathname } = useLocation();
  return (
    <Container>
      <Ulist>
        {navData.map((data) => (
          <List editionId={userState.leagueUserInfo.summonerId} isActive={data.path === pathname}>
            <StyledLink to={data.path}>{data.title}</StyledLink>
          </List>
        ))}
      </Ulist>
    </Container>
  );
}
