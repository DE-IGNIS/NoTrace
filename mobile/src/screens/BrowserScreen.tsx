import { View, Text } from "react-native"
import SearchBar from "../../components/SearchBar"

export default function BrowserScreen() {
    return (
        <View>
            <SearchBar />
            <Text>This is the Browser Screen</Text>
        </View>
    )
}