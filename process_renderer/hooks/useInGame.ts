import { useState, useEffect, useCallback } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import {
  Algorithms_type, Algorithm_type,
} from '../../types/algorithm.type';
import { inGameDataType } from '../../store/inGame';
import { RootState } from '../../store';
import algoAnalysis from '../utils/algoAnalysis';

export default function useIngame() {
  console.log('score');
  const getSelected = useCallback((algorithm:Algorithms_type[]) => {
    let selected:Algorithm_type|false = false;
    algorithm.forEach((element) => {
      if (element.selected) selected = element.algoData;
    });
    return selected;
  }, []);

  const getParticipantScore = (algoData:Algorithm_type|boolean, inGameData:inGameDataType[]|[]) => {
    const arr:any[] = [];
    if (inGameData.length > 0) {
      inGameData.forEach((data:inGameDataType) => {
        if ('summonerMatchData' in data && data?.summonerMatchData?.match?.length) {
          arr.push(algoAnalysis(algoData, data));
        } else {
          arr.push([]);
        }
      });
    }
    return arr;
  };

  const inGameData = useSelector((state:RootState) => state.INGAME, shallowEqual);
  const algorithm = useSelector((state:RootState) => getSelected(state.ALGORITHM));
  const [algorithmScore, setAlgorithmScore] = useState<any[]>([]);

  useEffect(() => {
    if (algorithm && inGameData.length) {
      console.log(algorithm, inGameData);
      setAlgorithmScore(() => getParticipantScore(algorithm, inGameData));
    }
  }, [algorithm, inGameData]);

  useEffect(() => {
    console.log(algorithmScore);
    window.api.send('dispatch', { type: 'SET_INGAMESCORE', payload: algorithmScore });
  }, [algorithmScore]);

  return algorithm;
}
