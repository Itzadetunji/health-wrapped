import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Animated,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useHealth } from "../context/HealthContext";
import { storeData } from "../lib/utils";
import { ThemedText } from "../components/ThemedText";

export default function Auth() {
	const router = useRouter();
	const { authenticate } = useHealth();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const scaleAnim = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(scaleAnim, {
					toValue: 1.05,
					duration: 800,
					useNativeDriver: true,
				}),
				Animated.timing(scaleAnim, {
					toValue: 1,
					duration: 800,
					useNativeDriver: true,
				}),
			])
		).start();
	}, [scaleAnim]);

	const handlePress = async () => {
		setLoading(true);
		setError(null);
		const success = await authenticate();

		await storeData("AUTHENTICATED_FIRST_TIME", { value: true });

		setLoading(false);

		if (success) {
			router.replace("/landing");
		} else {
			setError(
				"We need access to your health data to generate your wrapped story. Please try again."
			);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Animated.Image
					source={require("../assets/apple-health.png")}
					style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}
				/>
				<ThemedText
					variant="bold"
					style={styles.title}
				>
					Connect Health
				</ThemedText>
				<ThemedText style={styles.description}>
					To create your yearly story, we need read-only access to your health
					data. Your data stays on your device and is never uploaded to any
					server.
				</ThemedText>

				{error && <ThemedText style={styles.error}>{error}</ThemedText>}

				<TouchableOpacity
					style={styles.button}
					onPress={handlePress}
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator color="#000" />
					) : (
						<ThemedText
							variant="bold"
							style={styles.buttonText}
						>
							Continue
						</ThemedText>
					)}
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#121212",
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	content: {
		alignItems: "center",
		maxWidth: 320,
	},
	iconContainer: {
		width: 56,
		height: 56,
		marginRight: 12,
		marginBottom: 8,
	},
	heartIcon: {
		fontSize: 40,
	},
	title: {
		fontSize: 28,
		color: "white",
		marginBottom: 16,
		textAlign: "center",
	},
	description: {
		fontSize: 16,
		color: "#aaa",
		textAlign: "center",
		marginBottom: 40,
		lineHeight: 24,
	},
	error: {
		color: "#FF6B6B",
		marginBottom: 20,
		textAlign: "center",
	},
	button: {
		backgroundColor: "#4ECDC4",
		paddingVertical: 16,
		paddingHorizontal: 32,
		borderRadius: 30,
		width: "100%",
		alignItems: "center",
	},
	buttonText: {
		color: "#000",
		fontSize: 18,
	},
});
