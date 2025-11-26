import React from "react";
import { SplashScreen } from "../components/SplashScreen";
import { useRouter } from "expo-router";
import { getData } from "../lib/utils";

export default function Index() {
	const router = useRouter();

	const handleFinish = async () => {
		const storedAuthenticatedFirstTime = await getData(
			"AUTHENTICATED_FIRST_TIME"
		);
		const hasAuthenticatedBefore = storedAuthenticatedFirstTime
			? JSON.parse(storedAuthenticatedFirstTime)
			: { value: false };

		if (!hasAuthenticatedBefore.value) {
			router.replace("/auth");
		} else router.replace("/landing");
	};

	return <SplashScreen onFinish={handleFinish} />;
}
