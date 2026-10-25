/**
 * Katana Admin — dashboard example.
 *
 * Every interactive piece below comes from `@katanakit/ui`, the same
 * factories documented in the UI kit pages. The file is plain ESM with no
 * bundler and no framework runtime; it imports the built package directly.
 */
import {
	modal,
	toast,
	useAlert,
	useBadge,
	useButton,
	useCard,
	useInput,
	useSelect,
	useTabs,
} from "../../packages/ui/dist/index.js";

/* -------------------------------------------------------------------------- */
/* DOM helpers                                                                */
/* -------------------------------------------------------------------------- */

const el = (tag, className, text) => {
	const node = document.createElement(tag);
	if (className) node.className = className;
	if (text !== undefined) node.textContent = text;
	return node;
};

const mount = (id, ...nodes) => {
	const host = document.getElementById(id);
	if (!host) throw new Error(`[dashboard] missing mount point #${id}`);
	host.replaceChildren(...nodes);
};

const panel = (className, ...nodes) => {
	const node = el("div", className);
	node.append(...nodes);
	return node;
};

const row = (...nodes) => panel("row", ...nodes);

/* -------------------------------------------------------------------------- */
/* Overview                                                                   */
/* -------------------------------------------------------------------------- */

const stats = [
	{ label: "Revenue", value: "$48,290", delta: "+12.4%", variant: "success" },
	{ label: "Orders", value: "1,284", delta: "+3.1%", variant: "info" },
	{ label: "Customers", value: "8,731", delta: "+0.8%", variant: "warning" },
	{ label: "Refunds", value: "$1,120", delta: "-2.4%", variant: "danger" },
];

mount(
	"stats",
	...stats.map((stat) =>
		useCard({
			elevated: true,
			children: [
				el("p", "stat-label", stat.label),
				el("p", "stat-value", stat.value),
				useBadge({ label: stat.delta, variant: stat.variant }),
			],
		}),
	),
);

mount(
	"overview-alert",
	useAlert({
		variant: "info",
		title: "Demo data",
		message:
			"Figures are mocked. Only components, tokens and utilities come from katanakit-js.",
		dismissible: true,
		onDismiss: () => toast.success("Alert dismissed."),
	}),
);

const revenuePanel = () => {
	const heights = [42, 58, 36, 64, 52, 71, 48, 66, 57, 78, 62, 84];
	const bars = el("div", "bars");
	for (const height of heights) {
		const bar = el("div", "bar");
		bar.style.height = `${height}%`;
		bars.append(bar);
	}

	const labels = el("div", "bar-labels");
	for (const month of ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]) {
		labels.append(el("span", null, month));
	}

	return panel(
		"stack",
		el("p", "text-sm text-neutral-500", "Indexed to the best month of the year."),
		bars,
		labels,
	);
};

const customersPanel = () => {
	const customers = [
		["Ada Lovelace", "$12,480"],
		["Grace Hopper", "$9,150"],
		["Alan Turing", "$7,320"],
		["Margaret Hamilton", "$6,010"],
	];

	const list = el("div", "stack");
	for (const [name, total] of customers) {
		list.append(
			panel(
				"row row--between",
				el("span", null, name),
				el("span", "text-sm text-neutral-500", total),
			),
		);
	}
	return list;
};

const activityPanel = () => {
	const events = [
		["2026-10-24", "Order ORD-1042 paid by Ada Lovelace."],
		["2026-10-24", "Refund issued for ORD-1031."],
		["2026-10-23", "New customer registered: Grace Hopper."],
		["2026-10-23", "Weekly revenue report emailed."],
	];

	const list = el("div", "stack");
	for (const [date, text] of events) {
		list.append(
			panel(
				"row row--between",
				el("span", null, text),
				el("span", "text-sm text-neutral-500", date),
			),
		);
	}
	return list;
};

const overviewTabs = useTabs({
	label: "Overview panels",
	tabs: [
		{ id: "revenue", label: "Revenue", content: revenuePanel() },
		{ id: "customers", label: "Customers", content: customersPanel() },
		{ id: "activity", label: "Activity", content: activityPanel() },
	],
});
mount("overview-tabs", overviewTabs.root);

/* -------------------------------------------------------------------------- */
/* Buttons / badges / alerts                                                 */
/* -------------------------------------------------------------------------- */

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

mount(
	"buttons-variants",
	...["primary", "secondary", "ghost", "danger"].map((variant) =>
		useButton({
			label: capitalize(variant),
			variant,
			onClick: () => toast.info(`${capitalize(variant)} button clicked.`),
		}),
	),
);

