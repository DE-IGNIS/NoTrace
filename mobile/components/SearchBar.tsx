import { TextInput, View, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar() {
    return (
        <View>
            <Text>Search bar below</Text>
            <View>
                <Ionicons name="search-outline" size={24} color="black" />
                <TextInput
                    placeholder="Search or URL"
                />
            </View>
        </View>
    )
}