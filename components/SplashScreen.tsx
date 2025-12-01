import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

export const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.8)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true,
			}),
			Animated.spring(scaleAnim, {
				toValue: 1,
				friction: 4,
				useNativeDriver: true,
			}),
		]).start(() => {
			setTimeout(() => {
				onFinish();
			}, 2000);
		});
	}, [fadeAnim, scaleAnim, onFinish]);

	return (
		<View style={styles.container}>
			<Animated.View
				style={[
					styles.logoContainer,
					{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
				]}
			>
				<Image
					source={require("../assets/icon.jpg")}
					style={styles.logo}
				/>
				<ThemedText
					variant="bold"
					style={styles.title}
				>
					HealthWrapped
				</ThemedText>
				<ThemedText style={styles.tagline}>Yearly Stories</ThemedText>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#121212", // Charcoal-ish
		justifyContent: "center",
		alignItems: "center",
	},
	logoContainer: {
		alignItems: "center",
	},
	logo: {
		width: 100,
		height: 100,
		borderRadius: 20,
		marginBottom: 30,
	},
	title: {
		fontSize: 32,
		color: "white",
		marginBottom: 10,
	},
	tagline: {
		fontSize: 18,
		color: "#888",
		letterSpacing: 2,
	},
});
