import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { TiDocumentAdd, TiDocumentDelete } from 'react-icons/ti';
import Tooltip from 'react-tooltip';
import { RootState } from '../../../store';
import SelectBox from '../../components/selectBox';

import {
  Algorithm_type,
  Algorithms_type,
  AllAlgo_type,
  initAlgo,
  AlgoPropsToDesc,
} from '../../../types/algorithm.type';

import useScore from '../../hooks/useScore';
import Button from '../../components/buttons';
import Point from './point';

const Continer = styled.div`
    height:480px;
    color: white;
    display:flex;
    flex-direction: column;
    align-items: center;
`;

const Label = styled.div`
    width:90%;
    height: 50px;
    display:flex;
    justify-content: space-between ;
    align-items: center ;
    border-bottom: 1px solid silver;
`;

const Score = styled.div`
    width:90%;
    height: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center ;
`;

const TextField = styled.input`
  width: 150px;
  height: 30px;
  border-radius: 2px;
  border: none;
  padding: 0 10px;
`;

const Main = styled.div`
    width:90%;
    height:380px;
    overflow-y: auto;
    &::-webkit-scrollbar {
        width: 5px;
        background-color: silver;
        border-radius:2px;
    }
    &::-webkit-scrollbar-thumb {
        width:5px;
        background-color: black;
        border-radius: 2px;
    }
`;

const Warning = styled.input`
    font-size: 12px;
    margin-left:5px;
    width:80%;
    background-color: transparent ;
    :focus{
        outline: none ;
    }
    border: none ;
    color:${(props) => props.theme.palette.LCKRed};
`;

const objDeepCopy = (prev: any, data: any) => JSON.parse(JSON.stringify(Object.assign(prev, data)));

export default function Algo() {
  // set redux state
  const userState = useSelector((state: RootState) => state.USER);
  const algoState = useSelector((state: RootState) => state.ALGORITHM);

  // react state for edit algorithm
  const [algoArr, setAlgoArr] = useState([{ name: '', select: true }]); // 임시적으로 선택된 알고리즘(수정용)
  const [algoName, setAlgoName] = useState(''); // 알고리즘 이름 (수정용)
  const [algoData, setAlgoData] = useState(initAlgo); // 알고리즘 표현용
  const originProps = useRef(); // 알고리즘 수정용
  const [warning, setWarning] = useState(''); // 경고

  // custom hook
  const [score] = useScore(algoData); // 알고리즘에 따른 dodge score

  // select옵션 알고리즘 반환
  const getSelectedAlgo = useCallback((data: Algorithms_type[]) => {
    let algo;
    data.forEach((e) => {
      if (e.selected) algo = e;
    });
    return objDeepCopy({}, algo);
  }, []);

  // 알고리즘 이름 변경
  const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAlgoName(e.target.value);
  }, []);

  // 알고리즘 저장 함수
  const submitAlgo = () => {
    if (!score) {
      if (algoName) {
        if (algoName === 'New') {
          setWarning('New는 이름으로 쓸 수 없어요.');
          setTimeout(() => {
            setWarning('');
          }, 2000);
        } else if (
          algoState
            .filter((algo) => !algo.selected)
            .map((algo) => algo.algoName)
            .includes(algoName)) {
          setWarning('이미 존재하는 이름이에요.');
          setTimeout(() => {
            setWarning('');
          }, 2000);
        } else {
          window.api.send('Make-Algorithm', {
            algoName,
            algoData,
            selected: true,
          });
        }
      } else {
        setWarning('알고리즘 이름을 지어주세요.');
        setTimeout(() => {
          setWarning('');
        }, 2000);
      }
    } else {
      setWarning('포인트를 다 사용해야 합니다.');
      setTimeout(() => {
        setWarning('');
      }, 2000);
    }
  };

  const deleteAlgo = () => {
    if (algoName === 'New') {
      setWarning('New는 삭제할 수 없습니다.');
      setTimeout(() => {
        setWarning('');
      }, 2000);
    } else {
      window.api.send('Delete-Algorithm', algoName);
    }
  };
  useEffect(() => {
    if (algoState.length > 0) {
      setAlgoName(algoState.filter((algo) => algo.selected)[0].algoName);
      setAlgoArr(
        algoState.map((algo) => ({ name: algo.algoName, select: algo.selected })),
      );
      setAlgoData(getSelectedAlgo(algoState).algoData);
      originProps.current = objDeepCopy({}, getSelectedAlgo(algoState).algoData);
    }
  }, [algoState]);

  return (
    <Continer>
      <Label>
        Algorithm Edit
        <SelectBox
          width="50%"
          options={algoArr.map((algo) => algo.name)}
          editionId={userState.leagueUserInfo.summonerId}
          defaultValue={algoArr.filter((algo) => algo.select)[0].name}
          selectedOption={algoArr.filter((algo) => algo.select)[0].name}
        />
      </Label>
      <Score>
        <TextField
          value={algoName}
          onChange={onNameChange}
        />
        <Button title="알고리즘 등록 수정" color="LCKBlue" size="large" onClick={submitAlgo}>
          <TiDocumentAdd style={{ width: '100%', height: '80%' }} />
        </Button>
        <Button title="알고리즘 삭제" color="LCKRed" size="large" onClick={deleteAlgo}>
          <TiDocumentDelete style={{ width: '100%', height: '80%' }} />
        </Button>
        <Point score={score} editionId={userState.leagueUserInfo.summonerId} />
      </Score>
      <Main>
        <Warning readOnly value={warning} />
      </Main>
    </Continer>
  );
}
