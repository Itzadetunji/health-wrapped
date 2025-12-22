import { LinearGradient } from "expo-linear-gradient";
import type React from "react";
import { useEffect, useRef } from "react";
import {
	Animated,
	Dimensions,
	Share,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import { type HealthData, useHealth } from "../context/HealthContext";
import { months } from "./LandingScreen";
import { ThemedText } from "./ThemedText";

const { width, height } = Dimensions.get("window");

interface SummarySlideProps {
	data: HealthData;
	isActive: boolean;
}

export const SummarySlide: React.FC<SummarySlideProps> = ({
	data,
	isActive,
}) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const pulseAnim = useRef(new Animated.Value(0)).current;
	const viewRef = useRef(null);
	const { selectedMonth, selectedYear } = useHealth();

	useEffect(() => {
		if (isActive) {
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true,
			}).start();

			Animated.loop(
				Animated.sequence([
					Animated.timing(pulseAnim, {
						toValue: 1,
						duration: 4000,
						useNativeDriver: true,
					}),
					Animated.timing(pulseAnim, {
						toValue: 0,
						duration: 4000,
						useNativeDriver: true,
					}),
				])
			).start();
		}
	}, [isActive]);

	const shareSummary = async () => {
		try {
			const uri = await captureRef(viewRef, {
				format: "png",
				quality: 1,
			});

			await Share.share({
				url: uri,
				message:
					"Check out my health wrapped for 2025, can't believe I did this much! https://apps.apple.com/us/app/health-wrapped/id6739168237",
			});
		} catch (error) {
			console.error("Error sharing summary:", error);
		}
	};

	return (
		<View style={styles.container}>
			<View
				ref={viewRef}
				collapsable={false}
				style={[
					StyleSheet.absoluteFill,
					{ justifyContent: "center", alignItems: "center" },
				]}
			>
				<LinearGradient
					colors={["#121212", "#2C3E50"]}
					style={StyleSheet.absoluteFill}
				/>
				<Animated.View
					style={[StyleSheet.absoluteFill, { opacity: pulseAnim }]}
				>
					<LinearGradient
						colors={["#121212", "#2C3E50"]}
						style={StyleSheet.absoluteFill}
						start={{ x: 0.5, y: 0 }}
						end={{ x: 0.5, y: 1 }}
					/>
				</Animated.View>

				<Animated.View
					style={{ opacity: fadeAnim, width: "100%", padding: 30 }}
				>
					<View style={styles.headerContainer}>
						<ThemedText
							variant="bold"
							style={styles.headerText}
						>
							{selectedMonth !== null
								? `${months[selectedMonth + 1].toUpperCase()} `
								: ""}
							{selectedYear} WRAPPED
						</ThemedText>
					</View>

					<ThemedText
						variant="extrabold"
						style={styles.title}
					>
						Your Health Summary
					</ThemedText>

					<View style={styles.card}>
						{!!data.steps && (
							<View style={styles.row}>
								<ThemedText
									variant="medium"
									style={styles.label}
								>
									Steps
								</ThemedText>
								<ThemedText
									variant="bold"
									style={styles.value}
								>
									{data.steps.toLocaleString()}
								</ThemedText>
							</View>
						)}
						{!!data.steps && (
							<View style={styles.row}>
								<ThemedText
									variant="medium"
									style={styles.label}
								>
									Distance
								</ThemedText>
								<ThemedText
									variant="bold"
									style={styles.value}
								>
									{(data.steps * 0.0008).toFixed(1)} km
								</ThemedText>
							</View>
						)}
						{!!data.calories && (
							<View style={styles.row}>
								<ThemedText
									variant="medium"
									style={styles.label}
								>
									Calories
								</ThemedText>
								<ThemedText
									variant="bold"
									style={styles.value}
								>
									{Math.round(data.calories).toLocaleString()} kcal
								</ThemedText>
							</View>
						)}
						{!!data.sleep && (
							<View style={styles.row}>
								<ThemedText
									variant="medium"
									style={styles.label}
								>
									Sleep
								</ThemedText>
								<ThemedText
									variant="bold"
									style={styles.value}
								>
									{Math.round(data.sleep).toLocaleString()} hrs
								</ThemedText>
							</View>
						)}
						{!!data.flights && (
							<View style={styles.row}>
								<ThemedText
									variant="medium"
									style={styles.label}
								>
									Flights
								</ThemedText>
								<ThemedText
									variant="bold"
									style={styles.value}
								>
									{data.flights.toLocaleString()}
								</ThemedText>
							</View>
						)}
						{!!data.exercise && (
							<View
								style={[
									styles.row,
									{ borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 },
								]}
							>
								<ThemedText
									variant="medium"
									style={styles.label}
								>
									Exercise
								</ThemedText>
								<ThemedText
									variant="bold"
									style={styles.value}
								>
									{Math.round(data.exercise).toLocaleString()} min
								</ThemedText>
							</View>
						)}
					</View>

					<ThemedText style={styles.footer}>
						Health Wrapped: Yearly Stories
					</ThemedText>
				</Animated.View>
			</View>

			<Animated.View
				style={{ opacity: fadeAnim, position: "absolute", bottom: 50 }}
			>
				<TouchableOpacity
					onPress={shareSummary}
					style={styles.shareButton}
				>
					<ThemedText
						variant="bold"
						style={styles.shareButtonText}
					>
						Share Summary
					</ThemedText>
				</TouchableOpacity>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width,
		height,
		justifyContent: "center",
		alignItems: "center",
	},
	headerContainer: {
		alignItems: "center",
		marginBottom: 20,
	},
	headerText: {
		color: "#4ECDC4",
		fontSize: 14,
		letterSpacing: 2,
	},
	title: {
		fontSize: 32,
		color: "white",
		marginBottom: 40,
		textAlign: "center",
	},
	card: {
		backgroundColor: "rgba(255,255,255,0.1)",
		borderRadius: 20,
		padding: 20,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 15,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255,255,255,0.1)",
		paddingBottom: 10,
	},
	label: {
		fontSize: 18,
		color: "rgba(255,255,255,0.7)",
	},
	value: {
		fontSize: 20,
		color: "white",
	},
	footer: {
		marginTop: 40,
		textAlign: "center",
		color: "rgba(255,255,255,0.5)",
		fontSize: 16,
	},
	shareButton: {
		backgroundColor: "#4ECDC4",
		paddingHorizontal: 30,
		paddingVertical: 15,
		borderRadius: 30,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
		elevation: 8,
	},
	shareButtonText: {
		color: "#121212",
		fontSize: 18,
	},
});
