import {Redirect} from "expo-router";

export default function TabIndex(){
    return <Redirect href={'/pin/setpinscreen'}/>
    // return <Redirect href={'/pin/createwallet'}/>
    // return <Redirect href={'/(user)/menu/wallet/user'}/>
    // return <Redirect href={'/(user)/menu/category/1'}/>
}
