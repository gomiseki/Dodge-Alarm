import React from 'react';
import styled, { css } from 'styled-components';
import { darken, lighten } from 'polished';

interface ButtonProps extends React.ComponentProps<'button'>{
    children:React.ReactNode;
    editionId?:string;
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
    background-color:${(props) => (props.theme.editions[props.editionId] ? props.theme.editions[props.editionId].themeMain : props.theme.palette.themeMain)};
    &:hover {
        background-color: ${(props) => lighten(0.1, props.theme.editions[props.editionId] ? props.theme.editions[props.editionId].themeMain : props.theme.palette.themeMain)};
    }
    &:active {
         background-color: ${(props) => darken(0.1, props.theme.editions[props.editionId] ? props.theme.editions[props.editionId].themeMain : props.theme.palette.themeMain)};
    }
    ${sizeStyles};
`;

const defaultProps = {
  editionId: '',
  size: 'medium',
};

export default function Button({
  children, editionId, size, onClick,
}:ButtonProps) {
  return (
    <Btn
      editionId={editionId}
      size={size}
      onClick={onClick}
    >
      {children}
    </Btn>
  );
}

Button.defaultProps = defaultProps;