mount(
	"buttons-sizes",
	...[
		["sm", "Small"],
		["md", "Medium"],
		["lg", "Large"],
	].map(([size, label]) => useButton({ label, size, variant: "secondary" })),
);

mount(
	"buttons-states",
	useButton({ label: "Saving…", loading: true }),
	useButton({ label: "Disabled", disabled: true }),
);

mount(
	"badges-demo",
	...["neutral", "info", "success", "warning", "danger"].map((variant) =>
		useBadge({ label: capitalize(variant), variant }),
	),
);

mount(
	"alerts-demo",
	useAlert({
		variant: "info",
		title: "Scheduled maintenance",
		message: "The API stays read-only on Sunday from 02:00 to 04:00 UTC.",
	}),
	useAlert({
		variant: "success",
		title: "Export ready",
		message: "The October report is available for download.",
	}),
	useAlert({
		variant: "warning",
		title: "Rate limit at 80%",
		message: "You have used 8,000 of the 10,000 monthly requests.",
	}),
	useAlert({
		variant: "danger",
		title: "Payment failed",
		message: "Update the card on file to avoid suspension.",
		dismissible: true,
		onDismiss: () => toast.success("Alert dismissed."),
	}),
);

/* -------------------------------------------------------------------------- */
/* Forms                                                                      */
/* -------------------------------------------------------------------------- */

const customerInput = useInput({
	label: "Customer name",
	name: "customer",
	placeholder: "Ada Lovelace",
	required: true,
	help: "Shown on the invoice.",
});

const emailInput = useInput({
	label: "Email",
	name: "email",
	type: "email",
	placeholder: "ada@example.com",
});

const promoInput = useInput({
	label: "Promo code",
	name: "promo",
	value: "SPRING24",
	error: "This code expired on 2026-06-01.",
});

const accountInput = useInput({
	label: "Account",
	name: "account",
	value: "acct_1024",
	disabled: true,
});

const statusSelect = useSelect({
	label: "Status",
	name: "status",
	options: [
		{ value: "open", label: "Open" },
		{ value: "paid", label: "Paid" },
		{ value: "refunded", label: "Refunded" },
		{ value: "failed", label: "Failed" },
	],
	value: "open",
	onChange: (value) => toast.info(`Status set to ${value}.`),
});

mount(
	"form-fields",
	customerInput.root,
	emailInput.root,
	promoInput.root,
	accountInput.root,
	statusSelect.root,
);

document.getElementById("order-form").addEventListener("submit", (event) => {
	event.preventDefault();
	const name = customerInput.input.value.trim();
	if (!name) {
		customerInput.input.focus();
		toast.error("Customer name is required.");
		return;
	}
	toast.success(`Order created for ${name}.`);
});

/* -------------------------------------------------------------------------- */
/* Tabs                                                                       */
/* -------------------------------------------------------------------------- */

const tabs = useTabs({
	label: "Account settings",
	tabs: [
		{
			id: "profile",
			label: "Profile",
			content: panel(
				"stack",
				el("p", null, "Ada Lovelace · ada@example.com"),
				el("p", "text-sm text-neutral-500", "Tabs use roving tabindex: Tab enters once, arrows move."),
			),
		},
		{
			id: "billing",
			label: "Billing",
			content: panel(
				"stack",
				el("p", null, "Scale plan · $79 billed annually"),
				el("p", "text-sm text-neutral-500", "Panels are keyboard reachable even when empty."),
			),
		},
		{
			id: "notifications",
			label: "Notifications",
			content: "Enable order and refund emails.",
		},
		{ id: "danger", label: "Danger zone", disabled: true },
	],
});
mount("tabs-demo", tabs.root);

/* -------------------------------------------------------------------------- */
/* Cards                                                                      */
/* -------------------------------------------------------------------------- */

mount(
	"cards-demo",
	useCard({
		title: "Starter",
		children: [
			el("p", "stat-value", "$19"),
			el("p", "text-sm text-neutral-500", "1 project · community support · 10k requests."),
		],
		footer: "Billed monthly",
	}),
	useCard({
		title: "Scale",
		elevated: true,
		children: [
			el("p", "stat-value", "$79"),
			el("p", "text-sm text-neutral-500", "10 projects · priority support · 1M requests."),
		],
		footer: "Most popular · billed annually",
	}),
);

/* -------------------------------------------------------------------------- */
/* Modal                                                                      */
/* -------------------------------------------------------------------------- */

