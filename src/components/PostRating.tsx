// StarRating.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

type StarRatingProps = {
  id: string | number | string[];
  markSize: number;
  color?: string;
  inactiveColor?: string;
  refreshBusiness: () => void; 
  initialStars: number;
};
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;


const PostRating: React.FC<StarRatingProps> = ({ id, markSize, color = 'white', inactiveColor = 'white',refreshBusiness, initialStars }) => {
    const [activeStars, setActiveStars] = useState<number>(0);
    
    const postRating = async (rating: number) => {
        setActiveStars(rating);
        const userId = await AsyncStorage.getItem('user_id');
        const parsedUserId = userId ? JSON.parse(userId) : null;
        try {
            const response = await fetch(`${apiUrl}/api/v1/ratings/update-or-create/`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                created_by: parsedUserId,
                business: id,
                rating_value: rating,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                refreshBusiness()
            } 
        } catch (e) {
            // console.log(e);
        }
    }
  return (
    <View style={styles.starContainer}>
        {[...Array(5)].map((_, index) => (
            <Entypo
                key={`star-${index}`}
                name={index < (initialStars ? initialStars : activeStars) ? 'star' : 'star-outlined'}
                size={markSize}
                color={index < (initialStars ? initialStars : activeStars) ? color : inactiveColor}
                onPress={() => postRating(index + 1)}
            />
        ))}
    </View>
  );
};

export default PostRating;
const styles = StyleSheet.create({
    starContainer: {
        flexDirection: 'row',
        marginTop: 5
    }
})
