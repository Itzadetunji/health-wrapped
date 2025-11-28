import { HealthWrapped } from "../components/HealthWrapped";
import { useHealth } from "../context/HealthContext";

export default function Wrapped() {
	const { data } = useHealth();
	return <HealthWrapped data={data} />;
}
