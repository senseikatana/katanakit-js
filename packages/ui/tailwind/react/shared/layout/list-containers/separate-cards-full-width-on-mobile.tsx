const items = [
	{ id: 1 },
	// More items...
];

export default function SeparateCardsFullWidthOnMobile() {
	return (
		<ul role="list" className="space-y-3">
			{items.map((item) => (
				<li
					key={item.id}
					className="bg-white shadow-sm overflow-hidden px-4 py-4 sm:px-6 sm:rounded-md"
				>
					{/* Your content */}
				</li>
			))}
		</ul>
	);
}
