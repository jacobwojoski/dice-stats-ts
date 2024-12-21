

import { DIE_TYPE } from "../globals";

export class DieInfo {

    type: DIE_TYPE          = DIE_TYPE.UNKNOWN;  // Type of die <DIE_TYPE> varable

    max: number             = 0;  // MAX Value On Die , ex 6, 10, 12, 20
    total_rolls: number     = 0;

    rolls: number[]         = []; // Array size of max 
    blind_rolls: number[]   = []; // Array of size max

    streak_size: number     = -1;
    streak_init: number     = -1;
    steak_is_blind: boolean = false;
    steak_dir               = -1;

    longest_streak_init: number = 0;
    longest_streak_size: number = 0;
    longest_streak_is_blind: boolean = false

    mean: number        = 0.0;  // Average
    median: number      = 0;    // Middle number
    mode: number        = 0;    // Most common
    
}

export namespace DieInfo {
    export enum DIRECTION {
        UNKNOWN = -1,
        DEC = 0,
        INC = 1,
    }
}