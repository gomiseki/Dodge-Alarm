import { BrowserWindow } from 'electron';
import {
  connect,
  Credentials,
  LeagueClient,
  LeagueWebSocket,
  request,
} from 'league-connect';
import { Store } from 'redux';
import { gamePhase } from '../../types/champSelect.type';
import { userInfo_type } from '../../types/userInfo.type';

import {
  LCU_ENDPOINT_CHAMP_SELECT,
  LCU_ENDPOINT_USER_STATUS,
  LCU_ENDPOINT_PARTICIPANTS,
} from '../../consts/lcuConsts';

import { setLocalUser, clearUser } from '../../store/user';
import {
  clearInGame, setPickStatus, setSummonerFeature,
} from '../../store/inGame';
import { setClientState } from '../../store/gameAsset';
import { clearScore } from '../../store/inGameScore';

export default class LCU {
  lolClientConnection:LeagueClient;

  lolClientCredentials:Credentials;

  lolWebSocket!: LeagueWebSocket;

  userInfo!: userInfo_type;

  isPick = false;

  store:Store;

  constructor(credentials:Credentials, readyWindow:()=>void, store:Store) {
    this.store = store;
    LCU.closeReady();
    this.lolClientConnection = new LeagueClient(credentials);
    this.lolClientCredentials = credentials;
    console.log('Client Connected');
    this.lolClientConnection.on('connect', (newCredentials) => {
      console.log('Client Connected');
      LCU.closeReady();
      this.lolClientConnection = new LeagueClient(newCredentials);
      this.lolClientCredentials = newCredentials;
      this.setUser();
    });

    this.lolClientConnection.on('disconnect', () => {
      console.log('Client Disconnected');
      readyWindow();
      this.store.dispatch(clearUser());
    });

    this.lolClientConnection.start();
    this.setUser();
  }

  // async setWebSocket(lolClientCredentials:Credentials) {
  //   return new Promise((resolve, reject) => {
  //     connect(lolClientCredentials)
  //       .then(async (result) => {
  //         this.lolWebSocket = result;

  //         this.LCURequest('GET', LCU_ENDPOINT_CHAMP_SELECT)
  //           .then((result) => {
  //             this.isPick = true;
  //             const chatRoom = `${result.chatDetails.chatRoomName.split('@')[0]}%40champ-select.kr1.pvp.net`;
  //             this.getParticipant(chatRoom);
  //           })
  //           .catch((error) => {
  //             this.isPick = false;
  //           });

  //         this.lolWebSocket.subscribe(LCU_ENDPOINT_CHAMP_SELECT, async (pickData, e) => {
  //           pickData.myTeam.length ? this.store.dispatch(setPickStatus(pickData.myTeam)) : null;
  //           if (pickData.chatDetails.chatRoomName !== '' && !this.isPick) {
  //             console.log('pickStart');
  //             this.isPick = true;
  //             const chatRoom = `${pickData.chatDetails.chatRoomName.split('@')[0]}%40champ-select.kr1.pvp.net`;
  //             await this.getParticipant(chatRoom);
  //           } else if (pickData.chatDetails.chatRoomName == '' && this.isPick) {
  //             this.isPick = false;
  //             this.store.dispatch(setClientState(false));
  //           } else {
  //             console.log(pickData.timer.phase);
  //             if (pickData.timer.phase == 'PLANNING') {
  //               this.store.dispatch(setClientState([false, false, false, false, false, false, false, false, false, false]));
  //             } else {
  //               const pickPhase = await this.getPhase(pickData.actions);
  //               this.store.dispatch(setClientState(pickPhase));
  //             }
  //           }
  //         });
  //         console.log('Socket-Connected');
  //       })
  //       .catch((error) => {
  //         console.log('Socket-Connection-Rejected');
  //         setTimeout(() => {
  //           this.setWebSocket(lolClientCredentials).then(resolve).catch(reject);
  //         }, 1000);
  //       });
  //   });
  // }

