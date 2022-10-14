import React, { useRef, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import Button from './buttons';

type numberProps = {
  max?: number;
  min?: number;
  name: string;
  value: number;
  step?: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Container = styled.div`
    height: 20px; 
    margin-left: 20px;
    position:relative;
    min-width: 80px;
    border: 2px solid silver;
`;
const NumberInput = styled.input`
    position: absolute;
    width:100%;
    height: 100% ;
    padding:0;
    border: none ;
    text-align: center ;
    ::-webkit-inner-spin-button { 
      -webkit-appearance: none;
    }
`;
const plusStyle = {
  position: 'absolute' as const,
  top: 0,
  right: 0,
  height: '100%',
};
const minusStyle = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  height: '100%',
};

const defaultProps = {
  max: 100,
  min: 0,
  step: 1,
};

export default function Number({
  max = 100, min = 0, name, value, step = 1, onChange,
}: numberProps) {
  const numRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value) numRef.current?.setAttribute('value', '0');
    else numRef.current?.setAttribute('value', value.toString());
  }, [value]);

  const plus = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    numRef.current?.stepUp();
    numRef.current?.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const minus = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    numRef.current?.stepDown();
    numRef.current?.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    onChange(e);
  };

  return (
    <Container>
      <NumberInput type="number" max={max} min={min} name={name} step={step} onChange={inputChange} ref={numRef} />
      <Button style={minusStyle} onClick={minus}><AiOutlineMinus /></Button>
      <Button style={plusStyle} onClick={plus}><AiOutlinePlus /></Button>
    </Container>

  );
}

Number.defaultProps = defaultProps;
