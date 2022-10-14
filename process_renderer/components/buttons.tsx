/* eslint-disable no-nested-ternary */
import React from 'react';
import styled, { css } from 'styled-components';
import { darken, lighten } from 'polished';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ButtonProps extends React.ComponentProps<'button'>{
    children:React.ReactNode;
    color?:string;
    size?:string;
    title?:string;
    // eslint-disable-next-line no-unused-vars
    onClick:(event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface ExtendProps extends ButtonProps{
  editionId:string;
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
  large: {
    height: '30px',
    width: '30px',
  },
};

const sizeStyles = css`
    ${(props: ButtonProps) => css`
        height: ${props.size && sizes[props.size].height};
        width: ${props.size && sizes[props.size].width};
    `}
`;

const Btn = styled.button<ExtendProps>`
    -webkit-app-region:no-drag;
    cursor: pointer;
    padding:0;
    border:none;
    display:flex;
    justify-content: center;
    align-items: center ;
    background-color:${(props) => (
    props.color !== 'themeMain' && props.color ? props.theme.palette[props.color]
      : props.theme.editions[props.editionId] ? props.theme.editions[props.editionId].themeMain
        : props.theme.palette.themeMain
  )};
    &:hover {
        background-color: ${(props) => lighten(0.1, props.color !== 'themeMain' && props.color ? props.theme.palette[props.color]
    : props.theme.editions[props.editionId] ? props.theme.editions[props.editionId].themeMain
      : props.theme.palette.themeMain)};
    }
    &:active {
         background-color: ${(props) => darken(0.1, props.color !== 'themeMain' && props.color ? props.theme.palette[props.color]
    : props.theme.editions[props.editionId] ? props.theme.editions[props.editionId].themeMain
      : props.theme.palette.themeMain)};
    }
    ${sizeStyles};
`;

const defaultProps = {
  title: '',
  color: 'themeMain',
  size: 'medium',
};

export default function Button({
  children, color, size, onClick, title, style,
}:ButtonProps) {
  const userState = useSelector((state: RootState) => state.USER);
  return (
    <Btn
      style={style}
      title={title}
      editionId={userState.leagueUserInfo.summonerId}
      size={size}
      color={color}
      onClick={onClick}
    >
      {children}
    </Btn>
  );
}

Button.defaultProps = defaultProps;
