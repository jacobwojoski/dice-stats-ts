export class DiceStatsUtils {
    /**
     * Mode = Most common
     * Find index that has the largest value 
     * result = index+1
     * @param {int[]} rolls_ary 
     * @returns 
     */
    static get_mode(rolls_ary:number[]): number {
        if(!rolls_ary || rolls_ary.length == 0 )
        {return 0}
        
        var indexOfMax = 0;
        var maxValue = 0;

        for(let i=0; i<rolls_ary.length; i++){
            if(rolls_ary[i] > maxValue){
                indexOfMax = i;
                maxValue = rolls_ary[i];
            }
        }

        return indexOfMax+1;
    }

    /**
     * Average
     * Becasue array holds number of each roll instead of each roll value math is more anoying
     * @param {int[]} rolls_ary 
     * @returns {float}
     */
    static get_mean(rolls_ary:number[]): number {
        if(!rolls_ary || rolls_ary.length == 0 )
        {return 0}

        var numberOfRolls=0;
        var sum = 0;

        //For every elm in array
        //Sum = Arrayindex+1(die Roll) * array value(number of times value was rolled)
        for(let i=0; i<rolls_ary.length; i++){
            numberOfRolls += rolls_ary[i];
            sum = sum+((i+1)*rolls_ary[i]);
        }

        if(numberOfRolls>0)
        {
            let float = sum/numberOfRolls;
            return float;
        }
        return 0;
    }

    /**
     * Middle number
     * Find Total Number of rolls/2 ()
     * Go through array subtracting each roll untill we find our middle number
     * @param {int[]} rolls_ary 
     * @returns {int}
     */
    static get_median(rolls_ary:number[]): number{
        if(!rolls_ary || rolls_ary.length == 0 )
        {return 0}

        let totalRolls = 0;
        for(let i=0; i<rolls_ary.length; i++){
            totalRolls += rolls_ary[i];
        }

        if(totalRolls > 1){
            //Get Middle roll number
            let middleIndex = 0;
            if(totalRolls%2 === 0){
                //Even Number of rolls
                middleIndex = Math.floor(totalRolls/2);
            }else{
                //Odd Number of rolls
                middleIndex = Math.floor(totalRolls/2)+1;
            }

            for(let i=0; i<rolls_ary.length; i++){
                var indxlValue = rolls_ary[i]; //Number of that roll (i+1) is die number
                while(indxlValue!=0 && middleIndex!=0){
                    middleIndex--;
                    indxlValue--;
                }

                if(middleIndex===0){
                    return i+1; //index+1 = die number
                }
            }

        }else if(totalRolls === 1){
            for(let i=0; i<rolls_ary.length; i++){
                if(rolls_ary[i] === 1){
                    return i+1;
                }
            }
        }
        return 0;
    }

    /* Create multi dim arrays */
    static init_upto_d3_arrays(x:number, y:number = 0, z:number = 0){
        let ret_ary = new Array(x);

        // Create 2d arrays
        if (y>0){
            for(let a=0; a<x; a++){
                ret_ary[a] = new Array(y);
    
                // Create 3d arrays
                if(z>0){
                    for(let b=0; b<y; b++){
                        ret_ary[a][b] = new Array(z);
                    }
                }
            }
        }
        return ret_ary;
    }

    /* Add arrays */
    static add_arrays(vals_to_add:number[], orig:number[]|undefined, clear_add=false){
        if (orig == undefined){return}
        let xLen = orig.length;
        for (let x=0; x<xLen; x++){
            orig[x] = orig[x]+vals_to_add[x];
            if(clear_add){
                vals_to_add[x] = 0;
            }
        }
    }

    /* Add 2 arrays */
    static add_2d_arrays(vals_to_add:number[][], orig:number[][]|undefined, clear_add=false){
        if (orig == undefined){return}
        let xLen = orig.length;
        let yLen = orig[0].length;
        for (let x=0; x<xLen; x++){
            for(let y=0; y<yLen; y++){
                orig[x][y] = orig[x][y]+vals_to_add[x][y];
                if(clear_add){
                    vals_to_add[x][y] = 0;
                }
            }
        }
    }

    /* Add 3d arrays */
    static add_3d_arrays(vals_to_add:number[][][], orig:number[][][]|undefined, clear_add=false){
        if (orig == undefined){return}
        let xLen = orig.length;
        let yLen = orig[0].length;
        let zLen = orig[0][0].length;
        for (let x=0; x<xLen; x++){
            for(let y=0; y<yLen; y++){
                for(let z=0; z<zLen; z++){
                    orig[x][y][z] = orig[x][y][z]+vals_to_add[x][y][z];
                    if(clear_add){
                        vals_to_add[x][y][z] = 0;
                    }
                }
            }
        }
    }
}