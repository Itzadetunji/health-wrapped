import { Text, type TextProps, StyleSheet } from "react-native";

interface ThemedTextProps extends TextProps {
	variant?: "default" | "medium" | "semibold" | "bold" | "extrabold";
}

export function ThemedText({
	style,
	variant = "default",
	...props
}: ThemedTextProps) {
	return (
		<Text
			style={[styles[variant], style]}
			{...props}
		/>
	);
}

const styles = StyleSheet.create({
	default: {
		fontFamily: "PlusJakartaSans_400Regular",
	},
	medium: {
		fontFamily: "PlusJakartaSans_500Medium",
	},
	semibold: {
		fontFamily: "PlusJakartaSans_600SemiBold",
	},
	bold: {
		fontFamily: "PlusJakartaSans_700Bold",
	},
	extrabold: {
		fontFamily: "PlusJakartaSans_800ExtraBold",
	},
});
