import React from "react";
import { HealthAuthScreen } from "../components/HealthAuthScreen";
import { useRouter } from "expo-router";
import { useHealth } from "../context/HealthContext";

export default function Auth() {
	const router = useRouter();
	const { authenticate } = useHealth();

	const handleAuthSuccess = () => {
		router.replace("/landing");
	};
	return (
		<HealthAuthScreen
			authenticate={authenticate}
			onAuthSuccess={handleAuthSuccess}
		/>
	);
}
