export default function InputWithLabelAndHelpText() {
	return (
		<div>
			<label htmlFor="email" className="block text-sm font-medium text-gray-700">
				Email
			</label>
			<div className="mt-1">
				<input
					type="email"
					name="email"
					id="email"
					className="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
					placeholder="you@example.com"
					aria-describedby="email-description"
				/>
			</div>
			<p className="mt-2 text-sm text-gray-500" id="email-description">
				We'll only use this for spam.
			</p>
		</div>
	);
}
