import React from "react";
import { ProfileSettingsScreen } from "../components/ProfileSettingsScreen";
import { useRouter } from "expo-router";

export default function Settings() {
	const router = useRouter();

	const handleBack = () => {
		router.back();
	};

	return <ProfileSettingsScreen onBack={handleBack} />;
}
