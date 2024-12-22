/* Import Obj's */
import { DS_GLOBALS, FORM_TYPE } from "../globals.js";
import { DiceStatsTracker } from "../main.js";

/* Import UI's */
// import { GlobalStatusForm } from "../forms/dice-stats-globalstatuspage.js";
// import { ComparePlayerForm } from "../forms/dice-stats-compareplayerspage.js";
// import { ExportDataPage } from "../forms/dice-stats-exportdatapage.js";
// import { PlayerInfoForm } from "../forms/dice-stats-tabedplayerstatspage.js";

/**
 * This class is the API for dice stats. Used to allow other modules & macros easily access the data.
 * 
 * Different Functions:        Fn Returns
 * 
 * saveRollValue({STRING:Player_id}, {ENUM:DIE_TYPE: #}, {INT: #}) -> Save a roll result to a player
 * saveRollInfo({STRING:Player_id}, {DS_MSG_ROLL_INFO}) -> Save a roll object
 * getPlayerList({VOID})        -> String[]=    Array of player ID's that are stored in the dice stats database
 * getGlobals({VOID})           -> DS_GLOBALS=  Global Dice Stats Object & Enums 
 * 
 * openGlobalStats({VOID})      -> Open Global Stats UI
 * openCompareStats({VOID})     -> Open Compare Stats UI
 * openPlayerStats({INT} player_id) -> Open the players stats for the player ID selected
 * openExportStats({BOOL} isGM) -> Open Export page if they're the GM
 * 
 */

/* --- Examples on how to use API
    // if I need to do something as soon as the cool-module is ready
    Hooks.on('diceStatsReady', (api) => {
    // do what I need with their api
    });

    // alternatively if I know that the API should be populated when I need it,
    // I can defensively use the api on game.modules
    game.modules.get('diceStatsReady')?.api?.diceStatsApiStaticMethod(someInput)
*/
export class DiceStatsAPI {
    /**
     * @returns {String []} - Array of player id's that are stored in the map
     */
    static get_player_ids(){
        // Return list of player id's saved in map
        return DiceStatsTracker.get_instance().get_player_ids();
    }

    static get_dice_stats_instance(){
        return DiceStatsTracker.get_instance();
    }

    /**
     * @returns {VOID} - Renders UI Component
     */
    static async open_global_form(){
        DiceStatsTracker.get_instance().get_form(FORM_TYPE.GLOBAL_FORM)?.render(true);
    }

    /**
     * @returns {VOID} - Renders UI Component
     */
    static async open_compare_form(){
        DiceStatsTracker.get_instance().get_form(FORM_TYPE.COMPARE_FORM)?.render(true);
    }

    /**
     * @returns {VOID} - Renders UI Component
     */
    static open_player_form(player_id:string){
        DiceStatsTracker.get_instance().get_form(FORM_TYPE.PLAYER_FORM, player_id)?.render(true);
    }

    /**
     * @param isGM - Is the person calling this the GM?
     * @returns {VOID} - Renders UI Component
     */
    static open_export_form(isGM: boolean){
        if (isGM) {
            DiceStatsTracker.get_instance().get_form(FORM_TYPE.EXPORT_FORM)?.render(true);
        }
    }

    /**
     * @param isGM - Is the person calling this the GM?
     * @returns {VOID} - Renders the import data form
     */
    static open_import_form(isGM: boolean){
        if (isGM) {
            DiceStatsTracker.get_instance().get_form(FORM_TYPE.IMPORT_FORM)?.render(true);
        }
    }

    /**
     * TODO:
     * save_roll
     * save_system_data
     */
}