import { LinearGradient } from "expo-linear-gradient";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface SlideProps {
	title: string; // e.g. MOVEMENT
	value: number;
	statLabel: string; // e.g. Steps Taken
	gradientColors: [string, string, ...string[]];
	icon: React.ReactNode;
	isActive: boolean;
	quote: string;
	bottomStat?: string;
	bottomStatIcon?: React.ReactNode;
	formatValue?: (val: number) => string;
}

export const Slide: React.FC<SlideProps> = ({
	title,
	value,
	statLabel,
	gradientColors,
	icon,
	isActive,
	quote,
	bottomStat,
	bottomStatIcon,
	formatValue = (val) => Math.floor(val).toLocaleString(),
}) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const [displayValue, setDisplayValue] = useState(0);
	const countAnim = useRef(new Animated.Value(0)).current;
	const pulseAnim = useRef(new Animated.Value(0)).current;

	const insets = useSafeAreaInsets();

	useEffect(() => {
		if (isActive) {
			// Reset
			fadeAnim.setValue(0);
			countAnim.setValue(0);
			setDisplayValue(0);

			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(countAnim, {
					toValue: value,
					duration: 2000,
					useNativeDriver: false,
				}),
			]).start();

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
	}, [isActive, value]);

	useEffect(() => {
		const listener = countAnim.addListener(({ value }) => {
			setDisplayValue(value);
		});
		return () => {
			countAnim.removeListener(listener);
		};
	}, []);

	return (
		<View style={[styles.container, { paddingTop: insets.top + 40 }]}>
			<LinearGradient colors={gradientColors} />
			<Animated.View style={[StyleSheet.absoluteFill, { opacity: pulseAnim }]}>
				<LinearGradient
					colors={gradientColors}
					style={StyleSheet.absoluteFill}
					start={{ x: 0.2, y: 0.2 }}
					end={{ x: 0.8, y: 0.8 }}
				/>
			</Animated.View>

			<Animated.View
				style={{
					opacity: fadeAnim,
					alignItems: "center",
					width: "100%",
					flex: 1,
				}}
			>
				<View style={styles.contentContainer}>
					<View style={styles.iconCircle}>{icon}</View>

					<Text style={styles.title}>{title}</Text>
					<Text style={styles.value}>{formatValue(displayValue)}</Text>
					<Text style={styles.statLabel}>{statLabel}</Text>

					<Text style={styles.quote}>"{quote}"</Text>

					{bottomStat && (
						<View style={styles.bottomPill}>
							{bottomStatIcon && (
								<View style={{ marginRight: 8 }}>{bottomStatIcon}</View>
							)}
							<Text style={styles.bottomPillText}>{bottomStat}</Text>
						</View>
					)}
				</View>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width,
		height,
		flex: 1,
	},

	contentContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 30,
		paddingBottom: 100, // Adjust for visual balance
	},
	iconCircle: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: "rgba(255,255,255,0.1)",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 40,
	},
	title: {
		fontSize: 24,
		fontWeight: "800",
		color: "rgba(255,255,255,0.9)",
		marginBottom: 10,
		textAlign: "center",
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	value: {
		fontSize: 64,
		fontWeight: "900",
		color: "white",
		textAlign: "center",
		lineHeight: 70,
	},
	statLabel: {
		fontSize: 20,
		color: "rgba(255,255,255,0.9)",
		marginTop: 10,
		fontWeight: "500",
	},
	quote: {
		fontSize: 18,
		color: "white",
		marginTop: 40,
		textAlign: "center",
		lineHeight: 26,
		fontWeight: "600",
	},
	bottomPill: {
		flexDirection: "row",
		backgroundColor: "rgba(0,0,0,0.2)",
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 30,
		marginTop: 50,
		alignItems: "center",
	},
	bottomPillText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
	},
});
