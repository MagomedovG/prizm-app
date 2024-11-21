import {Redirect} from "expo-router";

export default function MainScreen(){
    return <Redirect href={'/pin/setpinscreen'}/>
    // return <Redirect href={'/(user)/menu/'}/>
    // return <Redirect href={'/(user)/menu/category-item/2'}/>
    // return <Redirect href={'/pin/setnickname/SetWallet'}/>
    // return <Redirect href={'/(auth)/sign-in'}/>
}
