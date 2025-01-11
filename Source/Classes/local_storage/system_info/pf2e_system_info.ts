import { DIE_TYPE, ROLL_TYPE } from "../../globals";
import { SystemInfo } from "./generic_system_info";
import { DiceStatsUtils } from "../../utils/utils";

export class Pf2eWepSpellStats {
    name = '';
    die_type = DIE_TYPE.UNKNOWN;
    num_dice = 0;
    dice_stats = new Array(); /* length = (DIE_TYPE * num_dice) */
}

export class Pf2eSystemPlayerInfo {
    static DEGREE_SUCCESS = {
        UNKNOWN: 0,
        CRIT_FAIL: 1,
        FAIL: 2,
        SUCCESS: 3,
        CRIT_SUCCESS: 4,
        TOTALS: 5           /* Hold total of every degree success added together */
    }

    static NUM_DIE_OUTCOMES:number = 20;   /* 1-20 on the die */
    static NUM_DEGREE_SUCCESS:number = 6;  /* UNKNOWN, CF, F, S, CS, TOTALS */
    static NUM_ARRAY_TYPES:number = 10; /* atk ary, dmg ary, heal ary, etc*/
    player_id:string = '';

    /**
        Create arrays for every d20 roll type that pf2e holds 
        arrays are length [20][4] = [DIE_SIZE][DEGREE_SUCCESS]
        
        Initially we will not handle blid rolls here to save on size of data needed 
        (Prolly unnessicary but we trying it this way for now)
    */
    is_array_init = false;

    d20_attack_ary:     number[][] | undefined = undefined;
    d20_dmg_ary:        number[][] | undefined = undefined;
    d20_heal_ary:       number[][] | undefined = undefined;
    d20_your_saves_ary:         number[][] | undefined = undefined;
    d20_saves_against_you_ary:  number[][] | undefined = undefined;
    d20_skill_ary:      number[][] | undefined = undefined;
    d20_ability_ary:    number[][] | undefined = undefined;
    d20_perception_ary: number[][] | undefined = undefined;
    d20_initiative_ary: number[][] | undefined = undefined;
    d20_unknown_ary:    number[] | undefined = undefined;

    _means: number[]     = new Array(Pf2eSystemPlayerInfo.NUM_ARRAY_TYPES);
    _medians: number[]   = new Array(Pf2eSystemPlayerInfo.NUM_ARRAY_TYPES);
    _modes: number[]     = new Array(Pf2eSystemPlayerInfo.NUM_ARRAY_TYPES);

    /* [d20kh1][deg_success] */
    advantage_rolls: number[][] = new Array();
    /* [d20kl1][deg_success] */
    disadvantage_rolls: number[][] = new Array();

    advantage_helped    = 0;
    advantage_hurt      = 0;
    advantage_unchagned = 0;

    disadvantage_helped    = 0;
    disadvantage_hurt      = 0;
    disadvantage_unchagned = 0;

    total_damage = 0;   /* Total damage rolled */
    max_damage = 0;     /* Max possible dmg that could have been done */
    min_damage = 0;     /* Min Possible dmg that could have been done */

    atk_deg_success =       Array(Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
    your_save_deg_success = Array(Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
    saves_against_you_deg_success = Array(Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
    skill_deg_success =     Array(Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);


    /* TODO: Can we store damage stats in a cool way? */
    /* Create map for cantrips & every (non GM) weapon used in session but don't save this info to DB? */
    // specific_roll_stats = new Array();

    /* Add system data together, Used to add a newly created obj into the local obj */
    add(obj:Pf2eSystemPlayerInfo){
        if (!this.is_array_init){
            this.init_all_arrays();
        }

        if (obj.d20_attack_ary){
            DiceStatsUtils.add_2d_arrays(obj.d20_attack_ary, this.d20_attack_ary);
        }
        if (obj.d20_dmg_ary){
            DiceStatsUtils.add_2d_arrays(obj.d20_dmg_ary, this.d20_attack_ary);
        }
        if (obj.d20_heal_ary){
            DiceStatsUtils.add_2d_arrays(obj.d20_heal_ary, this.d20_attack_ary);
        }
        if (obj.d20_your_saves_ary){
            DiceStatsUtils.add_2d_arrays(obj.d20_your_saves_ary, this.d20_attack_ary);
        }
        if (obj.d20_saves_against_you_ary){
            DiceStatsUtils.add_2d_arrays(obj.d20_saves_against_you_ary, this.d20_attack_ary);
        }
        if (obj.d20_skill_ary){
            DiceStatsUtils.add_2d_arrays(obj.d20_skill_ary, this.d20_attack_ary);
        }
        if (obj.d20_ability_ary){
            DiceStatsUtils.add_2d_arrays(obj.d20_ability_ary, this.d20_attack_ary);
        }
        if (obj.d20_perception_ary){
            DiceStatsUtils.add_2d_arrays(obj.d20_perception_ary, this.d20_attack_ary);
        }
        if (obj.d20_initiative_ary){
            DiceStatsUtils.add_2d_arrays(obj.d20_initiative_ary, this.d20_attack_ary);
        }
        if (obj.d20_unknown_ary){
            DiceStatsUtils.add_arrays(obj.d20_unknown_ary, this.d20_unknown_ary);
        }

        this.advantage_helped    += obj.advantage_helped;
        this.advantage_hurt      += obj.advantage_hurt;
        this.advantage_unchagned += obj.advantage_unchagned;

        this.disadvantage_helped    += obj.disadvantage_helped;
        this.disadvantage_hurt      += obj.disadvantage_hurt;
        this.disadvantage_unchagned += obj.disadvantage_unchagned;

        this.total_damage   += obj.total_damage;   /* Total damage rolled */
        this.max_damage     += obj.max_damage;     /* Max possible dmg that could have been done */
        this.min_damage     += obj.min_damage;     /* Min Possible dmg that could have been done */

        DiceStatsUtils.add_arrays(obj.atk_deg_success, this.atk_deg_success);
        DiceStatsUtils.add_arrays(obj.your_save_deg_success, this.your_save_deg_success);
        DiceStatsUtils.add_arrays(obj.saves_against_you_deg_success, this.saves_against_you_deg_success);
        DiceStatsUtils.add_arrays(obj.skill_deg_success, this.skill_deg_success);

        /* TODO: Can we store damage stats in a cool way? */
        /* Create map for cantrips & every (non GM) weapon used in session but don't save this info to DB? */
        // specific_roll_stats = new Array();

    }

    init_all_arrays(){
        this.is_array_init = true;

        this.d20_attack_ary =       DiceStatsUtils.init_upto_3d_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS)
        this.d20_dmg_ary =          DiceStatsUtils.init_upto_3d_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
        this.d20_heal_ary =         DiceStatsUtils.init_upto_3d_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
        this.d20_your_saves_ary =           DiceStatsUtils.init_upto_3d_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
        this.d20_saves_against_you_ary =    DiceStatsUtils.init_upto_3d_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
        this.d20_skill_ary =        DiceStatsUtils.init_upto_3d_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
        this.d20_ability_ary =      DiceStatsUtils.init_upto_3d_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
        this.d20_perception_ary =   DiceStatsUtils.init_upto_3d_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
        this.d20_initiative_ary =   DiceStatsUtils.init_upto_3d_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
        this.d20_unknown_ary =      DiceStatsUtils.init_upto_3d_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES);
    }
}

export class Pf2eSystemInfo extends SystemInfo {
    roll_type = ROLL_TYPE.NORMAL_ROLL;
    player_info:Pf2eSystemPlayerInfo[] = Array();
}