export default function InputWithHiddenLabel() {
	return (
		<div>
			<label htmlFor="email" className="sr-only">
				Email
			</label>
			<input
				type="email"
				name="email"
				id="email"
				className="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
				placeholder="you@example.com"
			/>
		</div>
	);
}
