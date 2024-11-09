import { Stack } from "expo-router";
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="OsCommandScreen" options={{ headerShown: false }} />
      <Stack.Screen name="Register" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
