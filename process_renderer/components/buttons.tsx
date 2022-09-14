import React from 'react';
import styled, { css } from 'styled-components';
import { darken, lighten } from 'polished';

interface ButtonProps extends React.ComponentProps<'button'>{
    children:React.ReactNode;
    color?:string;
    size?:string;
    // eslint-disable-next-line no-unused-vars
    onClick:(event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface SizeProps {
    [index: string]: {
        height: string,
        width: string
    }
}

const sizes: SizeProps = {
  medium: {
    height: '20px',
    width: '20px',
  },
};

const sizeStyles = css`
    ${(props: ButtonProps) => css`
        height: ${props.size && sizes[props.size].height};
        width: ${props.size && sizes[props.size].width};
    `}
`;

const Btn = styled.button<ButtonProps>`
    -webkit-app-region:no-drag;
    cursor: pointer;
    padding:0;
    border:none;
    display:flex;
    justify-content: center;
    align-items: center ;
    background-color:${(props) => props.color && props.theme.palette[props.color]};
    &:hover {
        background-color: ${(props) => props.color && lighten(0.1, props.theme.palette[props.color])};
    }
    &:active {
         background-color: ${(props) => props.color && darken(0.1, props.theme.palette[props.color])};
    }
    background-color: ${(props) => console.log(props)};
    ${sizeStyles};
`;

const defaultProps = {
  color: 'themeMain',
  size: 'medium',
};

export default function Button({
  children, color, size, onClick,
}:ButtonProps) {
  return (
    <Btn
      color={color}
      size={size}
      onClick={onClick}
    >
      {children}
    </Btn>
  );
}

Button.defaultProps = defaultProps;
