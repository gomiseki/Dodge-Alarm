import 'styled-components';
import Edition from './editions/index';

interface sizeObjType{
    height:string,
    width:string
}

interface tierType{
    main:string,
    sub:string
}

declare module 'styled-components'{
    export interface DefaultTheme {
        editions:Edition
        buttonSizes:{
            large:sizeObjType,
            medium:sizeObjType,
            small:sizeObjType,
        }
        selectSizes:{
            large:sizeObjType,
            medium:sizeObjType,
            small:sizeObjType,
        }
        palette:{
            [index:string]:string,
            themeMain:string,
            winGreen:string,
            loseRed:string,
            string:string,
            transparent:string,
            silver:string,
            LCKBlue:string,
            LCKRed:string
        }
        font:{
            light:string,
            main:string,
            bold:string
        }
        tier:{
            [index:string]:tierType,
            unranked:tierType,
            iron:tierType,
            bronze:tierType,
            silver:tierType,
            gold:tierType,
            platinum:tierType,
            diamond:tierType,
            master:tierType,
            grandmaster:tierType,
            challenger:tierType
        }
        essential:{
            [index:string]:string,
            포꼬:string,
            쌩배:string,
            꼴픽:string,
            내로남불:string,
        }
    }
}
