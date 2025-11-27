import { useRouter } from "expo-router";
import {
	ArrowUp,
	Dumbbell,
	Flame,
	Footprints,
	Moon,
	Waves,
	X,
} from "lucide-react-native";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	type GestureResponderEvent,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { type HealthData, useHealth } from "../context/HealthContext";
import { Slide } from "./Slide";
import { SummarySlide } from "./SummarySlide";
import {
	getStepsQuote,
	getSwimQuote,
	getCaloriesQuote,
	getSleepQuote,
	getFlightsQuote,
	getExerciseQuote,
} from "../lib/utils";

const { width } = Dimensions.get("window");
const SLIDE_DURATION = 5000; // 5 seconds

interface HealthWrappedProps {
	data: HealthData;
}

interface ProgressBarProps {
	index: number;
	currentIndex: number;
	duration: number;
	onFinish: () => void;
	isPaused: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
	index,
	currentIndex,
	duration,
	onFinish,
	isPaused,
}) => {
	const progress = useRef(new Animated.Value(0)).current;
	const currentProgress = useRef(0);

	useEffect(() => {
		const listener = progress.addListener(({ value }) => {
			currentProgress.current = value;
		});
		return () => {
			progress.removeListener(listener);
		};
	}, [progress]);

	useEffect(() => {
		if (index === currentIndex) {
			progress.setValue(0);
			currentProgress.current = 0;
		}
	}, [currentIndex, index, progress]);

	useEffect(() => {
		if (index === currentIndex) {
			if (isPaused) {
				progress.stopAnimation((value) => {
					currentProgress.current = value;
				});
			} else {
				const startValue = currentProgress.current;
				if (startValue >= 1) return;

				const remainingDuration = duration * (1 - startValue);

				Animated.timing(progress, {
					toValue: 1,
					duration: remainingDuration,
					useNativeDriver: false,
				}).start(({ finished }) => {
					if (finished) {
						onFinish();
					}
				});
			}
		} else if (index < currentIndex) {
			progress.setValue(1);
			currentProgress.current = 1;
			progress.stopAnimation();
		} else {
			progress.setValue(0);
			currentProgress.current = 0;
			progress.stopAnimation();
		}
		return () => progress.stopAnimation();
	}, [currentIndex, index, duration, onFinish, isPaused, progress]);

	const widthInterpolated = progress.interpolate({
		inputRange: [0, 1],
		outputRange: ["0%", "100%"],
	});

	return (
		<View style={styles.progressBarBackground}>
			<Animated.View
				style={[
					styles.progressBarFill,
					{
						width: widthInterpolated,
						backgroundColor: "white",
					},
				]}
			/>
		</View>
	);
};

type SlideData = {
	id: string;
	title: string;
	value: number;
	statLabel: string;
	gradientColors: [string, string, ...string[]];
	icon: React.ReactNode;
	quote: string;
	bottomStat: string;
	isSummary?: false;
};

type SummarySlideData = {
	id: string;
	isSummary: true;
};

type SlideItem = SlideData | SummarySlideData;

