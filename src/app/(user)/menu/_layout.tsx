import BusinessIcon from "@/src/components/Icons/BusinessIcon";
import TaxiIcon from "@/src/components/Icons/TaxiIcon";
import { Tabs,Stack } from "expo-router";
import { usePathname } from "expo-router";
import React from "react";

export default function MenuStack() {
    const pathname = usePathname();
    
    const shouldShowTabs = false
    return shouldShowTabs ? (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false, 
            }}
        >
            <Tabs.Screen name="index" options={{ href: null }} />
            <Tabs.Screen name="wallet/[id]" options={{ href: null }} />
            <Tabs.Screen name="category-item/[id]" options={{ href: null }} />
            <Tabs.Screen name="category-item/feedback/[id]/index" options={{ href: null }} />
            <Tabs.Screen name="category-item/feedback/[id]/add-feedback/index" options={{ href: null }} />
            <Tabs.Screen name="category/[id]" options={{ href: null }} />
            <Tabs.Screen name="wallet/secret-phrase/index" options={{ href: null }} />
            <Tabs.Screen name="share-prizm/index" options={{ href: null }} />
            <Tabs.Screen name="(notabs)" options={{ href: null }} />
            <Tabs.Screen 
                name="taxi/index" 
                options={{
                    title: "",
                    tabBarIcon: () => <TaxiIcon />,
                }}
            />
            <Tabs.Screen 
                name="partners/index" 
                options={{
                    title: "",
                    tabBarIcon: () => <BusinessIcon />
                }}
            />
            
        </Tabs>
    ) :
     <Stack
    screenOptions={{
        headerShown: false,
    }}
/>;
}
