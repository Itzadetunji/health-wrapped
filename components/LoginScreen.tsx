import React from "react";
import { View, Text, StyleSheet, Dimensions, Alert, Image } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");

export const LoginScreen = ({
	onLoginSuccess,
}: {
	onLoginSuccess: () => void;
}) => {
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Image
					source={require("../assets/icon.png")}
					style={styles.logo}
				/>
				<Text style={styles.title}>HealthWrapped</Text>
				<Text style={styles.subtitle}>Sign in to see your year in health</Text>

				<Link href="/auth">Authenticate Health</Link>
				{/* <AppleAuthentication.AppleAuthenticationButton
					buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
					buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
					cornerRadius={5}
					style={styles.button}
					onPress={async () => {
						try {
							const credential = await AppleAuthentication.signInAsync({
								requestedScopes: [
									AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
									AppleAuthentication.AppleAuthenticationScope.EMAIL,
								],
							});
							// signed in
							onLoginSuccess();
						} catch (e: any) {
							if (e.code === "ERR_REQUEST_CANCELED") {
								// handle that the user canceled the sign-in flow
							} else {
								// handle other errors
								Alert.alert("Error", "Could not sign in with Apple");
							}
						}
					}}
				/> */}
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
	},
	content: {
		alignItems: "center",
		width: "100%",
		paddingHorizontal: 40,
	},
	logo: {
		width: 80,
		height: 80,
		borderRadius: 16,
		marginBottom: 24,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "white",
		marginBottom: 12,
	},
	subtitle: {
		fontSize: 16,
		color: "#888",
		marginBottom: 48,
		textAlign: "center",
	},
	button: {
		width: "100%",
		height: 50,
	},
});
