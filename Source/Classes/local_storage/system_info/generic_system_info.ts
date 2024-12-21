import { ROLL_TYPE } from "../../globals";

export abstract class SystemInfo {
    roll_type: ROLL_TYPE = ROLL_TYPE.NORMAL_ROLL;
}

export class GenericSystemInfo extends SystemInfo {
    
}


export class SystemInfoFactory {

    public static getSystemInfoType(system_id:string): SystemInfo {
        // TODO: Pick system object bassed on the type
        return new GenericSystemInfo();
    }

}
