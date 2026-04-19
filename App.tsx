import { Providers } from "./src/app/providers";
import { FeedScreen } from "./src/features/feed/FeedScreen";
import { CommentsScreen } from "./src/features/feed/CommentsScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Providers>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Feed" component={FeedScreen} />
            <Stack.Screen 
              name="Comments" 
              component={CommentsScreen} 
              options={{ 
                headerShown: true, 
                title: 'Комментарии',
                headerTitleStyle: { fontWeight: '700', fontSize: 17 }
              }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Providers>
  );
}