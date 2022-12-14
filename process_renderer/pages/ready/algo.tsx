import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { TiDocumentAdd, TiDocumentDelete } from 'react-icons/ti';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

import { RootState } from '../../../store';
import SelectBox from '../../components/selectBox';

import Tooltip from '../../components/tooltip';

import {
  Algorithm_type,
  Algorithms_type,
  AllAlgo_type,
  initAlgo,
  AlgoPropsToDesc,
} from '../../../types/algorithm.type';

import { selectAlgorithm } from '../../../store/algorithm';

import useScore from '../../hooks/useScore';
import Button from '../../components/buttons';
import Point from './point';

import Number from '../../components/numberInput';
import AlgoSetting from './algoSettings';

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

const Warning = styled.input<{success:boolean}>`
    font-size: 12px;
    margin-left:10px;
    width:90%;
    background-color: transparent ;
    :focus{
        outline: none ;
    }
    border: none ;
    color:${(props) => (props.success ? props.theme.palette.winGreen : props.theme.palette.LCKRed)};
`;

const objDeepCopy = (prev: any, data: any) => JSON.parse(JSON.stringify(Object.assign(prev, data)));

const CheckContainer = styled.div`
    width:100%;
    display:flex;
    flex-direction: column ;
`;

const CheckDiv = styled.div`
    width: 100%;
    height:30px;
    display:flex;
    align-items: center ;
`;

const CheckInput = styled.input`
  margin-right: 10px;
`;

const CheckName = styled.label`
`;

const CheckProps = styled.div`
    width: 100%;
    margin:10px 0;
`;

const QuestionIcon = styled(AiOutlineQuestionCircle)`
  width: 16px;
  height: 16px;
  color: silver;
  margin-left: 10px;
`;

function CheckBox({
  score, originProps, algoProps, algoKey, onPropsChange,
}: {
  score: number,
  // eslint-disable-next-line react/require-default-props
  originProps?: React.MutableRefObject<any>,
  algoProps: AllAlgo_type,
  algoKey: string,
  // eslint-disable-next-line no-unused-vars
  onPropsChange: (data:any) => void
}) {
  const [checked, setChecked] = useState(false);

  const onCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    if (e.target.checked) {
      if (originProps?.current[algoKey]) {
        onPropsChange({ [algoKey]: originProps.current[algoKey] });
      } else {
        onPropsChange({ [algoKey]: initAlgo[algoKey] });
      }
    } else {
      onPropsChange({ [algoKey]: false });
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, valueAsNumber } = e.target;
    if (algoKey === 'matchCount') { onPropsChange({ [algoKey]: valueAsNumber }); } else {
      onPropsChange({ [algoKey]: objDeepCopy(algoProps, { [name]: valueAsNumber }) });
    }
  };

  useEffect(() => {
    setChecked(Boolean(algoProps));
  }, [algoProps]);

  return (
    <CheckContainer>
      <CheckDiv>
        {algoKey === 'matchCount' ? null : <CheckInput type="checkbox" checked={checked} onChange={onCheck} value={algoKey} />}
        <CheckName>{AlgoPropsToDesc[algoKey].name}</CheckName>
        <Tooltip id={algoKey} place="right" text={AlgoPropsToDesc[algoKey].description}>
          <QuestionIcon />
        </Tooltip>
        {algoKey === 'matchCount' && typeof algoProps === 'number' ? <Number name={algoKey} value={algoProps} onChange={onChange} /> : null}
      </CheckDiv>
      {algoKey !== 'matchCount' && checked
        ? (
          <CheckProps>
            <AlgoSetting
              algoKey={algoKey}
              score={score}
              algoProps={algoProps}
              onChange={onChange}
            />
          </CheckProps>
        ) : null}
    </CheckContainer>
  );
}

