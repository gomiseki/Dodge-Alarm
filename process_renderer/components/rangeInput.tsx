import React, {
  useCallback, useEffect, useState, useRef,
} from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 230px;
  height: 80px;
`;

const Left = styled.input`
  pointer-events: none;
  position: absolute;
  height: 0;
  width: 200px;
  outline: none;
  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
    background-color: #f1f5f7;
    border: none;
    border-radius: 50%;
    box-shadow: 0 0 1px 1px #ced4da;
    cursor: pointer;
    height: 18px;
    width: 18px;
    margin-top: 4px;
    pointer-events: all;
    position: relative;
  }
   z-index: 3;
`;

const Right = styled.input`
  pointer-events: none;
  position: absolute;
  height: 0;
  width: 200px;
  outline: none;
  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
    background-color: #f1f5f7;
    border: none;
    border-radius: 50%;
    box-shadow: 0 0 1px 1px #ced4da;
    cursor: pointer;
    height: 18px;
    width: 18px;
    margin-top: 4px;
    pointer-events: all;
    position: relative;
  }
  z-index: 4;
`;

const Slider = styled.div`
  position: relative;
  width: 200px;
`;

const SliderTrack = styled.div`
  position: absolute;
  border-radius: 3px;
  height: 5px;
  background-color: #ced4da;
  width: 100%;
  z-index: 1;
`;

const SliderRange = styled.div`
  position: absolute;
  border-radius: 3px;
  height: 5px;
  background-color: #9fe5e1;
  z-index: 2;
`;

const LeftDesc = styled.p`
  margin-top: -30px;
  position: absolute;
  left: -10px;
`;

const RightDesc = styled.p`
  margin-top: -30px;
  position: absolute;
  right: -20px;
`;

const LeftValue = styled.div`
  position: absolute;
  color: #dee2e6;
  font-size: 12px;
  margin-top: 20px;
`;

const RightValue = styled.div`
  position: absolute;
  color: #dee2e6;
  font-size: 12px;
  margin-top: 20px;
  right: -4px;
`;

interface Props{
  min: number;
  max: number;
  leftName:string;
  rightName:string;
  left: number;
  right: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  reverse?: boolean;
}

const defaultProps = {
  reverse: false,
};

export default function RangeInput({
  min, max, left, right, leftName, rightName, onChange, reverse,
}:Props) {
  const [minVal, setMinVal] = useState(left);
  const [maxVal, setMaxVal] = useState(right);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef<HTMLInputElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max],
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);
    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, minVal, getPercent]);


  return (
    <Container>
      <Left
        type="range"
        min={min}
        max={max}
        value={minVal}
        name={leftName}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
          onChange(event);
        }}
        style={{ zIndex: minVal > max - 100 ? '5' : '3' }}
      />
      <Right
        type="range"
        min={min}
        max={max}
        value={maxVal}
        name={rightName}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;
          onChange(event);
        }}
      />

      <Slider>
        <SliderTrack />
        <LeftDesc>{reverse ? 'Danger' : 'Safe'}</LeftDesc>
        <RightDesc>{reverse ? 'Safe' : 'Danger'}</RightDesc>
        <SliderRange ref={range} />
        <LeftValue>{minVal}</LeftValue>
        <RightValue>{maxVal}</RightValue>
      </Slider>
    </Container>
  );
}

RangeInput.defaultProps = defaultProps;
