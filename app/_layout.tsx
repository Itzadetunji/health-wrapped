import * as QuickActions from "expo-quick-actions";
import { useQuickActionRouting } from "expo-quick-actions/router";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { HealthProvider } from "../context/HealthContext";
import {
	PlusJakartaSans_400Regular,
	PlusJakartaSans_500Medium,
	PlusJakartaSans_600SemiBold,
	PlusJakartaSans_700Bold,
	PlusJakartaSans_800ExtraBold,
	useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import Purchases from "react-native-purchases";
import { Platform } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Layout() {
	useQuickActionRouting();

	const [fontsLoaded] = useFonts({
		PlusJakartaSans_400Regular,
		PlusJakartaSans_500Medium,
		PlusJakartaSans_600SemiBold,
		PlusJakartaSans_700Bold,
		PlusJakartaSans_800ExtraBold,
	});

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
		if (fontsLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	useEffect(() => {
		Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

		if (Platform.OS === "ios") {
			Purchases.configure({ apiKey: "appl_YCLwMgPFWYNCUKxYgEOiOQxWAHM" });
		}

		getCustomerInfo();
	}, []);

	const getCustomerInfo = async () => {
		const customerInfo = await Purchases.getCustomerInfo();
		console.log("Customer Info:", customerInfo);
	};

	if (!fontsLoaded) {
		return null;
	}

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
