// reducer and action function
import {
  createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';
import type{ Store } from 'redux';
import type { IpcMain, BrowserWindow } from 'electron';
import type{
  readdirSync, readFileSync, writeFileSync, renameSync, unlinkSync,
} from 'fs-extra';
import logger from 'redux-logger';
import axios from 'axios';
import Algorithm, { setAlgorithm } from './algorithm';
import User from './user';
import InGame from './inGame';
import GameAsset, { setGameAsset } from './gameAsset';

import { Algorithm_type, Algorithms_type } from '../types/algorithm.type';

import type{ RiotAPI } from '../process_main/apis/riot';

import IngameScore from './inGameScore';

// middlewares
import processSync from './middleware/processSync';
import riotAPiFetch from './middleware/riotApiFetch';

import { PATCH_TO_CHAMP, GET_PATCH_VERSION } from '../consts/riotConsts';

const rootReducer = combineReducers({
  ALGORITHM: Algorithm,
  USER: User,
  INGAME: InGame,
  INGAMESCORE: IngameScore,
  GAMEASSET: GameAsset,
});

// IpcMain|Window["api"]
interface mainProcess{
    Main:IpcMain,
    Win:()=>BrowserWindow[],
    RiotConnection:RiotAPI,
    fs: {
        readDir:typeof readdirSync,
        readFile:typeof readFileSync,
        writeFile:typeof writeFileSync,
        renameFile:typeof renameSync,
        unlinkFile:typeof unlinkSync,
        algoPath:string
    }
}
interface rendererProcess{
    Renderer:Window['api']
}

const getAlgoInfo = (algoList:string[], path:string, readfile:typeof readFileSync):any[] => {
  const algoData:Algorithms_type[] = [];
  algoList.forEach((algo) => {
    if (algo !== 'New.json') {
      algoData.push({
        algoName: algo.slice(0, -5),
        algoData: JSON.parse(readfile(`${path}\\${algo}`, 'utf8')),
        selected: false,
      });
    }
  });
  algoData.push({
    algoName: 'New',
    algoData: JSON.parse(readfile(`${path}\\New.json`, 'utf8')),
    selected: false,
  });
  return algoData;
};

const setAlgoFile = (
  name:string,
  data:Algorithms_type,
  path:string,
  writeFile:typeof writeFileSync,
) => {
  writeFile(`${path}\\${name}.json`, JSON.stringify(data.algoData), 'utf8');
};

const renameAlgoFile = (
  oldname:string,
  newName:string,
  path:string,
  renameFile:typeof renameSync,
) => {
  renameFile(`${path}\\${oldname}.json`, `${path}\\${newName}.json`);
};

const configureStore = (ipc:mainProcess|rendererProcess) => {
  let store:Store;
  if ('Renderer' in ipc) {
    // render store inializing
    store = createStore(rootReducer, applyMiddleware(
      processSync(ipc),
      logger,
    ));
    ipc.Renderer.on('dispatch', (e, action) => {
      store.dispatch(action);
    });
    ipc.Renderer.send('init');
  } else {
    // main store inializing
    store = createStore(rootReducer, applyMiddleware(
      processSync(ipc),
      riotAPiFetch(ipc.RiotConnection),
    ));
    ipc.Main.on('init', () => {
      const allState = store.getState();
      Object.keys(allState).forEach((result:string) => {
        store.dispatch({ type: `SET_${result}`, payload: allState[result] });
      });
    });

    ipc.Main.on('dispatch', (e, action) => {
      store.dispatch(action);
    });

    ipc.Main.on('Make-Algorithm', (e, algoData:Algorithms_type) => {
      const selectedAlgo = store.getState().ALGORITHM.find((algo:Algorithm_type) => algo.selected);
      if (selectedAlgo.algoName === 'New') {
        setAlgoFile(algoData.algoName, algoData, ipc.fs.algoPath, ipc.fs.writeFile);
        const algoInitData = getAlgoInfo(ipc.fs.readDir(ipc.fs.algoPath), ipc.fs.algoPath, ipc.fs.readFile).filter((name) => name !== 'New');
        algoInitData.find((algo) => algo.algoName === algoData.algoName).selected = true;
        store.dispatch(setAlgorithm(algoInitData));
      } else {
        setAlgoFile(selectedAlgo.algoName, algoData, ipc.fs.algoPath, ipc.fs.writeFile);
        renameAlgoFile(
          selectedAlgo.algoName,
          algoData.algoName,
          ipc.fs.algoPath,
          ipc.fs.renameFile,
        );
        const algoInitData = getAlgoInfo(ipc.fs.readDir(ipc.fs.algoPath), ipc.fs.algoPath, ipc.fs.readFile).filter((name) => name !== 'New');
        algoInitData.find((algo) => algo.algoName === algoData.algoName).selected = true;
        store.dispatch(setAlgorithm(algoInitData));
      }
    });

    ipc.Main.on('Delete-Algorithm', (e, algoName) => {
      ipc.fs.unlinkFile(`${ipc.fs.algoPath}\\${algoName}.json`);
      const algoInitData = getAlgoInfo(ipc.fs.readDir(ipc.fs.algoPath), ipc.fs.algoPath, ipc.fs.readFile).filter((name) => name !== 'New');
      algoInitData[0].selected = true;
      store.dispatch(setAlgorithm(algoInitData));
    });

    // setAlgorithm
    const algoInitData = getAlgoInfo(ipc.fs.readDir(ipc.fs.algoPath), ipc.fs.algoPath, ipc.fs.readFile).filter((name) => name !== 'New');
    algoInitData[0].selected = true;
    console.log(algoInitData);
    store.dispatch(setAlgorithm(algoInitData));

    // setGameAsset
    axios.get(GET_PATCH_VERSION)
      .then((version) => {
        store.dispatch(setGameAsset({ patchVersion: version.data[0] }));
        axios.get(PATCH_TO_CHAMP(version.data[0]))
          .then((result) => {
            store.dispatch(setGameAsset({ champIdToName: result.data }));
          });
      });

    // for debugging
    // setTimeout(() => {
    //   store.dispatch(setPickStatus(exampleUserSet.myTeam));
    //   store.dispatch(setSummonerFeature(ingame));
    // }, 5000);
  }
  return store;
};

export default configureStore;

export type RootState = ReturnType<typeof rootReducer>;
