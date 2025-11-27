import * as QuickActions from "expo-quick-actions";
import { useQuickActionRouting } from "expo-quick-actions/router";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { HealthProvider } from "../context/HealthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Layout() {
	useQuickActionRouting();

	useEffect(() => {
		QuickActions.setItems([
			{
				title: "Wait! Don't Delete Me",
				subtitle: " I promise I'll be good!",
				id: "dont_delete",
				icon: "pause",
				params: { href: "/" },
			},
		]);
	}, []);

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