const confirmFooter = (label, onConfirm) => {
	const footer = el("div", "row");
	footer.append(
		useButton({ label: "Cancel", variant: "ghost", onClick: () => modal.close() }),
		useButton({
			label,
			variant: "danger",
			onClick: () => {
				modal.close();
				onConfirm();
			},
		}),
	);
	return footer;
};

const openFormDialog = () => {
	const name = useInput({ label: "Workspace name", name: "workspace-name", value: "Katana" });
	const content = el("div", "form-grid");
	content.append(name.root);

	const footer = el("div", "row");
	footer.append(
		useButton({ label: "Cancel", variant: "ghost", onClick: () => modal.close() }),
		useButton({
			label: "Rename",
			onClick: () => {
				modal.close();
				toast.success(`Workspace renamed to ${name.input.value.trim() || "Katana"}.`);
			},
		}),
	);

	modal.open({ title: "Rename workspace", content, footer });
};

mount(
	"modal-demo",
	useButton({
		label: "Open dialog",
		variant: "primary",
		onClick: () =>
			modal.open({
				title: "Delete project?",
				message: "This cannot be undone.",
				footer: confirmFooter("Delete", () => toast.success("Project deleted (demo).")),
			}),
	}),
	useButton({
		label: "Open small dialog",
		variant: "secondary",
		size: "sm",
		onClick: () =>
			modal.open({
				title: "Nothing to see",
				message: "A small dialog with no footer.",
				size: "sm",
			}),
	}),
	useButton({
		label: "Open form dialog",
		variant: "secondary",
		onClick: openFormDialog,
	}),
);

/* -------------------------------------------------------------------------- */
/* Toasts                                                                     */
/* -------------------------------------------------------------------------- */

mount(
	"toasts-demo",
	...[
		["info", "Info"],
		["success", "Success"],
		["warning", "Warning"],
		["error", "Error"],
	].map(([type, label]) =>
		useButton({
			label,
			variant: "secondary",
			onClick: () => toast[type](`${label} toast queued from the example.`),
		}),
	),
	useButton({
		label: "Loading → success",
		variant: "primary",
		onClick: () => {
			const handle = toast.loading("Syncing orders…");
			setTimeout(() => {
				handle.update({
					type: "success",
					title: "Sync complete",
					message: "128 orders refreshed.",
				});
			}, 1400);
		},
	}),
);

/* -------------------------------------------------------------------------- */
/* Orders table                                                               */
/* -------------------------------------------------------------------------- */

const orders = [
	{ id: "ORD-1042", customer: "Ada Lovelace", date: "2026-10-24", total: "$129.00", status: "paid" },
	{ id: "ORD-1041", customer: "Grace Hopper", date: "2026-10-24", total: "$74.50", status: "pending" },
	{ id: "ORD-1040", customer: "Alan Turing", date: "2026-10-23", total: "$240.00", status: "paid" },
	{ id: "ORD-1039", customer: "Margaret Hamilton", date: "2026-10-23", total: "$58.20", status: "refunded" },
	{ id: "ORD-1038", customer: "Katherine Johnson", date: "2026-10-22", total: "$312.00", status: "failed" },
	{ id: "ORD-1037", customer: "Linus Torvalds", date: "2026-10-22", total: "$96.00", status: "paid" },
	{ id: "ORD-1036", customer: "Barbara Liskov", date: "2026-10-21", total: "$44.90", status: "pending" },
];

const statusMeta = {
	paid: ["success", "Paid"],
	pending: ["warning", "Pending"],
	refunded: ["info", "Refunded"],
	failed: ["danger", "Failed"],
};

const ordersCount = document.getElementById("orders-count");
const ordersBody = document.getElementById("orders-body");

