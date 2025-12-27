import dpsLogo from './assets/DPS.svg';
import './App.css';
import { useEffect, useState } from 'react';

interface OpenPlzResponse {
  name: string;
  postalCode: string;
}

const getPostalCode = (item: OpenPlzResponse) =>
  item.postalCode ?? "";

function useDebounce<T>(value: T, delay = 1000, resetToken?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    if (resetToken !== undefined) {
      setDebouncedValue(value);
    }
  }, [resetToken]);

  useEffect(() => {
    if ((value as any) === "") {
      setDebouncedValue(value);
      return;
    }

    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function App() {
	  	const [locality, setLocality] = useState("");
		const [plz, setPlz] = useState("");
		const [plzOptions, setPlzOptions] = useState<string[]>([]);
		const [error, setError] = useState("");
		const [plzFromLocality, setPlzFromLocality] = useState(false);
		const [localityFromPlz, setLocalityFromPlz] = useState(false);
		const [resetToken, setResetToken] = useState(0);
		const debouncedLocality = useDebounce(locality, 1000, resetToken);
		const debouncedPlz = useDebounce(plz, 1000, resetToken);
		const canReset =
			locality.trim().length > 0 ||
			plz.trim().length > 0 ||
			plzOptions.length > 0 ||
			error.length > 0;
		const resetForm = () => {
			setLocality("");
			setPlz("");
			setPlzOptions([]);
			setError("");
			setPlzFromLocality(false);
			setLocalityFromPlz(false);
			setResetToken((t) => t + 1);
		};

	useEffect(() => {
    if (!debouncedLocality || localityFromPlz) return;

    const controller = new AbortController();
    setError("");

    fetch(
      `https://openplzapi.org/de/Localities?name=${encodeURIComponent(
        debouncedLocality
      )}`,
      { signal: controller.signal }
    )
      .then((res) => res.json() as Promise<unknown>)
      .then((json) => {
        const data = (Array.isArray(json) ? json : []) as OpenPlzResponse[];

        const uniquePlz = Array.from(
          new Set((data ?? []).map(getPostalCode).filter(Boolean))
        );

        if (uniquePlz.length === 1) {
          setPlz(uniquePlz[0]);
          setPlzFromLocality(true);
          setPlzOptions([]);
          setError("");
        } else if (uniquePlz.length > 1) {
          setPlzOptions(uniquePlz);
          setPlz(""); // force user to choose
          setPlzFromLocality(false);
          setError("");
        } else {
          setPlzOptions([]);
          setError("No postal codes found for this locality");
        }
      })
      .catch((err: any) => {
        if (err?.name !== "AbortError") setError("Failed to fetch locality data");
      });

    return () => controller.abort();
  }, [debouncedLocality, localityFromPlz, resetToken]);

  useEffect(() => {
    if (!debouncedPlz || plzFromLocality) return;

    if (!/^\d{5}$/.test(debouncedPlz)) {
      setError("");
      return;
    }

    const controller = new AbortController();
    setError("");

    fetch(
      `https://openplzapi.org/de/Localities?postalCode=${encodeURIComponent(
        debouncedPlz
      )}`,
      { signal: controller.signal }
    )
      .then((res) => res.json() as Promise<unknown>)
      .then((json) => {
        const data = (Array.isArray(json) ? json : []) as OpenPlzResponse[];

        if (data.length > 0) {
          setLocality(data[0].name);
          setLocalityFromPlz(true);
          setPlzOptions([]);
          setError("");
        } else {
          setError("Invalid postal code");
        }
      })
      .catch((err: any) => {
        if (err?.name !== "AbortError")
          setError("Failed to fetch postal code data");
      });

    return () => controller.abort();
  }, [debouncedPlz, plzFromLocality, resetToken]);

	return (
		<>
			<div>
				<a href="https://www.digitalproductschool.io/" target="_blank">
					<img src={dpsLogo} className="logo" alt="DPS logo" />
				</a>
			</div>
			<div className="home-card">
				<label>
					Locality
					<input
						type="text"
						value={locality}
						onChange={(e) => {
						setLocality(e.target.value);
						setLocalityFromPlz(false);
						setError("");
						}}
						placeholder="City / Town"
						required
					/>
					</label>

					<label>
					Postal Code (PLZ)
					{plzOptions.length > 0 ? (
						<select
						value={plz}
						onChange={(e) => {
							setPlz(e.target.value);
							setPlzFromLocality(true);
							setError("");
						}}
						required
						>
						<option value="">Select PLZ</option>
						{plzOptions.map((code) => (
							<option key={code} value={code}>
							{code}
							</option>
						))}
						</select>
					) : (
						<input
						type="text"
						value={plz}
						onChange={(e) => {
							setPlz(e.target.value);
							setPlzFromLocality(false);
							setError("");
						}}
						placeholder="Postal Code"
						required
						/>
					)}
					</label>

					{error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}

					<button
					type="button"
					onClick={resetForm}
					disabled={!canReset}
					style={{
						opacity: canReset ? 1 : 0.5,
						cursor: canReset ? "pointer" : "not-allowed",
						marginTop: 12,
					}}
					>
					Reset
					</button>
			</div>
		</>
	);
}

export default App;
