import { DieInfo } from "./dice_info";
import { NUM_DIE_TYPES, DIE_TYPE, DS_GLOBALS } from "../globals";
import { SystemInfoFactory, SystemInfo } from "./system_info/generic_system_info";

export class Player {
    username: string = '';
    user_id: string = '';
    isGM: boolean = false;

    system_info: SystemInfo;
    player_dice: Map<DIE_TYPE, DieInfo> = new Map<DIE_TYPE, DieInfo>();

    constructor(userid: string){ 
        // Setup info about the player with the realated User ID that was passed in
        if(userid){
            this.user_id = userid;
            
            /* Vars: name & isGM aren't defined in typescript's type:user  by default. 
                Need to cast it as any to fix error */
            let user:any = game?.users?.get(userid) 
            if (user){
                this.username = user?.name;
                this.isGM = user?.isGM;
            }
        }

        // Create dice objects (Tracks each die roll)
        for( let type of Object.values(DIE_TYPE) ){
            const die_max = Number(type)
            this.player_dice.set(die_max, new DieInfo(die_max))
        }

        // Create System Data Info
        this.system_info = SystemInfoFactory.getSystemInfoType(DS_GLOBALS.GAME_SYSTEM_ID);
    }
}