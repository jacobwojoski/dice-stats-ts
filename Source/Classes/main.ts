import { Player } from "./local_storage/player_info";
import { FORM_TYPE } from "./globals";

import { DiceStatsForm } from "./ui-components/generic_dice_stats_form";
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

    // Main Storage Objects for Dice Stats, Map of Players & Map of UI Forms
    private _player_map = new Map<string, Player>();
    // Forms are stored using type or playerid for PLAYER_FORMS. 
    // Getting a value from a map returns a reference so we can edit the value saved there without calling store again.
    private _forms = new Map<string, DiceStatsForm>;


    // Get a form object, Player form requires an ID to get
    public get_form( type: FORM_TYPE, player_id: string = ''): DiceStatsForm|undefined {
        if(type == FORM_TYPE.PLAYER_FORM){
            if (player_id != ''){
                return this._forms.get(String(player_id));
            }
            return undefined
        }
        return this._forms.get(String(type));
    }

    /**
     * Update global map to add a key value pair for every user.
     * key:value = {int}userid:{PLAYER}PLAYER Object
     */
    public update_map(){
        //Add everyplayer to storage. Were tracking all even if we dont need
        let users = game?.users ?? [];
        for (let user of users ) {
            if(!this._player_map.has(user.id)){
                this._player_map.set(user.id, new Player(user.id))    
            }
        }
    }

    /**
     * Get list of player ID's in the map
     */
    public get_player_ids(){
        return this._player_map.keys();
    }

    /**
     * Callback for when we receive a chat message. Parse the data and save it in the local data storage
     * @param chat_message - foundry chat message object 
     */
    public parse_message(chat_message:any){
        let msg_data = <ChatMessage>chat_message;
        // Create System Parser from factory

        // Parse data bassed of system parser used 

        // Save System Sepecific Data

        // Save Roll Data to local db
    }

    /**
     * Load data from the DB into local storage
     */
    public load_all_player_data(){

    }

    /**
     * Save our players player data into the flags DB
     */
    public save_data_to_db(){
        
    }

    /**
     * 
     * @param roll_data - roll data object holding system data & Dice Info
     * @param player_id - ID of player that created the message ( Rolled the die ) 
     */
    public save_roll_data(roll_data:any, player_id:any){

    }
}