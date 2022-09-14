import React, {
  Dispatch, SetStateAction, useRef, RefObject, useEffect, useState,
} from 'react';
import styled from 'styled-components';

/*
  SelectBox 클릭 여부에 따라 Active 상태 처리하는 Hook
  - SelectBox 클릭 시 true
  - 그 외 공간 클릭 시 false
 */
const useSelect = <T extends HTMLElement>(
  selectBox: RefObject<T>,
): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [clickSelectedBox, setClickSelectedBox] = useState(false);

  useEffect(() => {
    const handleSelect = (e: MouseEvent) => {
      if (!e.target) return;

      if (!selectBox.current?.contains(e.target as HTMLElement)) {
        setClickSelectedBox(false);
      }
    };
    document.addEventListener('click', handleSelect);
    return () => document.removeEventListener('click', handleSelect);
  }, [selectBox]);
  return [clickSelectedBox, setClickSelectedBox];
};

const Label = styled.label<{ width: number | string, type: string }>`
  position: relative;
  display: inline-block;
  width: ${({ width }) => (typeof width === 'string' ? width : `${width}px`)};
  color: ${({ theme }) => theme.palette.gray};
  margin: ${({ type }) => (type === 'register' ? '10px 0px' : '0')};
`;

const Select = styled.select<{type: string}>`
  padding: ${({ type }) => (type === 'register' ? '0rem' : '1rem')};
  width: 100%;
  outline: none;
  border: none;
  color: ${({ theme }) => theme.palette.gray};
  border-bottom: 1px solid ${({ theme }) => theme.palette.borderGray};
  border-radius: 4px;
  cursor: pointer;
  font-size: ${({ type }) => (type === 'register' ? '1.5rem' : '2rem')};
`;

const SelectItemContainer = styled.div<{type: string}>`
  margin-top: 0.5rem;
  border: 1px solid ${({ theme }) => theme.palette.borderGray};
  border-radius: 5px;
  box-shadow: 0px 4px 13px rgba(0, 0, 0, 0.25);
  position: ${({ type }) => (type === 'register' ? 'absolute' : null)};
  width: ${({ type }) => (type === 'register' ? '100%' : null)};
  background-color: ${({ type }) => (type === 'register' ? 'white' : null)};
  z-index: 1;

  -webkit-animation: 0.3s linear normal slide_down;
          animation: 0.3s linear normal slide_down;

  @keyframes slide_down {
    0% {
      opacity: 0.1;
    }
    100% {
      opacity: 1;
    }
  }
`;

const SelectItem = styled.option<{type:string}>`
  height: ${({ type }) => (type === 'register' ? '1.5rem' : '2.5rem')};
  font-size: ${({ type }) => (type === 'register' ? '1.5rem' : '2rem')};
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.palette.borderGray};
  padding: 1rem 1rem 2rem 1rem;
  :hover {
    color: ${({ theme }) => theme.palette.eliceViolet}
  }
`;

const defaultProps = {
  requestFunc: null,
  type: '',
};

type ISelectBoxProps = {
  options: string[] | number[];
  defaultValue: string;
  selectedOption: string | number;
  setSelectedOption: Dispatch<SetStateAction<string>> | Dispatch<SetStateAction<number>>;
  width: string | number;
  requestFunc?: any;
  type?: string;
} & typeof defaultProps;

function SelectBox({
  options,
  defaultValue,
  selectedOption,
  setSelectedOption,
  width,
  requestFunc,
  type,
}: ISelectBoxProps) {
  const labelRef = useRef<HTMLLabelElement>(null);
  const [clickSelectedBox, setClickSelectedBox] = useSelect(labelRef); // SelectBox가 클릭됐는지 여부 체크

  // SelectBox 클릭 이벤트 핸들러
  const handleOpenSelectBox = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.button === 0) { setClickSelectedBox(true); }
  };

  // requestFunc로 넘어온 API 요청 등을 여기서 처리
  const handleSelectItemClick = (e: any) => {
    const optionValue = e.target.value; // 선택한 option

    setSelectedOption(optionValue); // 선택된 Option Value 설정
    setClickSelectedBox(false); // Option 선택하면 Select Box 닫기

    if (requestFunc) {
      requestFunc(optionValue); // 선택된 Option을 인자로 요청 함수 실행
    }
  };

  return (
    <Label
      width={width}
      ref={labelRef}
      type={type}
      onMouseDown={handleOpenSelectBox}
    >
      <Select type={type} value={selectedOption} onChange={handleSelectItemClick}>
        <option>{defaultValue}</option>
        {options.map((option, i) => (
          <option key={String(i) + option} value={option}>
            {option}
          </option>
        ))}
      </Select>
      {clickSelectedBox && (
        <SelectItemContainer type={type}>
          {options.map((option, i) => (
            <SelectItem
              key={String(i) + option}
              onClick={handleSelectItemClick}
              type={type}
            >
              {option}
            </SelectItem>
          ))}
        </SelectItemContainer>
      )}
    </Label>
  );
}

SelectBox.defaultProps = defaultProps;

export default SelectBox;
