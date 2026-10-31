const items = [
	{ id: 1 },
	// More items...
];

export default function SeparateCards() {
	return (
		<ul role="list" className="space-y-3">
			{items.map((item) => (
				<li key={item.id} className="bg-white shadow-sm overflow-hidden rounded-md px-6 py-4">
					{/* Your content */}
				</li>
			))}
		</ul>
	);
}
