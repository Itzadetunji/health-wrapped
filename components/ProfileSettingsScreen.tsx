import React from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	Alert,
	Switch,
} from "react-native";
import { useHealth } from "../context/HealthContext";
import { ChevronLeft, Trash2, Crown } from "lucide-react-native";

interface ProfileSettingsScreenProps {
	onBack: () => void;
}

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
	onBack,
}) => {
	const { isPro, togglePro } = useHealth();

	const handleDeleteAccount = () => {
		Alert.alert(
			"Delete Account",
			"Are you sure you want to delete your account? This action cannot be undone.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => console.log("Account deleted"),
				},
			]
		);
	};

	return (
		<SafeAreaView style={styles.container}>
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

				<TouchableOpacity
					style={styles.deleteButton}
					onPress={handleDeleteAccount}
				>
					<Trash2
						color="#FF6B6B"
						size={20}
						style={{ marginRight: 10 }}
					/>
					<Text style={styles.deleteButtonText}>Delete Account</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
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
	deleteButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(255, 107, 107, 0.1)",
		paddingVertical: 16,
		borderRadius: 30, // Rounded corner button
		borderWidth: 1,
		borderColor: "rgba(255, 107, 107, 0.3)",
	},
	deleteButtonText: {
		color: "#FF6B6B",
		fontWeight: "bold",
		fontSize: 16,
	},
});
