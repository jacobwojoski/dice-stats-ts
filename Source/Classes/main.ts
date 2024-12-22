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
     * Callback for when we receive a chat message. Parse the data and save it in the local data storage
     * @param chat_message - foundry chat message object 
     */
    public parse_message(chat_message:any){
        let msg_data = <ChatMessage>chat_message;
        // Create System Parser from factory

        // Parse data bassed of system parser used 

        // Save System Sepecific Data

        // Save Generic Data
    }

    /**
     * Load data from the DB into local storage
     */
    public load_all_player_data(){

    }

    /**
     * Save our players player data into the flags DB
     */
    public save_data(){
        
    }
}