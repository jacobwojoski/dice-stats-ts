
import { DiceStatsUtils } from "../utils/utils";
import { DIE_TYPE } from "../globals";

export class DieInfo {

    type: DIE_TYPE          = DIE_TYPE.UNKNOWN;  // Type of die <DIE_TYPE> varable

    max: number             = 0;  // MAX Value On Die , ex 6, 10, 12, 20
    total_rolls: number     = 0;

    rolls: number[]         = []; // Array size of max 
    blind_rolls: number[]   = []; // Array of size max

    streak_size: number     = -1;
    streak_init: number     = -1;
    streak_is_blind: boolean = false;
    streak_dir              = DieInfo.DIRECTION.UNKNOWN;

    longest_streak_init: number = 0;
    longest_streak_size: number = 0;
    longest_streak_is_blind: boolean = false
    longest_streak_dir          = DieInfo.DIRECTION.UNKNOWN;

    mean: number        = 0.0;  // Average
    median: number      = 0;    // Middle number
    mode: number        = 0;    // Most common

    // Take in die type as enum. Die_type enum value = max value that can be rolled on the die
    constructor(die_type:DIE_TYPE){
        this.type = die_type;
        this.max = die_type;

        this.rolls = new Array(die_type);
        this.blind_rolls = new Array(die_type);  

        this.rolls.fill(0);
        this.blind_rolls.fill(0);
    }

    /**
     * Add a rolled result from the die
     * @param {int} roll_value - value we rolled on the die 
     * @param is_blind - was the roll a blind roll
     * @returns {void} - Update die stats for whatever value we just rolled 
     */
    public add_roll(roll_value:number, is_blind:boolean = false){
        if (roll_value < 0 && roll_value > this.max){
            return;}

        if(is_blind){
            this.blind_rolls[roll_value-1] = this.blind_rolls[roll_value-1]++;
        }else{
            this.rolls[roll_value-1] = this.rolls[roll_value-1]++
        }

        this.total_rolls++;
        this._update_streak(roll_value, is_blind);
    }

    // Push all blind rolls into the rolls array. Recalculate stats
    public push_blind_rolls(){
        for(let i=0; i<this.blind_rolls.length; i++){
            this.rolls[i] = this.rolls[i]+this.blind_rolls[i];
            this.blind_rolls[i]=0;
        }
    }

    /**
     * method to get total number of blind rolls
     * @returns {int} - total number of blind rolls for this die
     */
    public get_num_blind_rolls(): number {
        let tempRollCount = 0;
        for(let i=0; i<this.blind_rolls.length; i++){
            tempRollCount += this.blind_rolls[i];
        }

        return tempRollCount;
    }

    /**
     * method to get total number of non blind rolls
     * @returns {int} - total number of rolls for this die
     */
    public get_num_rolls(): number {
        let tempRollCount = 0;
        for(let i=0; i<this.rolls.length; i++){
            tempRollCount += this.rolls[i];
        }

        return tempRollCount;
    }

    /**
     * Method to get the total number of rolls both blind and not blind
     * @returns {int}
     */
    public get_total_rolls(): number {
        return this.total_rolls;
    }

    // Clear all saved data
    public clear_all(){
        this.total_rolls        = 0;

        this.rolls.fill(0)
        this.blind_rolls.fill(0);
    
        this.streak_size        = -1;
        this.streak_init        = -1;
        this.streak_is_blind     = false;
        this.streak_dir          = DieInfo.DIRECTION.UNKNOWN;
    
        this.longest_streak_init = 0;
        this.longest_streak_size = 0;
        this.longest_streak_is_blind = false
        this.longest_streak_dir = DieInfo.DIRECTION.UNKNOWN;
    
        this.mean        = 0.0;  // Average
        this.median      = 0;    // Middle number
        this.mode        = 0;    // Most common
    }

    /**
     * Check if this roll is part of a streak (Incrementing Rolled Dice : [6,7,8,9] | [19,18,17,16,15])
     * and Update the Streak info accordingly
     * @param {int} roll_value - the new rolled value on the die
     * @param {bool} is_blind - was the new roll result from a blind roll?
     */
    private _update_streak(roll_value:number, is_blind:boolean){
        // Streak is Icrementing
        if (this.streak_init + this.streak_size == roll_value){ 
            this.streak_size++;
            this.streak_is_blind = this.streak_is_blind || is_blind
            this.streak_dir = DieInfo.DIRECTION.INC

        // Streak Decrementing
        }else if(this.streak_init - this.streak_size == roll_value){ 
            this.streak_size++;
            this.streak_is_blind = this.streak_is_blind || is_blind
            this.streak_dir = DieInfo.DIRECTION.DEC
        
        // New Streak 
        }else{
            this.streak_size = 1;
            this.streak_is_blind = is_blind;
            this.streak_init = roll_value
        }

        // Update longest streak if current streak is the longest
        if(this.streak_size > this.longest_streak_size){
            this.longest_streak_size = this.streak_size;
            this.longest_streak_init = this.streak_init;
            this.longest_streak_is_blind = this.streak_is_blind;
            this.longest_streak_dir = this.streak_dir;
        }
    }

    // Recalculate the mean, median, mode, 
    // This only needs to be called when were about to display the dice data.
    // No need to calculate this after every roll
    public update_stats(){
        this.mean = DiceStatsUtils.get_mean(this.rolls);
        this.median = DiceStatsUtils.get_median(this.rolls);
        this.mode = DiceStatsUtils.get_mode(this.rolls);
    }
    
}

export namespace DieInfo {
    export enum DIRECTION {
        UNKNOWN = -1,
        DEC = 0,
        INC = 1,
    }
}