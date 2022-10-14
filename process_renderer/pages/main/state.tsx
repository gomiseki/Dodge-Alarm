import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import mix from 'mix-color';

import { algoScoreType } from '../../../types/algorithm.type';

import { RootState } from '../../../store';

const Container = styled.div`
    display: flex;
    align-items: center ;
    width: 100%;
    height: 35px;
`;
const DodgeScore = styled.div<{total:number}>`
    background-color: ${(props) => mix(props.theme.palette.winGreen, props.theme.palette.loseRed, props.total / 100)};
    width: 200px;
    height:80%;
    color : white;
    font-weight: bolder ;
    display: flex;
    justify-content: center; 
    align-items: center ;
`;

function State() {
  const inGameScore = useSelector((state:RootState) => state.INGAMESCORE);
  const [total, setTotal] = useState(0);

  const getScore = useCallback((score: algoScoreType) => {
    let sum = 0;
    // eslint-disable-next-line guard-for-in
    for (const data in score) {
      const temp = score[data];
      if ('score' in temp) sum += temp.score;
    }
    return parseFloat(sum.toFixed(1));
  }, []);

  useEffect(() => {
    if (inGameScore) {
      let score = 0;
      inGameScore.forEach((cell) => {
        score += getScore(cell);
      });
      setTotal(score / 5);
    }
  }, [inGameScore]);

  return (
    <Container>
      {inGameScore.length
            && (
            <DodgeScore total={total}>
              {`DodgeScore: ${total.toFixed(1)}`}
              <p style={{ fontSize: '10px', marginLeft: '5px' }}>avg</p>
            </DodgeScore>
            )}
    </Container>
  );
}
export default State;
