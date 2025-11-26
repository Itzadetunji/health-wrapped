import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";

interface HealthAuthScreenProps {
	authenticate: () => Promise<boolean>;
	onAuthSuccess: () => void;
}

export const HealthAuthScreen: React.FC<HealthAuthScreenProps> = ({
	authenticate,
	onAuthSuccess,
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handlePress = async () => {
		setLoading(true);
		setError(null);
		const success = await authenticate();
		setLoading(false);

		if (success) {
			onAuthSuccess();
		} else {
			setError(
				"We need access to your health data to generate your wrapped story. Please try again."
			);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={styles.iconContainer}>
					<Text style={styles.heartIcon}>❤️</Text>
				</View>
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
};

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
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "rgba(255, 107, 107, 0.2)",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 30,
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
