import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null); // Specify initial state as null for loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setIsSignedIn(!!token); // Set to true if token exists
      } catch (error) {
        console.error("Failed to retrieve token:", error);
        setIsSignedIn(false); // Assume not signed in if there's an error
      }
    };

    checkAuth();
  }, []);

  if (isSignedIn === null) {
    return null; // Render a loading screen while checking the auth state
  }

  return isSignedIn ? (
    <Redirect href={"/(auth)/OsCommandScreen" as const} />
  ) : (
    <Redirect href={"/(auth)/welcome" as const} />
  );
};

export default Home;
