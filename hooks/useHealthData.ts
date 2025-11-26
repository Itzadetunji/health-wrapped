import { useEffect, useState } from "react";
import HealthKit, {
	CategoryValueSleepAnalysis,
	requestAuthorization,
	type QuantityTypeIdentifier,
	type CategoryTypeIdentifier,
} from "@kingstinct/react-native-healthkit";
import { Alert, Linking } from "react-native";

export interface HealthData {
	steps: number;
	swimDistance: number;
	calories: number;
	sleep: number; // in hours
	flights: number;
	exercise: number; // in minutes
}

export const useHealthData = () => {
	const [data, setData] = useState<HealthData>({
		steps: 0,
		swimDistance: 0,
		calories: 0,
		sleep: 0,
		flights: 0,
		exercise: 0,
	});
	const [loading, setLoading] = useState(false);
	const [authorized, setAuthorized] = useState(false);

	const fetchData = async () => {
		const now = new Date();
		const oneYearAgo = new Date();
		oneYearAgo.setFullYear(now.getFullYear() - 1);

		try {
			// Steps
			const stepsStats = await HealthKit.queryStatisticsForQuantity(
				"HKQuantityTypeIdentifierStepCount",
				["cumulativeSum"],
				{
					filter: {
						startDate: oneYearAgo,
						endDate: now,
					},
				},
			);
			const steps = stepsStats.sumQuantity?.quantity ?? 0;

			// Swim Distance
			const swimStats = await HealthKit.queryStatisticsForQuantity(
				"HKQuantityTypeIdentifierDistanceSwimming",
				["cumulativeSum"],
				{
					filter: {
						startDate: oneYearAgo,
						endDate: now,
					},
				},
			);
			const swimDistance = swimStats.sumQuantity?.quantity ?? 0;

			// Calories
			const caloriesStats = await HealthKit.queryStatisticsForQuantity(
				"HKQuantityTypeIdentifierActiveEnergyBurned",
				["cumulativeSum"],
				{
					filter: {
						startDate: oneYearAgo,
						endDate: now,
					},
				},
			);
			const calories = caloriesStats.sumQuantity?.quantity ?? 0;

			// Flights
			const flightsStats = await HealthKit.queryStatisticsForQuantity(
				"HKQuantityTypeIdentifierFlightsClimbed",
				["cumulativeSum"],
				{
					filter: {
						startDate: oneYearAgo,
						endDate: now,
					},
				},
			);
			const flights = flightsStats.sumQuantity?.quantity ?? 0;

			// Exercise Time
			const exerciseStats = await HealthKit.queryStatisticsForQuantity(
				"HKQuantityTypeIdentifierAppleExerciseTime",
				["cumulativeSum"],
				{
					filter: {
						startDate: oneYearAgo,
						endDate: now,
					},
				},
			);
			const exercise = exerciseStats.sumQuantity?.quantity ?? 0;

			// Sleep
			const sleepSamples = await HealthKit.queryCategorySamples(
				"HKCategoryTypeIdentifierSleepAnalysis",
				{
					filter: {
						startDate: oneYearAgo,
						endDate: now,
					},
				},
			);

			let totalSleepMinutes = 0;
			sleepSamples.forEach((sample) => {
				if (
					sample.value === CategoryValueSleepAnalysis.asleepUnspecified ||
					sample.value === CategoryValueSleepAnalysis.asleepCore ||
					sample.value === CategoryValueSleepAnalysis.asleepDeep ||
					sample.value === CategoryValueSleepAnalysis.asleepREM
				) {
					const start = new Date(sample.startDate).getTime();
					const end = new Date(sample.endDate).getTime();
					totalSleepMinutes += (end - start) / (1000 * 60);
				}
			});
			const sleep = totalSleepMinutes / 60; // Hours

			setData({
				steps,
				swimDistance,
				calories,
				sleep,
				flights,
				exercise,
			});
		} catch (e) {
			console.error("Error fetching health data", e);
		}
	};

	const authenticate = async () => {
		setLoading(true);
		try {
			const readPermissions: (
				| QuantityTypeIdentifier
				| CategoryTypeIdentifier
			)[] = [
				"HKQuantityTypeIdentifierStepCount",
				"HKQuantityTypeIdentifierDistanceSwimming",
				"HKQuantityTypeIdentifierActiveEnergyBurned",
				"HKCategoryTypeIdentifierSleepAnalysis",
				"HKQuantityTypeIdentifierFlightsClimbed",
				"HKQuantityTypeIdentifierAppleExerciseTime",
			];

			const isAuthorized = await requestAuthorization({
				toRead: readPermissions,
			});
			setAuthorized(isAuthorized);

			if (isAuthorized) {
				await fetchData();
			}
			return isAuthorized;
		} catch (e) {
			console.error("Error requesting authorization", e);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { data, loading, authorized, authenticate };
};

export const tellUserToEnableHealthPermissions = () => {
	Alert.alert(
		"No Health Data Found",
		"We couldn't find any steps data for this year. Please grant permission in Settings:\n\nSettings > Health > Data Access & Devices > Health Wrapped > Turn On All. \n\nRestart the app after enabling permissions.",
		[
			{
				text: "Open Settings",
				onPress: () => {
					// Opens the Health app
					Linking.openSettings().catch(() => {
						Alert.alert("Error", "Could not open Settings");
					});
				},
			},
		],
	);
	return false;
};
