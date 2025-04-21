import { Stack } from "expo-router";
import '../global.css';
import { SafeAreaView } from "react-native-safe-area-context";
export default function RootLayout() {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack />
    </SafeAreaView>
  );
}
