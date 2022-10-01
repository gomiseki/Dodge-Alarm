import { useState, useEffect, useRef } from 'react';
import { Algorithm_type } from '../../types/algorithm.type';

const getScore = (data:Algorithm_type) => {
  let score = 100;
  Object.keys(data).forEach((prop) => {
    if (prop !== 'matchCount' && data[prop]) {
      score -= data[prop].ratio;
    }
  });
  return score;
};

export default function useScore(algoData:Algorithm_type) {
  const [score, setScore] = useState(100);
  useEffect(() => {
    setScore(() => getScore(algoData));
  }, [algoData]);

  return [score];
}
