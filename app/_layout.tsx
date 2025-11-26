import { Stack } from "expo-router";
import { HealthProvider } from "../context/HealthContext";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Layout() {
	useEffect(() => {
		// Hide the splash screen after the app is mounted.
		// In a real app, you might wait for fonts or other assets here.
		SplashScreen.hideAsync();
	}, []);

	return (
		<HealthProvider>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen
					name="index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="auth"
					options={{ headerShown: false, animation: "fade" }}
				/>
				<Stack.Screen
					name="landing"
					options={{ headerShown: false, animation: "fade" }}
				/>
				<Stack.Screen
					name="settings"
					options={{ headerShown: false, animation: "slide_from_right" }}
				/>
				<Stack.Screen
					name="wrapped"
					options={{ headerShown: false, animation: "fade" }}
				/>
			</Stack>
		</HealthProvider>
	);
}
