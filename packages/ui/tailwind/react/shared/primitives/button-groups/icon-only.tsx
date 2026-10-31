import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

export default function IconOnly() {
	return (
		<span className="relative z-0 inline-flex shadow-xs rounded-md">
			<button
				type="button"
				className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
			>
				<span className="sr-only">Previous</span>
				<ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
			</button>
			<button
				type="button"
				className="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
			>
				<span className="sr-only">Next</span>
				<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
			</button>
		</span>
	);
}
