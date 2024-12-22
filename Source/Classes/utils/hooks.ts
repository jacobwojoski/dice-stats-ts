import { DiceStatsTracker } from "../main";
import { DS_GLOBALS } from "../globals";

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
    DS_GLOBALS.GAME_SYSTEM_ID = `${game?.system?.id}`;

    //New Players might get added throught the game so update map on playerlist render. 
    DS_GLOBALS.DS_OBJ_GLOBAL.updateMap();

    //Comparison form needs player list which needs to wait for game to be in ready state.
    DS_GLOBALS.DS_OBJ_GLOBAL.updateComparisonFormCheckboxes() 

    if(game?.settings?.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.ENABLE_AUTO_DB)) 
    {
        DS_GLOBALS.DS_OBJ_GLOBAL.loadAllPlayerData();
    }

    // --- GM Clear all POPUP ---
    // Check Setting if popup enabled, (I like tracking stats per session so I clear my data every game)
    if( game?.user?.isGM &&
        game?.settings?.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.GLOBAL_ENABLE_CLEAR_ALL_STATS_POPUP))
    {   // Bring Up Popup
        DICE_STATS_UTILS.clearAllData();
    }
});

//Parse chat message when one gets displayed
Hooks.on('createChatMessage', (chatMessage:any) => {
    // Check if were pausing saving player roll data
    if(game?.settings?.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.GLOBAL_PAUSE_SAVING_DATA) === false){
        DS_GLOBALS.DS_OBJ_GLOBAL.parseMessage(chatMessage);
    }
});
