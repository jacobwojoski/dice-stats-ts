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
        CRIT_SUCCESS: 4
    }

    static NUM_DIE_OUTCOMES:number = 20;   /* 1-20 on the die */
    static NUM_DEGREE_SUCCESS:number = 5;  /* UNKNOWN, CF, F, S, CS */
    player_id:string = '';


    /**
        Create arrays for every d20 roll type that pf2e holds 
        arrays are length [20][4] = [DIE_SIZE][DEGREE_SUCCESS]
        
        Initially we will not handle blid rolls here to save on size of data needed (Prolly unnessicary but we trying it this way for now)
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

    means: number[]     = new Array(10);
    medians: number[]   = new Array(10);
    modes: number[]     = new Array(10);

    advantage_helped    = 0;
    advantage_hurt      = 0;
    advantage_unchagned = 0;

    disadvantage_helped    = 0;
    disadvantage_hurt      = 0;
    disadvantage_unchagned = 0;

    total_damage = 0;
    max_damage = 0;
    min_damage = 0;

    atk_deg_success = Array(Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
    your_save_deg_success = Array(Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
    saves_against_you_deg_success = Array(Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
    skill_deg_success = Array(Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);


    /* TODO: Can we store damage stats in a cool way? */
    /* Create map for cantrips & every (non GM) weapon used in session but don't save this info to DB? */
    specific_roll_stats = new Array();

    /* Add system data together, Used to add a newly created obj into the local obj */
    add(obj:Pf2eSystemPlayerInfo){
        if (!this.is_array_init){
            this.init_all_arrays();
        }

        if(obj.d20_attack_ary){
            DiceStatsUtils.add_2d_arrays(obj.d20_attack_ary, this.d20_attack_ary);
        }
    }

    init_all_arrays(){
        this.is_array_init = true;

        this.d20_attack_ary =       DiceStatsUtils.init_upto_d3_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS)
        this.d20_dmg_ary =          DiceStatsUtils.init_upto_d3_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
        this.d20_heal_ary =         DiceStatsUtils.init_upto_d3_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
        this.d20_your_saves_ary =           DiceStatsUtils.init_upto_d3_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
        this.d20_saves_against_you_ary =    DiceStatsUtils.init_upto_d3_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
        this.d20_skill_ary =        DiceStatsUtils.init_upto_d3_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
        this.d20_ability_ary =      DiceStatsUtils.init_upto_d3_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
        this.d20_perception_ary =   DiceStatsUtils.init_upto_d3_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
        this.d20_initiative_ary =   DiceStatsUtils.init_upto_d3_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES,Pf2eSystemPlayerInfo.NUM_DEGREE_SUCCESS);
        this.d20_unknown_ary =       DiceStatsUtils.init_upto_d3_arrays(Pf2eSystemPlayerInfo.NUM_DIE_OUTCOMES);
    }
}

export class Pf2eSystemInfo extends SystemInfo {
    roll_type = ROLL_TYPE.NORMAL_ROLL;
    player_info:Pf2eSystemPlayerInfo[] = Array();
}