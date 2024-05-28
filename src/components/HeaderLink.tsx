import React from 'react';
import {Image, Pressable, Text, View} from "react-native";
import {Link} from "expo-router";
import { FontAwesome6 } from '@expo/vector-icons';

type HeaderLinkProps = {
    title: string,
    link: string,
    emptyBackGround?: boolean
}
const HeaderLink = ({title, link, emptyBackGround}:HeaderLinkProps) => {
    return (
        <Link href={link} asChild>
            <Pressable style={{
                // height:100,
                backgroundColor: emptyBackGround ? 'transparent' : '#ffffff',
                // backgroundColor:'transparent',
                display:'flex',
                flexDirection:'row',
                gap:20,
                alignItems:'center',
                width: '100%',
                paddingTop: 50,
                paddingBottom:30,
                position: 'absolute',
                top: 0,
                // zIndex: 1,
                paddingLeft:24
            }}>
                <FontAwesome6 name="arrow-left" size={24} color="#6B6B6B" />
                <Text style={{fontSize:20,}}>{title}</Text>
            </Pressable>
        </Link>
    );
};

export default HeaderLink;
