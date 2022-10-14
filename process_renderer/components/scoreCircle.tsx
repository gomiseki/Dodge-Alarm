import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import mix from 'mix-color';
import { algoScoreType } from '../../types/algorithm.type';

type ScoreCircleType = {
    size:number,
    stroke:number,
    score:algoScoreType,
    main:boolean,
    // eslint-disable-next-line no-unused-vars
    onHover?:(event: React.MouseEvent<SVGCircleElement>, prop:string)=>void,
}

const scoreColor:{[index:string]:string} = {
  deathPerMatch: 'red',
  KDAPerMatch: 'orange',
  winRate: 'yellow',
  maxDeathPerCount: 'green',
  positionRatio: 'navy',
  champUseRatio: 'purple',
  userLevel: 'black',
  isPrevSeason: 'blue',
};

const sizeChange = (
  event: React.MouseEvent<SVGCircleElement>,
  color:string,
  radius:number,
  value:number,
  offset:number,
  stroke:number,
) => {
  event.currentTarget.setAttribute('stroke', 'transparent');
  const r = radius + 10;
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '50');
  circle.setAttribute('cy', '50');
  circle.setAttribute('r', `${r}`);
  circle.setAttribute('fill', 'none');
  circle.setAttribute('stroke', color);
  circle.setAttribute('stroke-width', `${stroke * 1.3}`);
  circle.setAttribute('stroke-dasharray', `${2 * Math.PI * r * (value / 100)} ${2 * Math.PI * r * (1 - (value / 100))}`);
  circle.setAttribute('stroke-dashoffset', `${(2 * Math.PI * r * (offset)) / 100}`);
  circle.id = 'temp';
  event?.currentTarget?.parentNode?.appendChild(circle);
};
const sizeReturn = (event: React.MouseEvent<SVGCircleElement>, color:string) => {
  document?.getElementById('temp')?.remove();
  event.currentTarget.setAttribute('stroke', color);
};

const getOffset = (score:algoScoreType) => {
  const arr:{[index:string]:number} = {};
  let prev = 0;
  Object.keys(score).forEach((v:string) => {
    const value = score[v];
    if ('score' in value && value) {
      arr[v] = value.score + prev;
      prev = value.score + prev;
    }
  });
  return arr;
};

const getScore = (score:algoScoreType) => {
  let sum = 0;
  // eslint-disable-next-line guard-for-in
  for (const data in score) {
    const temp = score[data];
    if ('score' in temp)sum += temp.score;
  }
  return parseFloat(sum.toFixed(1));
};

const StyledCircle = styled.circle<{total:number, r:number}>`
    stroke:${(props) => (props.total ? mix(props.theme.palette.winGreen, props.theme.palette.loseRed, props.total / 100) : props.stroke)};
    animation: 1s ease-in-out 0s 1 spin;
    stroke-dasharray: ${(props) => `${2 * Math.PI * props.r * (props.total / 100)} ${2 * Math.PI * props.r * ((100 - props.total) / 100)}`};
    @keyframes spin {
        from{
            stroke-dasharray: 0;
        }
        to {
            stroke-dasharray:${(props) => `${2 * Math.PI * props.r * (props.total / 100)} ${2 * Math.PI * props.r * ((100 - props.total) / 100)}`};
        }
    }
`;
const defaultProps = {
  onHover: () => {},
};

export default function ScoreCircle({
  size, stroke, score, main = false, onHover,
}:ScoreCircleType) {
  const [offset, setOffset] = useState<{[index:string]:number}>({});

  useEffect(() => {
    setOffset(getOffset(score));
  }, [score]);

  if (main) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'relative', transform: 'rotate(90deg) scaleX(-1)' }}>
        <StyledCircle
          total={getScore(score)}
          cx={50}
          cy={50}
          r={50 - stroke}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
      <circle
        stroke="white"
        cx={50}
        cy={50}
        r={50 - stroke - 10}
        fill="none"
        strokeWidth={stroke}
        strokeOpacity={0.05}
      />
      {Object.keys(offset).length > 0 && Object.keys(score).map((prop) => {
        const value = score[prop];
        const color = scoreColor[prop];
        const radius = 50 - stroke - 10;
        if ('score' in value && value) {
          return (
            <circle
              stroke={color}
              cx={50}
              cy={50}
              r={radius}
              strokeDasharray={`${2 * Math.PI * radius * (value.score / 100)} ${2 * Math.PI * radius * (1 - (value.score / 100))}`}
              strokeDashoffset={`${(2 * Math.PI * radius * (offset[prop])) / 100}`}
              fill="none"
              strokeWidth={stroke}
              onMouseOver={(e) => {
                sizeChange(e, color, radius, value.score, offset[prop], stroke);
                if (onHover) onHover(e, prop);
              }}
              onMouseOut={(e) => { sizeReturn(e, color); }}
            />
          );
        }
        return (
          <div />
        );
      })}
    </svg>
  );
}

ScoreCircle.defaultProps = defaultProps;
