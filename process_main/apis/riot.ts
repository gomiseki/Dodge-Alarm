/* eslint-disable class-methods-use-this */
import axios, { AxiosResponse } from 'axios';
import { ipcMain } from 'electron';
import {
  GET_MATCHES_BY_PUUID,
  GET_MATCH_BY_MATCHID,
  GET_SUMMONER_BY_NAME,
  RIOT_API_URL,
  RIOT_API_URL_ASIA,
  GET_ENTRIES_BY_ID,
}
  from '../../consts/riotConsts';

import { Participant_type } from '../../types/participant.type';
import { ParticipantMatchData_type, Match } from '../../types/matchData.type';
import { userInfoAPI_type, userLeague_type } from '../../types/userInfo.type';

export default class RiotAPI {
  constructor() {
    console.log('riotAPI-inst-set');
  }

  async getSummoner(userName:string):Promise<userInfoAPI_type> {
    try {
      const userData = await RiotAPI.callAPI(GET_SUMMONER_BY_NAME, userName, '?');
      console.log('summoner-api-fetched');
      return userData.data;
    } catch (error) {
      console.log(error);
      throw new Error('SUMMONER_API_rejected');
    }
  }

  async getLeague(id:string): Promise<userLeague_type> {
    try {
      const userData = await RiotAPI.callAPI(GET_ENTRIES_BY_ID, id, '?');
      const userSoloData = userData.data.find((v:userLeague_type) => v.queueType === 'RANKED_SOLO_5x5');
      console.log('league-api-fetched');
      return userSoloData;
    } catch (error) {
      console.log(error);
      throw new Error('LEAGUE_API_rejected');
    }
  }

  async playerToHistory(data:Participant_type[], before:number):
  Promise<ParticipantMatchData_type[]> {
    const playerData = data.slice();
    const result = await Promise.all(playerData.map(async (player) => {
      try {
        const playerInfo = await RiotAPI.callAPI(GET_SUMMONER_BY_NAME, player.name || '', '?');
        const historyData = await RiotAPI.callAPI(GET_MATCHES_BY_PUUID, `${playerInfo.data.puuid}/ids?type=ranked&start=0&count=${before}`, '&', true);
        const playerAPI = await this.getLeague(playerInfo.data.id);
        const matchData = await RiotAPI.historyToMatch(historyData.data);
        return ({ player, playerAPI, match: matchData });
      } catch (error) {
        return { player: null, playerAPI: null, match: null };
      }
    }));
    return result;
  }

  static async historyToMatch(historyData:string[]):Promise<Match[]> {
    const matchData = historyData.slice();
    const result = await Promise.all(matchData.map(async (matchName) => {
      try {
        const matchInfo = await RiotAPI.callAPI(GET_MATCH_BY_MATCHID, matchName, '?', true);
        return { matchId: matchName, matchData: matchInfo.data };
      } catch (error) {
        return { matchId: '', matchData: null };
      }
    }));
    return result;
  }

  static async callAPI(endpoint:string, data:string, orAnd:string, asia = false)
  :Promise<AxiosResponse<any, any>> {
    const URL = encodeURI(`${asia ? RIOT_API_URL_ASIA : RIOT_API_URL}${endpoint}${data}${orAnd}api_key=${import.meta.env.VITE_RIOT_API_KEY}`);
    return new Promise((resolve, reject) => {
      axios.get(URL)
        .then((result) => {
          resolve(result);
        })
        .catch(() => {
          this.callAPI(endpoint, data, orAnd, asia).then(resolve).catch(reject);
        });
    });
  }

  static async removeHandle() {
    ipcMain.removeHandler('Match-History');
  }
}

export type { RiotAPI };
