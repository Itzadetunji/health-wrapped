import { useRouter } from "expo-router";
import { LandingScreen } from "../components/LandingScreen";

export default function Landing() {
	const router = useRouter();

	const handleViewWrapped = () => {
		router.push("/wrapped");
	};

	const handleOpenSettings = () => {
		// router.push("/settings");
	};

	return (
		<LandingScreen
			onViewWrapped={handleViewWrapped}
			onOpenSettings={handleOpenSettings}
		/>
	);
}
