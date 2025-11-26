import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Animated,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useHealth } from "../context/HealthContext";

export default function Auth() {
	const router = useRouter();
	const { authenticate } = useHealth();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const scaleAnim = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		authenticate();

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
	}, []);

	const handlePress = async () => {
		setLoading(true);
		setError(null);
		const success = await authenticate();
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
				<Text style={styles.title}>Connect Health</Text>
				<Text style={styles.description}>
					To create your yearly story, we need read-only access to your health
					data. Your data stays on your device and is never uploaded to any
					server.
				</Text>

				{error && <Text style={styles.error}>{error}</Text>}

				<TouchableOpacity
					style={styles.button}
					onPress={handlePress}
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator color="#000" />
					) : (
						<Text style={styles.buttonText}>Allow Access</Text>
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
		fontWeight: "bold",
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
		fontWeight: "bold",
	},
});
