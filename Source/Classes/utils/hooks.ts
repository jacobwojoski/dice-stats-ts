import { DiceStatsTracker } from "../main";
import { DS_GLOBALS } from "../globals";
import { GetNamespaces } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/core/settings.mjs";

// Initialize dialog and settings on foundry boot up
Hooks.once('init', () => {
    // Initialize the DS instance 
    DiceStatsTracker.get_instance();

    // Setup the DB

    // Setup API

    // Call Dice Stats API Ready hook
    
    // Setup handler for midi-qol support 
});

// Autoload DB info on connection if setting is checked
Hooks.once('ready', () => {
    let DiceStats = DiceStatsTracker.get_instance();

    DS_GLOBALS.GAME_SYSTEM_ID = `${game?.system?.id}`;

    // New Players might get added throught the game so update map on playerlist render. 
    DiceStats.update_map();

    // TODO: Update how we handle checkboxes now that callbacks can be bound ( Make all forms singleton classes? )
    // Comparison form needs player list which needs to wait for game to be in ready state.
    // DS_GLOBALS.DS_OBJ_GLOBAL.updateComparisonFormCheckboxes() 

    if(game?.settings?.get(<any>DS_GLOBALS.MODULE_ID, <any>DS_GLOBALS.MODULE_SETTINGS.ENABLE_AUTO_DB)) 
    {
        DiceStatsTracker.get_instance().load_all_player_data();
    }
});

// Parse chat message when one gets displayed
Hooks.on('createChatMessage', (chatMessage:any) => {
    // Check if were pausing saving player roll data
    if(game?.settings?.get(<any>DS_GLOBALS.MODULE_ID, <any>DS_GLOBALS.MODULE_SETTINGS.GLOBAL_PAUSE_SAVING_DATA) === false){
        DiceStatsTracker.get_instance().parse_message(<any>chatMessage);
    }
});
