import React from 'react';
import styled from 'styled-components';
import Number from '../../components/numberInput';
import RangeInput from '../../components/rangeInput';

interface algopSettingProps {
  score: number,
  algoProps: any,
  algoKey: string,
  // eslint-disable-next-line no-unused-vars
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const AlgoSetContainer = styled.div`
  width: 100%;
  height: 100%;
  font-size: small;
  display:flex;
  flex-direction: column ;
`;
const SetProp = styled.div`
  display:flex;
  margin: 5px 0;
  align-items: center ;
  margin-left: 2px;
`;

const SetCol = styled.div`
  display:flex;
  flex-direction: column;
  margin: 5px 0;
  justify-content: center ;
`;

export default function AlgoSetting({
  score, algoProps, algoKey, onChange,
}: algopSettingProps) {
  if (typeof algoProps !== 'number') {
    switch (algoKey) {
      case 'deathPerMatch':
        return (
          <AlgoSetContainer>
            <SetCol>
              <p style={{ width: '100px' }}>위험도: </p>
              <RangeInput
                min={0}
                max={10}
                leftName="minScore"
                rightName="maxScore"
                left={algoProps.minScore}
                right={algoProps.maxScore}
                onChange={onChange}
              />
            </SetCol>
            <SetProp>
              <p style={{ width: '100px' }}>반영비:</p>
              <Number name="ratio" max={score + algoProps.ratio} value={algoProps.ratio} onChange={onChange} />
            </SetProp>
          </AlgoSetContainer>
        );
      case 'KDAPerMatch':
        return (
          <AlgoSetContainer>
            <SetCol>
              <p style={{ width: '100px' }}>위험도: </p>
              <RangeInput
                min={0}
                max={5}
                leftName="maxScore"
                rightName="minScore"
                left={algoProps.maxScore}
                right={algoProps.minScore}
                reverse
                onChange={onChange}
              />
            </SetCol>
            <SetProp>
              <p style={{ width: '100px' }}>반영비:</p>
              <Number name="ratio" max={score + algoProps.ratio} value={algoProps.ratio} onChange={onChange} />
            </SetProp>
          </AlgoSetContainer>
        );
      case 'winRate':
        return (
          <AlgoSetContainer>
            <SetCol>
              <p style={{ width: '100px' }}>위험도: </p>
              <RangeInput
                min={0}
                max={100}
                reverse
                leftName="maxRatio"
                rightName="minRatio"
                left={algoProps.maxRatio}
                right={algoProps.minRatio}
                onChange={onChange}
              />
            </SetCol>
            <SetProp>
              <p style={{ width: '100px' }}>반영비:</p>
              <Number name="ratio" max={score + algoProps.ratio} value={algoProps.ratio} onChange={onChange} />
            </SetProp>
          </AlgoSetContainer>
        );
      case 'maxDeathPerCount':
        return (
          <AlgoSetContainer>
            <SetCol>
              <p style={{ width: '100px' }}>위험도: </p>
              <RangeInput
                min={0}
                max={100}
                leftName="minRatio"
                rightName="maxRatio"
                left={algoProps.minRatio}
                right={algoProps.maxRatio}
                onChange={onChange}
              />
            </SetCol>
            <SetProp>
              <p style={{ width: '100px' }}>기준데스:</p>
              <Number name="maxDeath" max={10} value={algoProps.maxDeath} onChange={onChange} />
            </SetProp>
            <SetProp>
              <p style={{ width: '100px' }}>반영비:</p>
              <Number name="ratio" max={score + algoProps.ratio} value={algoProps.ratio} onChange={onChange} />
            </SetProp>
          </AlgoSetContainer>
        );
      case 'positionRatio':
        return (
          <AlgoSetContainer>
            <SetCol>
              <p style={{ width: '100px' }}>위험도: </p>
              <RangeInput
                min={0}
                max={100}
                leftName="maxRatio"
                rightName="minRatio"
                reverse
                left={algoProps.maxRatio}
                right={algoProps.minRatio}
                onChange={onChange}
              />
            </SetCol>
            <SetProp>
              <p style={{ width: '100px' }}>반영비:</p>
              <Number name="ratio" max={score + algoProps.ratio} value={algoProps.ratio} onChange={onChange} />
            </SetProp>
          </AlgoSetContainer>
        );
      case 'champUseRatio':
        return (
          <AlgoSetContainer>
            <SetCol>
              <p style={{ width: '100px' }}>위험도: </p>
              <RangeInput
                min={0}
                max={100}
                leftName="maxRatio"
                rightName="minRatio"
                reverse
                left={algoProps.maxRatio}
                right={algoProps.minRatio}
                onChange={onChange}
              />
            </SetCol>
            <SetProp>
              <p style={{ width: '100px' }}>반영비:</p>
              <Number name="ratio" max={score + algoProps.ratio} value={algoProps.ratio} onChange={onChange} />
            </SetProp>
          </AlgoSetContainer>
        );
      case 'userLevel':
        return (
          <AlgoSetContainer>
            <SetCol>
              <p style={{ width: '100px' }}>위험도: </p>
              <RangeInput
                min={30}
                max={100}
                reverse
                leftName="maxScore"
                rightName="minScore"
                left={algoProps.maxScore}
                right={algoProps.minScore}
                onChange={onChange}
              />
            </SetCol>
            <SetProp>
              <p style={{ width: '100px' }}>반영비:</p>
              <Number name="ratio" max={score + algoProps.ratio} value={algoProps.ratio} onChange={onChange} />
            </SetProp>
          </AlgoSetContainer>
        );
      case 'isPrevSeason':
        return (
          <AlgoSetContainer>
            <SetProp>
              <p style={{ width: '100px' }}>반영비:</p>
              <Number name="ratio" max={score + algoProps.ratio} value={algoProps.ratio} onChange={onChange} />
            </SetProp>
          </AlgoSetContainer>
        );
      default:
        return (
          <div />
        );
    }
  } else {
    return <div />;
  }
}
