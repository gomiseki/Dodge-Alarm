import React from 'react';
import styled from 'styled-components';

type circleProps = {
    size:string,
    position?: string,
    style?:React.CSSProperties;
}

const LoadingCircle = styled.div<circleProps>`
    display: block;
    position: ${(props) => props.position};
    width: ${(props) => props.size};
    height:${(props) => props.size};
    border: 3px solid rgba(255,255,255,.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    margin-left: 5px ;
    -webkit-animation: spin 1s ease-in-out infinite;
    @keyframes spin {
    to { -webkit-transform: rotate(360deg); }
    }
    @-webkit-keyframes spin {
    to { -webkit-transform: rotate(360deg); }
    } 
`;

const defaultProps = {
  position: 'relative',
  style: { },
};

function Loading({ size, position, style }:circleProps) {
  return (
    <LoadingCircle size={size} position={position} style={style} />
  );
}
export default Loading;

Loading.defaultProps = defaultProps;
