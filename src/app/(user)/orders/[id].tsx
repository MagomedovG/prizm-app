import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import orders from '@/assets/data/orders';
import OrderItemListItem from '@/src/components/OrderItemListItem';
import OrderListItem from '@/src/components/OrderListItem';
import {OrderStatusList} from "@/src/types";
import {Colors} from "@/constants/Colors";

const OrderDetailScreen = () => {
    const { id } = useLocalSearchParams();

    const order = orders.find((o) => o.id.toString() === id);

    if (!order) {
        return <Text>Заказ не найден</Text>;
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: `Заказ #${order.id}` }} />

            <OrderListItem order={order} />

            <FlatList
                data={order.order_items}
                renderItem={({ item }) => <OrderItemListItem item={item} />}
                contentContainerStyle={{ gap: 10 }}

            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        gap: 10,
    },
});

export default OrderDetailScreen;
