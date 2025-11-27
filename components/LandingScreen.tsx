import { ChevronRight, Lock, Play } from "lucide-react-native";
import type React from "react";
import {
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useHealth } from "../context/HealthContext";
import { tellUserToEnableHealthPermissions } from "../hooks/useHealthData";
import { ThemedText } from "./ThemedText";

interface LandingScreenProps {
	onViewWrapped: () => void;
	onOpenSettings: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
	onViewWrapped,
	// onOpenSettings,
}) => {
	const currentYear = new Date().getFullYear();
	const { isPro, fetchDataForYear, selectedYear, setSelectedYear } =
		useHealth();
	const insets = useSafeAreaInsets();

	const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

	const handleYearSelect = async (year: number) => {
		if (year !== currentYear && !isPro) {
			Alert.alert("Pro Feature", "Subscribe to Pro to access historical data.");
			return;
		}
		setSelectedYear(year);
		await fetchDataForYear(year);
	};

	const handleViewWrapped = async () => {
		const data = await fetchDataForYear(selectedYear);

		if (selectedYear === currentYear && !data?.steps) {
			return tellUserToEnableHealthPermissions();
		}

		onViewWrapped();
	};

	return (
		<SafeAreaProvider style={[styles.container, { paddingTop: insets.top }]}>
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<Image
						source={require("../assets/icon.png")}
						style={styles.logo}
					/>
					<ThemedText
						variant="bold"
						style={styles.greeting}
					>
						Welcome Back
					</ThemedText>
				</View>
				{/* <TouchableOpacity
					onPress={onOpenSettings}
					style={styles.settingsButton}
				>
					<Settings
						color="white"
						size={24}
					/>
				</TouchableOpacity> */}
			</View>

			<ScrollView contentContainerStyle={styles.scrollContent}>
				<ThemedText
					variant="semibold"
					style={styles.sectionTitle}
				>
					Select Year
				</ThemedText>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.yearSelector}
				>
					{years.map((year) => (
						<TouchableOpacity
							key={year}
							style={[
								styles.yearChip,
								selectedYear === year && styles.yearChipActive,
								year !== currentYear && !isPro && styles.yearChipLocked,
							]}
							onPress={() => handleYearSelect(year)}
						>
							<ThemedText
								variant="semibold"
								style={[
									styles.yearText,
									selectedYear === year && styles.yearTextActive,
									year !== currentYear && !isPro && styles.yearTextLocked,
								]}
							>
								{year}
							</ThemedText>
							{year !== currentYear && !isPro && (
								<Lock
									size={12}
									color="#666"
									style={{ marginLeft: 4 }}
								/>
							)}
						</TouchableOpacity>
					))}
				</ScrollView>

				<ThemedText
					variant="semibold"
					style={styles.sectionTitle}
				>
					Your Wrapped
				</ThemedText>
				<View style={styles.grid}>
					<TouchableOpacity
						style={styles.card}
						onPress={handleViewWrapped}
					>
						<View style={styles.cardContent}>
							<View style={styles.iconContainer}>
								<Play
									fill="white"
									color="white"
									size={24}
								/>
							</View>
							<View>
								<ThemedText
									variant="bold"
									style={styles.cardTitle}
								>
									{selectedYear} Wrapped
								</ThemedText>
								<ThemedText
									variant="default"
									style={styles.cardSubtitle}
								>
									View your health story
								</ThemedText>
							</View>
						</View>
						<ChevronRight
							color="#666"
							size={24}
						/>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#121212",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
	},
	logo: {
		width: 40,
		height: 40,
		borderRadius: 8,
		marginRight: 12,
	},
	greeting: {
		fontSize: 28,
		color: "white",
	},
	settingsButton: {
		padding: 8,
		backgroundColor: "rgba(255,255,255,0.1)",
		borderRadius: 20,
	},
	scrollContent: {
		paddingBottom: 40,
	},
	sectionTitle: {
		fontSize: 18,
		color: "#888",
		marginLeft: 20,
		marginBottom: 15,
		marginTop: 20,
	},
	yearSelector: {
		paddingLeft: 20,
		marginBottom: 20,
	},
	yearChip: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
		backgroundColor: "rgba(255,255,255,0.05)",
		marginRight: 10,
		flexDirection: "row",
		alignItems: "center",
	},
	yearChipActive: {
		backgroundColor: "#4ECDC4",
	},
	yearChipLocked: {
		opacity: 0.5,
	},
	yearText: {
		color: "#888",
	},
	yearTextActive: {
		color: "#000",
	},
	yearTextLocked: {
		color: "#666",
	},
	grid: {
		paddingHorizontal: 20,
	},
	card: {
		backgroundColor: "rgba(255,255,255,0.08)",
		borderRadius: 16,
		padding: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	cardContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#4ECDC4", // Healthy Green
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	cardTitle: {
		fontSize: 18,
		color: "white",
		marginBottom: 4,
	},
	cardSubtitle: {
		fontSize: 14,
		color: "#888",
	},
});