const renderOrders = (query = "") => {
	const needle = query.trim().toLowerCase();
	const visible = orders.filter(
		(order) =>
			!needle ||
			order.id.toLowerCase().includes(needle) ||
			order.customer.toLowerCase().includes(needle),
	);

	ordersBody.replaceChildren();

	if (visible.length === 0) {
		const emptyRow = el("tr");
		const cell = el("td", "cell-empty", `No orders match “${query.trim()}”.`);
		cell.colSpan = 6;
		emptyRow.append(cell);
		ordersBody.append(emptyRow);
	} else {
		for (const order of visible) {
			const [variant, label] = statusMeta[order.status];
			const rowEl = el("tr");

			rowEl.append(el("td", "font-medium", order.id));
			rowEl.append(el("td", null, order.customer));
			rowEl.append(el("td", "text-neutral-500", order.date));
			rowEl.append(el("td", "text-right", order.total));

			const statusCell = el("td");
			statusCell.append(useBadge({ label, variant }));
			rowEl.append(statusCell);

			const actionCell = el("td", "text-right");
			actionCell.append(
				useButton({
					label: "View",
					size: "sm",
					variant: "ghost",
					onClick: () =>
						modal.open({
							title: `Order ${order.id}`,
							message: `${order.customer} · ${order.date} · ${order.total}`,
							size: "sm",
						}),
				}),
			);
			rowEl.append(actionCell);

			ordersBody.append(rowEl);
		}
	}

	ordersCount.textContent = `${visible.length} order${visible.length === 1 ? "" : "s"}`;
};

const ordersSearch = useInput({
	type: "search",
	placeholder: "Filter by order or customer…",
	onInput: (value) => renderOrders(value),
});
ordersSearch.input.setAttribute("aria-label", "Filter orders");
mount("orders-search", ordersSearch.root);
renderOrders();

/* -------------------------------------------------------------------------- */
/* Settings: theme, toasts, danger zone                                       */
/* -------------------------------------------------------------------------- */

const themeButton = document.getElementById("theme-toggle");
const themeButton2 = document.getElementById("theme-toggle-2");

const setTheme = (dark) => {
	document.documentElement.dataset.theme = dark ? "dark" : "";
	for (const button of [themeButton, themeButton2]) {
		button.textContent = dark ? "Light mode" : "Dark mode";
		button.setAttribute("aria-pressed", String(dark));
	}
};

const toggleTheme = () => {
	const dark = document.documentElement.dataset.theme !== "dark";
	setTheme(dark);
	toast.info(`${dark ? "Dark" : "Light"} mode on — same tokens, inverted palette.`);
};

try {
	setTheme(localStorage.getItem("katana-example-theme") === "dark");
} catch {
	setTheme(false);
}

themeButton.addEventListener("click", () => {
	toggleTheme();
	try {
		localStorage.setItem(
			"katana-example-theme",
			document.documentElement.dataset.theme === "dark" ? "dark" : "light",
		);
	} catch {
		// Storage can be unavailable; the toggle still works for this session.
	}
});

themeButton2.addEventListener("click", toggleTheme);

document.getElementById("clear-toasts").addEventListener("click", () => {
	toast.clear();
	toast.info("Toast stack cleared.");
});

document.getElementById("danger-action").addEventListener("click", () => {
	modal.open({
		title: "Delete workspace?",
		message: "Every project, order and API key is removed. This cannot be undone.",
		size: "sm",
		footer: confirmFooter("Delete workspace", () =>
			toast.success("Workspace deleted — demo only, nothing was removed."),
		),
	});
});

document.getElementById("new-order").addEventListener("click", () => {
	const name = useInput({
		label: "Customer name",
		name: "new-customer",
		placeholder: "Ada Lovelace",
		required: true,
	});
	const email = useInput({
		label: "Email",
		name: "new-email",
		type: "email",
		placeholder: "ada@example.com",
	});
	const amount = useInput({ label: "Amount (USD)", name: "new-amount", value: "0.00" });

	const content = el("div", "form-grid");
	content.append(name.root, email.root, amount.root);

	const footer = el("div", "row");
	footer.append(
		useButton({ label: "Cancel", variant: "ghost", onClick: () => modal.close() }),
		useButton({
			label: "Create order",
			onClick: () => {
				const customer = name.input.value.trim();
				if (!customer) {
					name.input.focus();
					toast.error("Customer name is required.");
					return;
				}
				modal.close();
				toast.success(`Order created for ${customer}.`);
			},
		}),
	);

	modal.open({ title: "New order", content, footer });
});

/* -------------------------------------------------------------------------- */
/* Scrollspy                                                                  */
/* -------------------------------------------------------------------------- */

const navLinks = [...document.querySelectorAll(".nav__link")];
const linkBySection = new Map(
	navLinks.map((link) => [link.getAttribute("href").slice(1), link]),
);

const setActive = (id) => {
	for (const link of navLinks) link.classList.toggle("is-active", link === linkBySection.get(id));
};

setActive("overview");

const observer = new IntersectionObserver(
	(entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) setActive(entry.target.id);
		}
	},
	{ rootMargin: "-30% 0px -60% 0px" },
);

for (const section of document.querySelectorAll("main .section")) {
	observer.observe(section);
}
