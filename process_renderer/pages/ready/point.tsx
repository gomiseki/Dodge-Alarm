import React from 'react';
import styled from 'styled-components';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import Tooltip from './tooltip';

const PointContainer = styled.div`
    width:60px;
    height: 30px;
    position: relative ;
`;

const ScoreInput = styled.input<{editionId?:string}>`
    width: 100%;
    height: 100%;
    background-color:${(props) => (props.theme.editions[props.editionId] ? props.theme.editions[props.editionId].themeMain : props.theme.palette[props.color ? props.color : 'themeMain'])};
    position: absolute ;
    padding: 0;
    border: none ;
    border-radius: 5px;
    :focus{
        outline: none ;
    };
    font-weight: bolder;
    padding-left:5px ;
`;

const QuestionIcon = styled(AiOutlineQuestionCircle)`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 0;
  top: 50%;
  transform:translate(0, -50%);
  color: black
`;

const defaultProps = {
  editionId: '',
};

const scoreScript = `100포인트를 모두 소모하여 
알고리즘을 만들어 주세요. 
위험도가 높은 유저에게 
높은 점수를 부여합니다.`;

export default function Point({ score, editionId }: { score: number, editionId?:string }) {
  return (
    <PointContainer>
      <ScoreInput editionId={editionId} readOnly value={score} />
      <Tooltip id="desc" place="bottom" text={scoreScript}>
        <QuestionIcon />
      </Tooltip>
    </PointContainer>
  );
}

Point.defaultProps = defaultProps;
