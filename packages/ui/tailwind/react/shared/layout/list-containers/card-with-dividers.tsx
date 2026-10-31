const items = [
	{ id: 1 },
	// More items...
];

export default function CardWithDividers() {
	return (
		<div className="bg-white shadow-sm overflow-hidden rounded-md">
			<ul role="list" className="divide-y divide-gray-200">
				{items.map((item) => (
					<li key={item.id} className="px-6 py-4">
						{/* Your content */}
					</li>
				))}
			</ul>
		</div>
	);
}
