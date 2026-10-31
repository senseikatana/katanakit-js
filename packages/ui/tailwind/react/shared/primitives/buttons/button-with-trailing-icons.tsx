import { MailIcon } from "@heroicons/react/solid";

export default function ButtonWithTrailingIcons() {
	return (
		<>
			<button
				type="button"
				className="inline-flex items-center px-3 py-2 border border-transparent shadow-xs text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Button text
				<MailIcon className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
			</button>
			<button
				type="button"
				className="inline-flex items-center px-4 py-2 border border-transparent shadow-xs text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Button text
				<MailIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
			</button>
			<button
				type="button"
				className="inline-flex items-center px-4 py-2 border border-transparent shadow-xs text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Button text
				<MailIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
			</button>
			<button
				type="button"
				className="inline-flex items-center px-6 py-3 border border-transparent shadow-xs text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Button text
				<MailIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
			</button>
		</>
	);
}