export default function Algo() {
  // set redux state
  const userState = useSelector((state: RootState) => state.USER);
  const algoState = useSelector((state: RootState) => state.ALGORITHM);
  const dispatch = useDispatch();

  // react state for edit algorithm
  const [algoArr, setAlgoArr] = useState([{ name: '', select: true }]); // ??????????????? ????????? ????????????(?????????)
  const [algoName, setAlgoName] = useState(''); // ???????????? ?????? (?????????)
  const [algoData, setAlgoData] = useState(initAlgo); // ???????????? ?????????
  const originProps = useRef(); // ???????????? ?????????
  const [warning, setWarning] = useState({ success: false, message: '' }); // ??????

  // custom hook
  const [score] = useScore(algoData); // ??????????????? ?????? dodge score

  // select?????? ???????????? ??????
  const getSelectedAlgo = useCallback((data: Algorithms_type[]) => {
    let algo: Algorithms_type|false = false;
    data.forEach((e) => {
      if (e.selected) algo = e;
    });
    return objDeepCopy({}, algo);
  }, []);

  // ???????????? ?????? ??????
  const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAlgoName(e.target.value);
  }, []);

  // ???????????? ??????
  const algoChange = (e: string) => {
    dispatch(selectAlgorithm(e));
    window.api.send('dispatch', selectAlgorithm(e));
  };

  const onPropsChange = (data: any) => {
    const key = Object.keys(data)[0];
    const assignData = objDeepCopy({}, algoData);
    assignData[key] = data[key];
    setAlgoData(assignData);
  };

  // ???????????? ?????? ??????
  const submitAlgo = () => {
    if (!score) {
      if (algoName) {
        if (algoName === 'New') {
          setWarning({ success: false, message: 'New??? ???????????? ??? ??? ?????????.' });
          setTimeout(() => {
            setWarning({ success: false, message: '' });
          }, 2000);
        } else if (
          algoState
            .filter((algo) => !algo.selected)
            .map((algo) => algo.algoName)
            .includes(algoName)) {
          setWarning({ success: false, message: '?????? ???????????? ???????????????.' });
          setTimeout(() => {
            setWarning({ success: false, message: '' });
          }, 2000);
        } else {
          const assignData: Algorithm_type = objDeepCopy({}, algoData);
          Object.keys(assignData).forEach((key) => {
            if (assignData[key].ratio === 0 && key !== 'matchCount') {
              assignData[key] = false;
            }
          });
          window.api.send('Make-Algorithm', {
            algoName,
            algoData: assignData,
            selected: true,
          });
          setWarning({ success: true, message: '?????????????????????.' });
          setTimeout(() => {
            setWarning({ success: false, message: '' });
          }, 2000);
          setAlgoData(assignData);
        }
      } else {
        setWarning({ success: false, message: '???????????? ????????? ???????????????.' });
        setTimeout(() => {
          setWarning({ success: false, message: '' });
        }, 2000);
      }
    } else {
      setWarning({ success: false, message: '???????????? ??? ???????????? ?????????.' });
      setTimeout(() => {
        setWarning({ success: false, message: '' });
      }, 2000);
    }
  };

  const deleteAlgo = () => {
    if (algoName === 'New') {
      setWarning({ success: false, message: 'New??? ????????? ??? ????????????.' });
      setTimeout(() => {
        setWarning({ success: false, message: '' });
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
          requestFunc={algoChange}
        />
      </Label>
      <Score>
        <TextField
          value={algoName}
          onChange={onNameChange}
        />
        <Button title="???????????? ?????? ??????" color="LCKBlue" size="large" onClick={submitAlgo}>
          <TiDocumentAdd style={{ width: '100%', height: '80%' }} />
        </Button>
        <Button title="???????????? ??????" color="LCKRed" size="large" onClick={deleteAlgo}>
          <TiDocumentDelete style={{ width: '100%', height: '80%' }} />
        </Button>
        <Point score={score} editionId={userState.leagueUserInfo.summonerId} />
      </Score>
      <Warning readOnly success={warning.success} value={warning.message} />
      <Main>
        <CheckBox score={score} onPropsChange={onPropsChange} algoProps={algoData.matchCount} algoKey="matchCount" />
        {Object.keys(algoData).map((algoKey) => (algoKey === 'matchCount' ? null
          : (
            <CheckBox
              score={score}
              originProps={originProps}
              onPropsChange={onPropsChange}
              algoProps={algoData[algoKey]}
              algoKey={algoKey}
            />
          )))}
      </Main>
    </Continer>
  );
}
