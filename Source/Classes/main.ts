import { Player } from "./local_storage/player_info";

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

    private _player_map = new Map<string, Player>();
}