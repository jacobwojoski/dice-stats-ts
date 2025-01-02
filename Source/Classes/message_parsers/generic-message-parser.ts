
import { DIE_TYPE, ROLL_TYPE } from "../globals";
import { SystemInfo } from "../local_storage/system_info/generic_system_info";

export interface MessageParser {
    parse_msg(msg:any):any;
        _get_generic_roll_info(msg:any):any;
        _get_system_info(msg:any):any;
            _get_system_roll_type(msg:any):any;
            _get_degree_success_info(msg:any):any;
            _get_target_info(msg:any):any;
            _get_modifers_info(msg:any):any;
}


export class GenericDieInfo {
    die_type:DIE_TYPE = DIE_TYPE.UNKNOWN;
    value:number = 0;

}
export class GenericRollInfo {
    dice: GenericDieInfo[] = Array();
    is_blind: boolean = false;
    roll_type: ROLL_TYPE = ROLL_TYPE.UNKNOWN;
}
export class GenericMsgInfo {
    rolls:GenericRollInfo[] = Array();
}

export class GenericMessageParser implements MessageParser {
    parse_msg(msg:any):any {
        if (!msg?.isRoll){
            return
        }

        let genericRollInfo = this._get_generic_roll_info(msg);
        let systemRollInfo = this._get_system_info(msg);
        return {genericRollInfo, systemRollInfo}
    }

    _get_generic_roll_info(msg:any): GenericMsgInfo | undefined{
        let genericMsgInfo = new GenericMsgInfo;

        //For multiple rolls in chat
        for (let tempRoll = 0; tempRoll < msg?.rolls?.length; tempRoll++) {
            let savedRollObj = new GenericRollInfo;
            let msgRollObj = msg.rolls[tempRoll];

            savedRollObj.is_blind = msg?.blind ?? false;

            //For multiple dice types per roll
            for(let tempDieType=0; tempDieType<msgRollObj?.dice?.length; tempDieType++){

                // get rolls for specific DIE_TYPE
                let msgDieTypeObj = msgRollObj.dice[tempDieType];

                // Get current DIE_TYPE
                let sides:number = msgRollObj?.faces ?? DIE_TYPE.UNKNOWN;
                let die_type:DIE_TYPE = <DIE_TYPE>sides;

                //For results of every die roll of that dice type
                for(let rollResult=0; rollResult < msgDieTypeObj?.results?.length; rollResult++){

                    // Create Die object for the die that was rolled 
                    let savedDieObj = new GenericDieInfo
                    savedDieObj.die_type = die_type;

                    let msgDieResultSel = msgDieTypeObj.results[rollResult];

                    if(die_type > 0)
                    {
                        // Get roll value (int)
                        savedDieObj.value = msgDieResultSel.result;

                        // Validate roll result
                        if ( savedDieObj.value > sides ){
                            savedDieObj.value = sides;
                        // varify > 0 dnot 1 due to d10's
                        }else if ( savedDieObj.value < 0 ){
                            savedDieObj.value = 0;
                        }

                        // Add die info to roll storage obj
                        savedRollObj.dice.push(savedDieObj);
                    }
                } // end results

                // Add Die to Dice

            } // end dice in rolls
            
            // Add Roll Obj to Msg Obj
            genericMsgInfo.rolls.push(savedRollObj);

        } // end rolls
        return genericMsgInfo;
    }

    _get_system_info(msg:any): SystemInfo|undefined {
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

export class MessageParserFactory {
    public static createMessageParser(system_id:string): MessageParser|undefined {
        if(!system_id){return undefined}
        switch(system_id){
            case "pf1":
            case "pf2e":
            case "dnd5e":
            case "dragonbane":
            case "CoC7":
            case "daggerheart":
            case "mcdmrpg":
            case "dc20":
            default:
                return new GenericMessageParser()
        }
        return undefined;
    }
}