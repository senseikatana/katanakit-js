export default function Simple() {
	return (
		<div>
			<label htmlFor="comment" className="block text-sm font-medium text-gray-700">
				Add your comment
			</label>
			<div className="mt-1">
				<textarea
					rows={4}
					name="comment"
					id="comment"
					className="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
					defaultValue={""}
				/>
			</div>
		</div>
	);
}
