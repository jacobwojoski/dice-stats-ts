import assert from "assert"

export default {
	ModuleName: "dice-stats-ts",
	IsModule: true, // If you are developing a system rather than a module, change this to false
}

// Pop some fairly universal types that we might use

export type Pair<T> = [string, T];
export const Assert = (value: unknown): void => assert(value);


/* */
/* Die Type thats being rolled */
export let NUM_DIE_TYPES: number = 10;
export enum DIE_TYPE {
	UNKNOWN = 0,
	D2 = 2,
	D3 = 3,
	D4 = 4,
	D6 = 6,
	D8 = 8,
	D10 = 10,
	D12 = 12,
	D20 = 20,
	D50 = 50,
	D100 = 100
}

/* The Type of Roll */
export let NUM_ROLL_TYPES: number = 12;
export enum ROLL_TYPE {
	UNKNOWN = 0,
	NORMAL_ROLL,	/* Normal rolls, Xd10, Yd15 etc */
	EXPLODING,		/* Normal rolls but exploding: 4d10x */
	TWO_D_X,		/* Roll two dice for outcome */
	D_PERCENT,		/* Roll d% - 1d10's + 1d1's */
	D_100,			/* D100 as d% */
	POOL_HIGH,		/* Dice Pools, Keep highest value */
	POOL_LOW,		/* Dice Pools, Keep lowest value*/
	POOL_HIGH_X,	/* Dice Pools, Keep highest X number of dice */
	POOL_LOW_X,		/* Dice Pools, Keep lowest X number of dice */
	POOL_NUMBER,	/* Dice Pools, Requiring a number of */
	POOL_EXPLODING_HIGH, /* Dice Pools, Keep X Exploding Dice - 1d4xkh2 (1d4 exploding dice) keep highest */
	POOL_EXPLODING_LOW	 /* Dice Pools, Keep Lowest X num of  Exploding Dice*/
}

/* Different forms the user can interact with */
export let NUM_FORM_TYPES: number = 5
export enum FORM_TYPE {
	UNKNOWN = 0,
	GLOBAL_FORM,
	COMPARE_FORM,
	EXPORT_FORM,
	PLAYER_FORM
}

/* Player form has multiple tabs,  */
export enum PLAYER_FORM_TAB {
	UNKNOWN = 0,
	MAIN,				/* Stats for singular dice rolls */
	SYSTEM_CHARTS,		/* Charts for system specifc roll types, (Dice Pools, 2DX Rolls etc */
	SYSTEM_DETAILS		/* Stats for some system specifc info. Mostly descriptors # Crits, # Fails, Herpoints Helping? etc */
}


export class DS_GLOBALS {
	static GAME_SYSTEM_ID 	= '';		/* Filled in on module init */
    static MODULE_SOCKET 	= null;		/* Socket Object to allow clients to communicate with eachother */
    static MODULE_ID= 'dice-stats-ts';

	/* Database accessers */
    static MODULE_FLAGS = {
        ROLLDATAFLAG:'player_roll_data'
    };

	/* Path tp UI handlebars template files */
    static MODULE_TEMPLATES= {
        GLOBALDATAFORM:     'modules/dice-stats/templates/dice-stats-global.hbs',
        COMPAREFORM:        'modules/dice-stats/templates/dice-stats-compare.hbs',
        EXPORTFORM:        'modules/dice-stats/templates/dice-stats-export.hbs',
        TABEDPLAYERBASE:    'modules/dice-stats/templates/partial/tab_player_base.hbs',
        TABEDPLAYER_ALL:   'modules/dice-stats/templates/partial/tab_player_stats_all_dice.hbs',
        TABEDPLAYER_D20:   'modules/dice-stats/templates/partial/tab_player_stats_d20.hbs',
        TEBEDPLAYER_2DX:   'modules/dice-stats/templates/partial/tab_player_stats_2dx.hbs',
        TABEDPLAYER_ERROR: 'modules/dice-stats/templates/partial/tab_player_unsupported_info.hbs'
    };

	/* Module settings */
    static MODULE_SETTINGS= {
        PLAYERS_SEE_PLAYERS:        'players_see_players',          // If players cant see self they cant see others either     [Def: True]      (Global)
        PLAYERS_SEE_GM:             'players_see_gm',               // If Players can see GM dice roll stats                    [Def: False]     (Global)
        PLAYERS_SEE_GLOBAL:         'players_see_global',           // If Players Can see Global Dice Stats                     [Def: True]      (Global)
        PLAYERS_SEE_GM_IN_GLOBAL:   'players_see_gm_in_global',     // If GM roll stats get added into global stats             [Def: False]     (Global) 
        SHOW_BLIND_ROLLS_IMMEDIATE: 'enable_blind_rolls_immediate', // Allow blind rolls to be saved immediately                [Def: false]  (Global)
        ENABLE_AUTO_DB:             'enable_auto_db',               // Rolling data gets saved to automatically and user load from DB on joining  [Def: true] (Global)
        OTHER_ACCESS_BUTTON_ICONS:  'player_access_icons',          // Change player icons to use custom                        [Default {STRING COMMA SEP}: fas fa-dice-d20]  (Global)

        GLOBAL_PAUSE_SAVING_DATA:	'global_pause_saving_data',		// Disable saving any roll data until enabled				[Default: False] (Global)

        // Settings to enable or disable tab buttons on the UI [Def: Enabled] (Local)
        LOCAL_ENABLE_D20_DETAILS_TAB:     'local_enable_d20_details_tab',
        LOCAL_ENABLE_2DX_DETAILS_TAB:     'local_enable_2dx_details_tab',
        LOCAL_ENABLE_2D6_DETAILS_TAB:     'local_enable_2d6_details_tab',
        LOCAL_ENABLE_2D12_DETAILS_TAB:    'local_enable_2d12_details_tab',
        LOCAL_ENABLE_2D20_DETAILS_TAB:    'local_enable_2d20_details_tab',

        LOCAL_ENABLE_HIT_MISS_INFO_TAB:   'local_enable_hit_miss_info_tab',
		
		LOCAL_ENABLE_MAIN_TAB:				'local_enable_main_tab',	// Main tab that holds default dice info	
		LOCAL_ENABLE_SYSTEM_CHARTS_TAB:		'local_enable_system_charts_tab',
		LOCAL_ENABLE_SYSTEM_DETAILS_TAB:	'local_enable_system_details_tab',

		LOCAL_SET_DEFAULT_TAB:				'local_set_default_tab',	// Select the default tab thats oppened when opening a players form [Def: 0]
    };
}