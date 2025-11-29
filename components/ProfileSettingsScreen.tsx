import { ChevronLeft, Crown } from "lucide-react-native";
import type React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useHealth } from "../context/HealthContext";
import { ThemedText } from "./ThemedText";

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
				<ThemedText
					variant="bold"
					style={styles.headerTitle}
				>
					Settings
				</ThemedText>
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
							<ThemedText
								variant="bold"
								style={styles.proTitle}
							>
								Pro Plan
							</ThemedText>
						</View>
					</View>
					<ThemedText style={styles.proDescription}>
						Unlock premium features and full access to your health history.
					</ThemedText>

					<View style={styles.featuresList}>
						<View style={styles.featureItem}>
							<View style={styles.featureBullet} />
							<ThemedText style={styles.featureText}>
								View individual month breakdowns
							</ThemedText>
						</View>
						<View style={styles.featureItem}>
							<View style={styles.featureBullet} />
							<ThemedText style={styles.featureText}>
								Access all previous years of data
							</ThemedText>
						</View>
						<View style={styles.featureItem}>
							<View style={styles.featureBullet} />
							<ThemedText style={styles.featureText}>
								Advanced health insights and trends
							</ThemedText>
						</View>
						<View style={styles.featureItem}>
							<View style={styles.featureBullet} />
							<ThemedText style={styles.featureText}>
								Export your health data
							</ThemedText>
						</View>
					</View>

					<TouchableOpacity
						style={isPro ? styles.unsubscribeButton : styles.subscribeButton}
						onPress={togglePro}
					>
						<ThemedText
							variant="bold"
							style={
								isPro
									? styles.unsubscribeButtonText
									: styles.subscribeButtonText
							}
						>
							{isPro ? "Cancel Subscription" : "Subscribe - $4.99/yr"}
						</ThemedText>
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
		fontSize: 16,
	},
	unsubscribeButtonText: {
		color: "#4ECDC4",
		fontSize: 16,
	},
	spacer: {
		flex: 1,
	},
	featuresList: {
		marginBottom: 20,
		gap: 12,
	},
	featureItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	featureBullet: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: "#4ECDC4",
	},
	featureText: {
		color: "#e0e0e0",
		fontSize: 14,
		flex: 1,
	},
});
