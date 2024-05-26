// npm install @react-navigation/material-top-tabs react-native-tab-view
// npx expo install react-native-pager-view

import {Tabs, withLayoutContext} from "expo-router";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {SafeAreaView} from "react-native-safe-area-context";


const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator)
export default function OrderListNavigator(){
    return (
        <SafeAreaView edges={['top']} style={{flex:1, backgroundColor:'white'}}>
            <TopTabs/>
        </SafeAreaView>

    )
}
