import { ROLL_TYPE } from "../../globals";
import { Pf2eSystemInfo } from "./pf2e_system_info";

export abstract class SystemInfo {
    roll_type: ROLL_TYPE = ROLL_TYPE.NORMAL_ROLL;
}

export class GenericSystemInfo extends SystemInfo {
    
}


export class SystemInfoFactory {

    public static getSystemInfoType(system_id:string): SystemInfo {
        switch (system_id){
            case 'pf2e':
                return new Pf2eSystemInfo();
            default:
                return new GenericSystemInfo();
        }
    }

}
