const cron = require('node-cron');

import { Request, Response, NextFunction } from 'express';
import { getLeaderboardSheetData, getLeaderboardSheetDataRange } from '../../modules/spreadsheet';
import { PlayerData } from '~/types';

// 毎秒更新
let players: PlayerData[] = null

async function update() {
    const sheet = await getLeaderboardSheetData()
    players = sheet.toPlayers()
    console.log("a")
 }

cron.schedule('*/5 * * * * *', () => { update() });

//プレイヤー検索
const findPlayer = (name: string): PlayerData => {
    return players.find(player => player.name.toLowerCase() === name.toLowerCase())
}

module.exports.players = async function (req: Request, res: Response, next: NextFunction ) {

   if(players == null) return res.status(500).json({
        message: 'Players is empty'
   });
   
   res.json(players)
}

module.exports.getPlayer = async function (req: Request, res: Response, next: NextFunction) {
    var name = req.params.name;
    
    if(players == null) return res.status(500).json({
        message: 'Players is empty'
   });

    const player = findPlayer(name)

    if(player == undefined) return res.status(500).json({
        message: 'No found player'
    });

    return res.json(player)
}