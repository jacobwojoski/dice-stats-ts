import { Player } from "./local_storage/player_info";
import { FORM_TYPE } from "./globals";
/**
 * Main Dice Stats data storage class
 *  This is a singleton 
 */
export class DiceStatsTracker {
    /* Stuff for singleton format */
    static instance:DiceStatsTracker;
    public static get_instance() {
        if(!DiceStatsTracker.instance) {
            DiceStatsTracker.instance = new DiceStatsTracker();
        }
        return DiceStatsTracker.instance
    }

    // Main Storage Objects for Dice Stats, Array of Players & Array of UI Forms
    private _player_map = new Map<string, Player>();
    private _forms = new Array();

    // Get a form object, Player form requires an ID to get
    public get_form( type: FORM_TYPE, player_id: number = -1){
        
    }

    /**
     * Update global map to add a key value pair for every user.
     * key:value = {int}userid:{PLAYER}PLAYER Object
     */
    public updateMap(){
        //Add everyplayer to storage. Were tracking all even if we dont need
        let users = game?.users ?? [];
        for (let user of users ) {
            if(!this._player_map.has(user.id)){
                this._player_map.set(user.id, new Player(user.id))    
            }
        }
    }
}