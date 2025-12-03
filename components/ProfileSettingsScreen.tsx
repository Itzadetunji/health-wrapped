import { useRouter } from "expo-router";
import { ChevronLeft, Crown } from "lucide-react-native";
import type React from "react";
import { useEffect, useState } from "react";
import {
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Linking,
} from "react-native";
import type {
	PurchasesOfferings,
	PurchasesPackage,
} from "react-native-purchases";
import Purchases from "react-native-purchases";
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
	const { isPro, updateProStatus } = useHealth();
	const router = useRouter();
	const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const insets = useSafeAreaInsets();

	const handlePurchase = async (pkg: PurchasesPackage) => {
		try {
			const purchaseMade = await Purchases.purchasePackage(pkg);
			console.log(purchaseMade.customerInfo.entitlements);
			if (
				typeof purchaseMade.customerInfo.entitlements.active
					.health_wrapped_yearly !== "undefined"
			) {
				setShowSuccessModal(true);
				updateProStatus(purchaseMade.customerInfo);
			}
		} catch (e) {
			console.log("Purchase error:", e);
		}
	};

	const getOfferings = async () => {
		const offerings = await Purchases.getOfferings();
		if (
			offerings.current !== null &&
			offerings.current.availablePackages.length !== 0
		) {
			// console.log("Offerings:", JSON.stringify(offerings, null, 2));
			setOfferings(offerings);
		}
	};

	useEffect(() => {
		getOfferings();
	}, []);

	return (
		<SafeAreaProvider style={[styles.container, { paddingTop: insets.top }]}>
			<Modal
				visible={showSuccessModal}
				transparent
				animationType="fade"
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={{ fontSize: 50 }}>🎉</Text>
						<ThemedText
							variant="bold"
							style={styles.modalTitle}
						>
							You've Subscribed!
						</ThemedText>
						<ThemedText style={styles.modalText}>
							Thank you for subscribing 🎉
						</ThemedText>
						<TouchableOpacity
							onPress={() => {
								setShowSuccessModal(false);
								router.push("/landing");
							}}
							style={styles.modalButton}
						>
							<ThemedText style={styles.modalButtonText}>Let's Go!</ThemedText>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

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

			{!offerings?.current?.availablePackages.length ? (
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
									Premium Subscription
								</ThemedText>
							</View>
							<View style={styles.priceContainer}>
								<ThemedText
									style={styles.priceValue}
									variant="bold"
								>
									Premium Health Wrapped
								</ThemedText>
								<ThemedText style={styles.pricePeriod}>/year</ThemedText>
							</View>
						</View>
						<ThemedText style={styles.proDescription}>
							Unlock premium features and full access to your health wrapped.
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
						</View>
						<TouchableOpacity
							style={[
								isPro ? styles.unsubscribeButton : styles.subscribeButton,
								{ marginBottom: 10 },
							]}
							onPress={() => handlePurchase("health_wrapped_yearly" as any)}
							disabled={isPro}
						>
							<ThemedText
								variant="bold"
								style={
									isPro
										? styles.unsubscribeButtonText
										: styles.subscribeButtonText
								}
							>
								{isPro ? "You are subscribed" : `Subscribe - $4.99`}
							</ThemedText>
						</TouchableOpacity>
					</View>
				</View>
			) : (
				offerings?.current?.availablePackages.map((item) => (
					<View
						style={styles.content}
						key={item.identifier}
					>
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
										Premium Subscription
									</ThemedText>
								</View>
								<View style={styles.priceContainer}>
									<ThemedText
										style={styles.priceValue}
										variant="bold"
									>
										{item.product.priceString}
									</ThemedText>
									<ThemedText style={styles.pricePeriod}>
										/{item.packageType === "ANNUAL" ? "year" : "month"}
									</ThemedText>
								</View>
							</View>
							<ThemedText style={styles.proDescription}>
								Unlock premium features and full access to your health wrapped.
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
							</View>
							<TouchableOpacity
								style={[
									isPro ? styles.unsubscribeButton : styles.subscribeButton,
									{ marginBottom: 10 },
								]}
								onPress={() => handlePurchase(item)}
								disabled={isPro}
							>
								<ThemedText
									variant="bold"
									style={
										isPro
											? styles.unsubscribeButtonText
											: styles.subscribeButtonText
									}
								>
									{isPro
										? "You are subscribed"
										: `Subscribe - ${item.product.priceString}`}
								</ThemedText>
							</TouchableOpacity>
						</View>
					</View>
				))
			)}

			<View style={styles.footer}>
				<TouchableOpacity
					onPress={() =>
						Linking.openURL("https://health-wrapped-support.vercel.app/privacy")
					}
				>
					<ThemedText style={styles.footerLink}>Privacy Policy</ThemedText>
				</TouchableOpacity>
				<ThemedText style={styles.footerDivider}>•</ThemedText>

				<TouchableOpacity
					onPress={() =>
						Linking.openURL("https://health-wrapped-support.vercel.app/support")
					}
				>
					<ThemedText style={styles.footerLink}>Support</ThemedText>
				</TouchableOpacity>
				<ThemedText style={styles.footerDivider}>•</ThemedText>
				<TouchableOpacity
					onPress={() =>
						Linking.openURL("https://health-wrapped-support.vercel.app/terms")
					}
				>
					<ThemedText style={styles.footerLink}>Terms</ThemedText>
				</TouchableOpacity>
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
		display: "flex",
		flexDirection: "column",
		borderColor: "rgba(255, 215, 0, 0.3)",
	},
	proHeader: {
		flexDirection: "column",
		justifyContent: "space-between",
		marginBottom: 10,
		gap: 10,
	},
	proTitleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	proTitle: {
		fontSize: 18,
		color: "white",
		flexShrink: 1,
	},
	priceContainer: {
		flexDirection: "row",
		alignItems: "baseline",
	},
	priceValue: {
		fontSize: 22,
		fontWeight: "bold",
		color: "white",
	},
	pricePeriod: {
		fontSize: 14,
		color: "rgba(255,255,255,0.6)",
		marginLeft: 2,
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
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.8)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: "#1E1E1E",
		padding: 30,
		borderRadius: 20,
		alignItems: "center",
		width: "80%",
	},
	modalTitle: {
		fontSize: 24,
		color: "white",
		marginTop: 20,
		marginBottom: 10,
	},
	modalText: {
		color: "#aaa",
		textAlign: "center",
		marginBottom: 20,
	},
	modalButton: {
		backgroundColor: "#4ECDC4",
		paddingHorizontal: 30,
		paddingVertical: 12,
		borderRadius: 20,
	},
	modalButtonText: {
		color: "#000",
		fontWeight: "bold",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingBottom: 30,
		gap: 10,
	},
	footerLink: {
		color: "#666",
		fontSize: 12,
		textDecorationLine: "underline",
	},
	footerDivider: {
		color: "#666",
		fontSize: 12,
	},
});
