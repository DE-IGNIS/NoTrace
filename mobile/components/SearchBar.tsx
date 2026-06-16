// import { TextInput, View, Text } from "react-native";
// import { Ionicons } from '@expo/vector-icons';

// export default function SearchBar() {
//     return (
//         <View>
//             <Text>Search bar below</Text>
//             <View>
//                 <Ionicons name="search-outline" size={24} color="black" />
//                 <TextInput
//                     placeholder="Search or Enter URL"
//                 />
//             </View>
//         </View>
//     )
// }

import { TextInput, View, Text, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar() {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Search bar below</Text>

            <View style={styles.searchBox}>
                <Ionicons 
                    name="search-outline" 
                    size={20} 
                    color="#666" 
                    style={styles.icon}
                />

                <TextInput
                    placeholder="Search or Enter URL"
                    placeholderTextColor="#999"
                    style={styles.input}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",   // vertical center
        alignItems: "center",       // horizontal center
        paddingHorizontal: 20,
    },

    label: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: "500",
    },

    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        maxWidth: 400,

        backgroundColor: "#ee4242",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },

    icon: {
        marginRight: 8,
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: "#000",
    },
});