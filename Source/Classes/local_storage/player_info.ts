import { DieInfo } from "./dice_info";
import { NUM_DIE_TYPES, DIE_TYPE, DS_GLOBALS } from "../globals";
import { SystemInfoFactory, SystemInfo } from "./system_info/generic_system_info";

export class Player {
    username: string = '';
    user_id: string = '';
    isGM: boolean = false;

    system_info: SystemInfo;
    player_dice: DieInfo[] = new Array(NUM_DIE_TYPES);

    constructor(userid: string){ 
        if(userid){
            this.user_id = userid;
            
            this.username = game?.users?.get(userid)?.name;
            this.isGM = game?.users?.get(userid)?.isGM;
        }

        // Create dice objects (Tracks each die roll)
        var playerDiceIt = 0;
        for(let i in Object.values(DIE_TYPE)){
            this.player_dice[playerDiceIt] = new DieInfo(i);
            playerDiceIt++;
        }

        // Create System Data Info
        this.system_info = SystemInfoFactory.getSystemInfoType(DS_GLOBALS.GAME_SYSTEM_ID);
    }
}