  async setWebSocket(lolClientCredentials:Credentials) {
    return new Promise((resolve, reject) => {
      connect(lolClientCredentials)
        .then(async (socket) => {
          this.lolWebSocket = socket;
          this.LCURequest('GET', LCU_ENDPOINT_CHAMP_SELECT)
            .then((result:any) => {
              this.isPick = true;
              const chatRoom = `${result.chatDetails.chatRoomName.split('@')[0]}%40champ-select.kr1.pvp.net`;
              this.getParticipant(chatRoom);
            })
            .catch(() => {
              this.isPick = false;
            });
          this.lolWebSocket.subscribe(LCU_ENDPOINT_CHAMP_SELECT, async (pickData) => {
            if (pickData.myTeam.length) this.store.dispatch(setPickStatus(pickData.myTeam));
            if (pickData.chatDetails.chatRoomName !== '' && !this.isPick) {
              console.log('pickStart');
              this.isPick = true;
              const chatRoom = `${pickData.chatDetails.chatRoomName.split('@')[0]}%40champ-select.kr1.pvp.net`;
              await this.getParticipant(chatRoom);
            } else if (pickData.chatDetails.chatRoomName === '' && this.isPick) {
              this.isPick = false;
              this.store.dispatch(setClientState(false));
            } else {
              console.log(pickData.timer.phase);
              if (pickData.timer.phase === 'PLANNING') {
                this.store.dispatch(
                  setClientState(
                    [false, false, false, false, false, false, false, false, false, false],
                  ),
                );
              } else {
                const pickPhase = await LCU.getPhase(pickData.actions);
                this.store.dispatch(setClientState(pickPhase));
              }
            }
          });
          console.log('Socket-Connected');
        })
        .catch((error) => {
          console.log('Socket-Connection-Rejected', error);
          setTimeout(() => {
            this.setWebSocket(lolClientCredentials).then(resolve).catch(reject);
          }, 1000);
        });
    });
  }

  async getParticipant(chatRoom:string):Promise<any> {
    this.store.dispatch(clearInGame());
    this.store.dispatch(clearScore());
    return new Promise((resolve, reject) => {
      this.LCURequest('GET', LCU_ENDPOINT_PARTICIPANTS(chatRoom))
        .then((result: any) => {
          if (result.length === 5) {
            this.store.dispatch(setSummonerFeature(result));
            resolve(result);
          } else {
            this.getParticipant(chatRoom).then(resolve).catch(reject);
          }
        })
        .catch(() => {
          this.getParticipant(chatRoom).then(resolve).catch(reject);
        });
    });
  }

  async setUser() {
    return new Promise((resolve, reject) => {
      this.LCURequest('GET', LCU_ENDPOINT_USER_STATUS)
        .then((result: any) => {
          console.log('Set-User-completed');
          this.userInfo = result;
          console.log(result);
          this.store.dispatch(setLocalUser(result));
          this.setWebSocket(this.lolClientCredentials);
        })
        .catch((error) => {
          console.log('Set-User-Rejected', error);
          setTimeout(() => {
            this.setUser().then(resolve).catch(reject);
          }, 1000);
        });
    });
  }

  async LCURequest(httpMethod:any, endPoint:string) {
    const result = await request({
      method: httpMethod,
      url: endPoint,
    }, this.lolClientCredentials);
    const data = await result.json();
    if ('errorCode' in data) {
      throw new Error('LCU-Request-Rejected');
    } else {
      return data;
    }
  }

  static async getPhase(actions:gamePhase[][]) {
    const arr = [false, false, false, false, false, false, false, false, false, false];
    actions.forEach((action, i) => {
      let banCompleted = false;
      if (actions[1][0].completed) {
        banCompleted = true;
      }
      if (i === 0 && !banCompleted) {
        action.forEach((player) => {
          if (player.type === 'ban' && player.isAllyAction) {
            arr[player.actorCellId] = player.isInProgress;
          }
        });
      } else if (i > 1 && banCompleted) {
        action.forEach((player) => {
          if (player.type === 'pick' && player.isAllyAction) {
            arr[player.actorCellId] = Boolean(player.isInProgress || player.completed);
          }
        });
      }
    });
    return arr;
  }

  static async closeReady() {
    BrowserWindow.getAllWindows().forEach((w) => {
      if (w.title === '너 쌩배지 - 닷지 경보기')w.close();
    });
  }
}
