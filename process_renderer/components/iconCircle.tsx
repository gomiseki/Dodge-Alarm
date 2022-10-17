import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import mix from 'mix-color';
import { RootState } from '../../store';
import { CHAMP_ICON, POSITION, PROFILE_ICON } from '../../consts/riotConsts';

const ScoreCircle = styled.div<{size:string, total:number}>`
    width: ${(props) => props.size};
    height: ${(props) => props.size};
    border-radius: 50%;
    background-color: ${(props) => mix(props.theme.palette.winGreen, props.theme.palette.loseRed, props.total / 100)};
    display:flex;
    justify-content: center;
    align-items: center;
`;
const IconContainer = styled.div`
    width: 90%;
    height: 90%;
    border-radius: 50%;
    background-color: black ;
    display:flex;
    justify-content: center;
    align-items: center;
`;

const PositionCircle = styled.img`
    width: 70%;
    height:70%;
    border-radius: 50%;
`;
const DefaultCircle = styled.img`
    width: 100%;
    height:100%;
    border-radius: 50%;
`;
const defaultProps = {
  position: 'relative',
  userIcon: 0
};
export default function IconCircle({
  total, pick, position, userIcon, size,
}:{total:number, pick:number, position?:string, userIcon?:number, size:string}) {
  const idToName = useSelector((state:RootState) => state.GAMEASSET);

  const getNameFromId = (id:number):string => {
    if (Object.keys(idToName).length && idToName.champIdToName) {
      const champKey = Object
        .keys(idToName.champIdToName.data)
        .find((champ) => (
          idToName.champIdToName
            ? parseInt(idToName.champIdToName.data[champ].key, 10) === id
            : false));
      if (champKey) return champKey;
    }
    return '';
  };

  if (!userIcon && position) {
    return (
      <ScoreCircle size={size} total={total}>
        {(idToName.champIdToName && idToName.patchVersion)
          ? (
            <IconContainer>
              {getNameFromId(pick) && pick
                ? <DefaultCircle src={CHAMP_ICON(idToName.patchVersion, getNameFromId(pick))} />
                : <PositionCircle src={POSITION(position)} />}
            </IconContainer>
          )
          : null}
      </ScoreCircle>
    );
  }

  return (
    <ScoreCircle size={size} total={total}>
      {(idToName.champIdToName && idToName.patchVersion && userIcon)
        ? (
          <IconContainer>
            <DefaultCircle
              src={getNameFromId(pick)
                ? CHAMP_ICON(idToName.patchVersion, getNameFromId(pick))
                : PROFILE_ICON(idToName.patchVersion, userIcon)}
            />
          </IconContainer>
        )
        : null}
    </ScoreCircle>
  );
}

IconCircle.defaultProps = defaultProps;
