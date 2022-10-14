import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';

type Place = 'top' | 'right' | 'bottom' | 'left';
type Type = 'dark' | 'success' | 'warning' | 'error' | 'info' | 'light';
type Effect = 'float' | 'solid';

interface TooltipProps{
  children: React.ReactElement,
  id: string,
  place?: Place,
  effect?: Effect,
  type?: Type,
  text: string
}

const defaultProps = {
  place: 'top',
  effect: 'solid',
  type: 'dark',
};

export default function Tooltip({
  children, id, effect, type, place, text,
}: TooltipProps) {
  const [tooltip, showTooltip] = useState(true);

  return (
    <>
      {React.cloneElement(
        children,
        {
          'data-tip': true,
          'data-for': id,
          onMouseEnter: () => showTooltip(true),
          onMouseLeave: () => {
            showTooltip(false);
            setTimeout(() => showTooltip(true), 50);
          },
        },
      )}
      { tooltip
      && (
      <ReactTooltip id={id} place={place} effect={effect} type={type}>
        <pre>{text}</pre>
      </ReactTooltip>
      )}
    </>
  );
}

Tooltip.defaultProps = defaultProps;
