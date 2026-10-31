export default function SimpleNative() {
	return (
		<div>
			<label htmlFor="location" className="block text-sm font-medium text-gray-700">
				Location
			</label>
			<select
				id="location"
				name="location"
				className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
				defaultValue="Canada"
			>
				<option>United States</option>
				<option>Canada</option>
				<option>Mexico</option>
			</select>
		</div>
	);
}
