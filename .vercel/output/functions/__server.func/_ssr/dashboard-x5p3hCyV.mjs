import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { s as formatWhen, u as safeHref } from "./rules-yT9t9RWo.mjs";
import { r as cn, t as Button } from "./button-9i4QBsV6.mjs";
import { i as ChevronLeft, r as ChevronRight, s as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { d as reviewSubmission, l as listSubmissionsForMentor, n as Route$2, u as mentorStats } from "./router-CfOxOTc7.mjs";
import { t as Skeleton } from "./skeleton-CTjrzKa9.mjs";
import { r as RequireRole } from "./require-role-CSOHZVHd.mjs";
import { n as CardContent, o as DashboardFrame, s as StatusBadge, t as Card } from "./card-Twnm9CgI.mjs";
import { n as TabsList$1, r as TabsTrigger$1, t as Tabs$1 } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-x5p3hCyV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Table({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative w-full overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
			className: cn("w-full caption-bottom text-sm", className),
			...props
		})
	});
}
function TableHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
		className: cn("[&_tr]:border-b [&_tr]:border-border", className),
		...props
	});
}
function TableBody({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
		className: cn("[&_tr:last-child]:border-0", className),
		...props
	});
}
function TableRow({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
		className: cn("border-b border-border transition-colors hover:bg-muted/60", className),
		...props
	});
}
function TableHead({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: cn("h-11 px-3 text-left align-middle text-xs font-medium tracking-wide text-muted-foreground uppercase", className),
		...props
	});
}
function TableCell({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: cn("px-3 py-3 align-middle", className),
		...props
	});
}
function Tabs({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs$1, {
		className: cn("flex flex-col gap-4", className),
		...props
	});
}
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList$1, {
		className: cn("grid h-auto w-full grid-cols-2 gap-1 rounded-menu bg-muted p-1.5 sm:grid-cols-4", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger$1, {
		className: cn("inline-flex h-10 items-center justify-center rounded-control px-3 text-sm font-medium text-muted-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:bg-card data-[state=active]:text-foreground", className),
		...props
	});
}
var FILTERS = [
	{
		value: "ALL",
		label: "All"
	},
	{
		value: "PENDING",
		label: "Pending"
	},
	{
		value: "APPROVED",
		label: "Approved"
	},
	{
		value: "REJECTED",
		label: "Rejected"
	}
];
function LinkOut({ href, children }) {
	const safe = safeHref(href);
	if (!safe) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-muted-foreground",
		children: "—"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: safe,
		target: "_blank",
		rel: "noreferrer",
		className: "inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline",
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
			className: "size-3.5",
			"aria-hidden": "true"
		})]
	});
}
function MentorBoard({ status, page }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireRole, {
		role: "MENTOR",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MentorDashboard, {
			status,
			page
		})
	});
}
function MentorDashboard({ status, page }) {
	const navigate = useNavigate();
	const client = useQueryClient();
	const [rowError, setRowError] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(null);
	const stats = useQuery({
		queryKey: ["mentor-stats"],
		queryFn: () => mentorStats()
	});
	const list = useQuery({
		queryKey: [
			"mentor-submissions",
			status,
			page
		],
		queryFn: () => listSubmissionsForMentor({ data: {
			status,
			page
		} })
	});
	const review = useMutation({
		mutationFn: (input) => reviewSubmission({ data: input }),
		onSuccess: async (result) => {
			if (!result.ok) {
				setRowError(result.message);
				return;
			}
			setRowError(null);
			await Promise.all([client.invalidateQueries({ queryKey: ["mentor-submissions"] }), client.invalidateQueries({ queryKey: ["mentor-stats"] })]);
		},
		onError: () => setRowError("The review did not save. Try again."),
		onSettled: () => setPending(null)
	});
	function go(nextStatus, nextPage) {
		navigate({
			to: "/mentor/dashboard",
			search: {
				status: nextStatus,
				page: nextPage
			}
		});
	}
	function decide(id, next) {
		setPending({
			id,
			status: next
		});
		setRowError(null);
		review.mutate({
			id,
			status: next
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashboardFrame, {
		eyebrow: "Mentor",
		title: "Review queue",
		lede: "Every student submission lands here. Filter by status, then approve or reject. Counts stay in step with the table.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending",
						value: stats.data?.pending,
						loading: stats.isPending,
						active: status === "PENDING",
						onClick: () => go("PENDING", 1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Approved",
						value: stats.data?.approved,
						loading: stats.isPending,
						active: status === "APPROVED",
						onClick: () => go("APPROVED", 1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Rejected",
						value: stats.data?.rejected,
						loading: stats.isPending,
						active: status === "REJECTED",
						onClick: () => go("REJECTED", 1)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
					value: status,
					onValueChange: (value) => go(value, 1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, { children: FILTERS.map((filter) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: filter.value,
						children: filter.label
					}, filter.value)) })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-4 overflow-hidden",
				children: list.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12" })
					]
				}) : list.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: "Could not load submissions."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						className: "mt-3",
						onClick: () => void list.refetch(),
						children: "Try again"
					})]
				}) : list.data.rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "pt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: status === "ALL" ? "No projects have been filed yet." : `No ${status.toLowerCase()} submissions on this filter.`
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden md:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubmissionTable, {
						rows: list.data.rows,
						pending,
						onDecide: decide
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col divide-y divide-border md:hidden",
					children: list.data.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-col gap-3 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubmissionSummary, { row }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewActions, {
							row,
							pending,
							onDecide: decide
						})]
					}, row.id))
				})] })
			}),
			rowError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-destructive",
				children: rowError
			}) : null,
			list.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground tabular-nums",
					children: [
						"Page ",
						list.data.page,
						" of ",
						list.data.pageCount,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden sm:inline",
							children: [
								" · ",
								list.data.total,
								" total"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						disabled: list.data.page <= 1,
						onClick: () => go(status, list.data.page - 1),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
							className: "size-4",
							"aria-hidden": "true"
						}), "Previous"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						disabled: list.data.page >= list.data.pageCount,
						onClick: () => go(status, list.data.page + 1),
						children: ["Next", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
							className: "size-4",
							"aria-hidden": "true"
						})]
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-sm text-muted-foreground",
				children: [
					"Looking for your own filing desk? That view is only for student accounts.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "font-medium text-foreground underline-offset-4 hover:underline",
						children: "Back to Folio"
					})
				]
			})
		]
	});
}
function StatCard({ label, value, loading, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		"aria-pressed": active,
		className: "rounded-panel border p-4 text-left transition-colors " + (active ? "border-foreground bg-card" : "border-border bg-card hover:bg-muted"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: label
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-2 h-8 w-12" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-3xl tabular-nums",
			children: value ?? 0
		})]
	});
}
function SubmissionSummary({ row }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: row.projectName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: row.studentName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: row.studentEmail
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: row.status })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: row.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: formatWhen(row.createdAt)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkOut, {
					href: row.githubUrl,
					children: "Repo"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkOut, {
					href: row.demoUrl,
					children: "Live"
				})]
			})
		]
	});
}
function ReviewActions({ row, pending, onDecide }) {
	const busy = pending?.id === row.id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			size: "sm",
			disabled: busy || row.status === "APPROVED",
			onClick: () => onDecide(row.id, "APPROVED"),
			children: busy && pending?.status === "APPROVED" ? "Approving…" : "Approve"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			size: "sm",
			variant: "outline",
			disabled: busy || row.status === "REJECTED",
			onClick: () => onDecide(row.id, "REJECTED"),
			children: busy && pending?.status === "REJECTED" ? "Rejecting…" : "Reject"
		})]
	});
}
function SubmissionTable({ rows, pending, onDecide }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Project" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Links" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Submitted" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Actions" })
	] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-medium",
			children: row.studentName
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: row.studentEmail
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
			className: "max-w-64",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: row.projectName
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "line-clamp-2 text-muted-foreground",
				children: row.description
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkOut, {
				href: row.githubUrl,
				children: "Repo"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkOut, {
				href: row.demoUrl,
				children: "Live"
			})]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			className: "whitespace-nowrap",
			children: formatWhen(row.createdAt)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: row.status }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewActions, {
			row,
			pending,
			onDecide
		}) })
	] }, row.id)) })] });
}
function MentorPage() {
	const { status, page } = Route$2.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MentorBoard, {
		status,
		page
	});
}
//#endregion
export { MentorPage as component };
