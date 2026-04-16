import { Providers } from "./src/app/providers";
import { FeedScreen } from "./src/features/feed/FeedScreen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <Providers>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <FeedScreen />
        </SafeAreaView>
      </SafeAreaProvider>
    </Providers>
  );
}