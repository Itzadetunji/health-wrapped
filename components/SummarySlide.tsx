import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HealthData, useHealth } from "../context/HealthContext";

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
	const { selectedYear } = useHealth();

	useEffect(() => {
		if (isActive) {
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true,
			}).start();
		}
	}, [isActive]);

	return (
		<LinearGradient
			colors={["#121212", "#2C3E50"]}
			style={styles.container}
		>
			<Animated.View style={{ opacity: fadeAnim, width: "100%", padding: 30 }}>
				<View style={styles.headerContainer}>
					<Text style={styles.headerText}>{selectedYear} WRAPPED</Text>
				</View>

				<Text style={styles.title}>Your Health Summary</Text>

				<View style={styles.card}>
					<View style={styles.row}>
						<Text style={styles.label}>Steps</Text>
						<Text style={styles.value}>{data.steps.toLocaleString()}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Distance</Text>
						<Text style={styles.value}>
							{(data.steps * 0.0008).toFixed(1)} km
						</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Calories</Text>
						<Text style={styles.value}>
							{data.calories.toLocaleString()} kcal
						</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Sleep</Text>
						<Text style={styles.value}>
							{Math.round(data.sleep).toLocaleString()} hrs
						</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Flights</Text>
						<Text style={styles.value}>{data.flights.toLocaleString()}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Exercise</Text>
						<Text style={styles.value}>
							{Math.round(data.exercise).toLocaleString()} min
						</Text>
					</View>
				</View>

				<Text style={styles.footer}>See you next year!</Text>
			</Animated.View>
		</LinearGradient>
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
		fontWeight: "bold",
		letterSpacing: 2,
	},
	title: {
		fontSize: 32,
		fontWeight: "800",
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
		fontWeight: "bold",
		color: "white",
	},
	footer: {
		marginTop: 40,
		textAlign: "center",
		color: "rgba(255,255,255,0.5)",
		fontSize: 16,
		fontStyle: "italic",
	},
});
