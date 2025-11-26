import React from "react";
import { LoginScreen } from "../components/LoginScreen";
import { useRouter } from "expo-router";

export default function Login() {
	const router = useRouter();

	const handleLoginSuccess = () => {
		router.replace("/auth");
	};

	return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
}
