import React from "react";
import { LandingScreen } from "../components/LandingScreen";
import { useRouter } from "expo-router";

export default function Landing() {
	const router = useRouter();

	const handleViewWrapped = () => {
		router.push("/wrapped");
	};

	const handleOpenSettings = () => {
		router.push("/settings");
	};

	return (
		<LandingScreen
			onViewWrapped={handleViewWrapped}
			onOpenSettings={handleOpenSettings}
		/>
	);
}
