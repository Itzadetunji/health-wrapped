import { ChevronLeft, Crown } from "lucide-react-native";
import type React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useHealth } from "../context/HealthContext";

interface ProfileSettingsScreenProps {
	onBack: () => void;
}

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
	onBack,
}) => {
	const { isPro, togglePro } = useHealth();
	const insets = useSafeAreaInsets();

	return (
		<SafeAreaProvider style={[styles.container, { paddingTop: insets.top }]}>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={onBack}
					style={styles.backButton}
				>
					<ChevronLeft
						color="white"
						size={24}
					/>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Settings</Text>
				<View style={{ width: 40 }} />
			</View>

			<View style={styles.content}>
				<View style={styles.proCard}>
					<View style={styles.proHeader}>
						<View style={styles.proTitleRow}>
							<Crown
								color="#FFD700"
								size={24}
								fill="#FFD700"
							/>
							<Text style={styles.proTitle}>Pro Plan</Text>
						</View>
					</View>
					<Text style={styles.proDescription}>
						Unlock access to all your historical health data and premium
						insights.
					</Text>
					<TouchableOpacity
						style={isPro ? styles.unsubscribeButton : styles.subscribeButton}
						onPress={togglePro}
					>
						<Text
							style={
								isPro
									? styles.unsubscribeButtonText
									: styles.subscribeButtonText
							}
						>
							{isPro ? "Cancel Subscription" : "Subscribe - $4.99/yr"}
						</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.spacer} />
			</View>
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
		paddingVertical: 15,
	},
	backButton: {
		padding: 8,
		backgroundColor: "rgba(255,255,255,0.1)",
		borderRadius: 20,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "white",
	},
	content: {
		padding: 20,
		flex: 1,
	},
	proCard: {
		backgroundColor: "rgba(255,255,255,0.08)",
		borderRadius: 20,
		padding: 20,
		borderWidth: 1,
		borderColor: "rgba(255, 215, 0, 0.3)",
	},
	proHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	proTitleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	proTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "white",
	},
	proDescription: {
		color: "#aaa",
		marginBottom: 20,
		lineHeight: 20,
	},
	subscribeButton: {
		backgroundColor: "#4ECDC4",
		paddingVertical: 12,
		borderRadius: 12,
		alignItems: "center",
	},
	unsubscribeButton: {
		borderColor: "#4ECDC4",
		borderWidth: 1,
		paddingVertical: 12,
		borderRadius: 12,
		alignItems: "center",
		color: "#4ECDC4",
	},
	subscribeButtonText: {
		color: "#000",
		fontWeight: "bold",
		fontSize: 16,
	},
	unsubscribeButtonText: {
		color: "#4ECDC4",
		fontWeight: "bold",
		fontSize: 16,
	},
	spacer: {
		flex: 1,
	},
});