export const HealthWrapped: React.FC<HealthWrappedProps> = ({ data }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { selectedYear } = useHealth();

	const slides: SlideItem[] = [
		{
			id: "steps",
			title: "MOVEMENT",
			value: data.steps,
			statLabel: "Steps Taken",
			gradientColors: ["#121212", "#1a1a1a", "#2C3E50"],
			icon: (
				<Footprints
					size={60}
					color="#fff"
				/>
			),
			quote: getStepsQuote(data.steps),
			bottomStat: `${(data.steps * 0.0008).toFixed(1)} km traveled`,
		},
		{
			id: "swim",
			title: "SWIMMING",
			value: data.swimDistance,
			statLabel: "Meters Swum",
			gradientColors: ["#121212", "#1a1a1a", "#1A535C"],
			icon: (
				<Waves
					size={60}
					color="#fff"
				/>
			),
			quote: getSwimQuote(data.swimDistance),
			bottomStat: `${Math.floor(data.swimDistance / 50)} Olympic laps`,
		},
		{
			id: "calories",
			title: "ENERGY",
			value: data.calories,
			statLabel: "Calories Burned",
			gradientColors: ["#121212", "#1a1a1a", "#C0392B"],
			icon: (
				<Flame
					size={60}
					color="#fff"
				/>
			),
			quote: getCaloriesQuote(data.calories),
			bottomStat: "Fueling your journey",
		},
		{
			id: "sleep",
			title: "REST",
			value: Math.round(data.sleep),
			statLabel: "Hours Asleep",
			gradientColors: ["#121212", "#1a1a1a", "#4A235A"],
			icon: (
				<Moon
					size={60}
					color="#fff"
				/>
			),
			quote: getSleepQuote(data.sleep),
			bottomStat: `${Math.round(data.sleep / 24)} days spent dreaming`,
		},
		{
			id: "flights",
			title: "ELEVATION",
			value: data.flights,
			statLabel: "Flights Climbed",
			gradientColors: ["#121212", "#1a1a1a", "#D35400"],
			icon: (
				<ArrowUp
					size={60}
					color="#fff"
				/>
			),
			quote: getFlightsQuote(data.flights),
			bottomStat: `${data.flights * 3} meters climbed`,
		},
		{
			id: "exercise",
			title: "WORKOUTS",
			value: Math.round(data.exercise),
			statLabel: "Minutes Active",
			gradientColors: ["#121212", "#1a1a1a", "#27AE60"],
			icon: (
				<Dumbbell
					size={60}
					color="#fff"
				/>
			),
			quote: getExerciseQuote(data.exercise),
			bottomStat: `${Math.round(data.exercise / 60)} hours of sweat`,
		},
		{
			id: "summary",
			isSummary: true,
		},
	];

	const handleNext = () => {
		if (currentIndex < slides.length - 1) {
			setCurrentIndex((prev) => prev + 1);
		}
	};

	const handlePrev = () => {
		if (currentIndex > 0) {
			setCurrentIndex((prev) => prev - 1);
		}
	};

	const handlePress = (evt: GestureResponderEvent) => {
		const locationX = evt.nativeEvent.locationX;
		if (locationX < width / 3) {
			handlePrev();
		} else {
			handleNext();
		}
	};

	const handleClose = () => {
		router.push("/landing");
	};

	const currentSlide = slides[currentIndex];

	return (
		<SafeAreaProvider style={styles.container}>
			<StatusBar barStyle="light-content" />

			{/* Progress Bars and Header */}
			<View style={[styles.progressContainer, { marginTop: insets.top + 20 }]}>
				<View style={styles.progressContent}>
					<View style={styles.progressBars}>
						{slides.map((slide, index) => (
							<ProgressBar
								key={slide.id}
								index={index}
								currentIndex={currentIndex}
								duration={SLIDE_DURATION}
								onFinish={() => {
									if (index === currentIndex) {
										handleNext();
									}
								}}
								isPaused={isPaused}
							/>
						))}
					</View>
					<TouchableOpacity
						style={[styles.closeButton]}
						onPress={handleClose}
					>
						<X
							color="white"
							size={24}
						/>
					</TouchableOpacity>
				</View>
				<View style={styles.headerContainer}>
					<Text style={styles.headerText}>YOUR {selectedYear} HEALTH</Text>
				</View>
			</View>

			<TouchableWithoutFeedback
				onPress={handlePress}
				onPressIn={() => setIsPaused(true)}
				onPressOut={() => setIsPaused(false)}
				onLongPress={() => {}}
				delayLongPress={200}
			>
				<View style={styles.slideContainer}>
					{currentSlide.isSummary ? (
						<SummarySlide
							data={data}
							isActive={true}
						/>
					) : (
						<Slide
							key={currentSlide.id}
							title={currentSlide.title}
							value={currentSlide.value}
							statLabel={currentSlide.statLabel}
							gradientColors={currentSlide.gradientColors}
							icon={currentSlide.icon}
							isActive={true}
							quote={currentSlide.quote}
							bottomStat={currentSlide.bottomStat}
						/>
					)}
				</View>
			</TouchableWithoutFeedback>
		</SafeAreaProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "black",
		position: "relative",
	},
	progressContent: {
		display: "flex",
		flexDirection: "row",
		alignContent: "center",
		gap: 40,
	},
	progressContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 10,
		marginHorizontal: 20,
	},
	closeButton: {
		// position: "absolute",
		// top: 15,
		// right: 15,
		// zIndex: 20,
	},
	progressBars: {
		flexDirection: "row",
		flex: 1,
		display: "flex",
		gap: 4,
		alignItems: "center",
	},
	progressBarBackground: {
		flex: 1,
		height: 3,
		backgroundColor: "rgba(255,255,255,0.3)",
		borderRadius: 2,
		overflow: "hidden",
	},
	progressBarFill: {
		height: "100%",
		borderRadius: 2,
	},

	slideContainer: {
		flex: 1,
	},
	headerContainer: {
		width: "100%",
	},
	headerText: {
		color: "rgba(255,255,255,0.7)",
		fontSize: 12,
		fontWeight: "bold",
		letterSpacing: 1.5,
	},
});
