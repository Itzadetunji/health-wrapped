import React from "react";
import { SplashScreen } from "../components/SplashScreen";
import { useRouter } from "expo-router";

export default function Index() {
	const router = useRouter();

	const handleFinish = () => {
		router.replace("/login");
	};

	return <SplashScreen onFinish={handleFinish} />;
}
