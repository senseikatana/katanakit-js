const items = [
	{ id: 1 },
	// More items...
];

export default function CardWithDividersFullWidthOnMobile() {
	return (
		<div className="bg-white shadow-sm overflow-hidden sm:rounded-md">
			<ul role="list" className="divide-y divide-gray-200">
				{items.map((item) => (
					<li key={item.id} className="px-4 py-4 sm:px-6">
						{/* Your content */}
					</li>
				))}
			</ul>
		</div>
	);
}
