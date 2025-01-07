import {Redirect} from "expo-router";

export default function MainScreen(){
    return <Redirect href={'/pin/setpinscreen'}/>
    // return <Redirect href={'/(user)/menu/exchanger'}/>
    // return <Redirect href={'/(user)/menu'}/>
    // return <Redirect href={'/(user)/menu/share-prizm'}/>
    // return <Redirect href={'/pin/(create-user)/setnickname/LoginScreen'}/>
    // return <Redirect href={'/menu/wallet/secret-phrase'}/>
}
