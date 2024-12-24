import { GenericMessageParser, MessageParser } from "./generic-message-parser";

export class Pf2eMessageParser extends GenericMessageParser {
    
    /**
     * Override GenericMessageParser
     * @param msg 
     * @returns 
     */
    _get_system_info(msg:any): undefined {
        return undefined;
    }

    _get_system_roll_type(msg:any):any {

    }

    _get_degree_success_info(msg:any):any {

    }

    _get_target_info(msg:any):any {

    }

    /**
     * Get info about 
     * - Advantage/Disadvantage 
     * - Modifiers
     * @param msg 
     * @returns 
     */
    _get_modifers_info(msg:any):any {
        return;
    }
}