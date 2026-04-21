import type { Column, Mood, Task } from "../app/(post-login)/tasks/task/types";
import type { TaskCategory } from "../models/userProfile";
import { httpGet, httpPost, httpPut, type RequestConfig } from "./httpClient";

export type TaskRecord = {
	id: string;
	category: TaskCategory;
	title: string;
	description: string;
	status: Column["status"];
	checklist: Task[];
	startedAt?: string;
	updatedAt?: string;
	completedAt?: string;
	mood?: Mood;
	finalNotes?: string;
	recur?: boolean;
	keepsakeUrl?: string;
};

export type CreateTaskPayload = {
	category: TaskCategory;
	title: string;
	description: string;
	checklist?: Task[];
};

export type UpdateTaskPayload = Partial<Omit<TaskRecord, "id">>;

export type CompleteTaskPayload = {
	mood: Mood;
	finalNotes?: string;
	keepsakeUrl?: string;
	recur?: boolean;
	completedAt?: string;
};

export type TaskListQuery = {
	category?: TaskCategory;
	status?: Column["status"];
	limit?: number;
};

type TaskStoreConfig = Omit<RequestConfig, "query">;

type SelectedFetchOptions = {
	forceRefresh?: boolean;
};

let selectedTask: TaskRecord | null = null;
let selectedTaskId: string | null = null;
let selectedTaskNeedsRefresh = false;

const SHOULD_USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_DUMMY_DATA === "true";

const clone = <T,>(value: T): T => {
	if (typeof structuredClone === "function") {
		return structuredClone(value);
	}

	return JSON.parse(JSON.stringify(value)) as T;
};

let dummyTasks: TaskRecord[] = [
	{
		id: "dummy-dance-class",
		category: "fun",
		title: "Dance Class for Beginners",
		description: "Let's get those feet moving! This beginner-friendly dance class is perfect for anyone looking to have fun.",
		status: "waiting",
		checklist: [
			{ id: "dummy-dance-class-1", label: "Book an appointment", checked: true },
			{ id: "dummy-dance-class-2", label: "Arrange transportation", checked: true },
			{ id: "dummy-dance-class-3", label: "Take a keepsake photo", checked: false },
		],
		updatedAt: new Date().toISOString(),
	},
];

function setSelectedTaskState(task: TaskRecord) {
	selectedTask = task;
	selectedTaskId = task.id;
	selectedTaskNeedsRefresh = false;
}

function invalidateSelectedTaskIfMatches(taskId: string) {
	if (selectedTaskId === taskId) {
		selectedTaskNeedsRefresh = true;
	}
}

export const taskStore = {
	getSelectedTask() {
		return selectedTask;
	},

	setSelectedTask(task: TaskRecord) {
		setSelectedTaskState(task);
	},

	clearSelectedTask() {
		selectedTask = null;
		selectedTaskId = null;
		selectedTaskNeedsRefresh = false;
	},

	invalidateSelectedTask() {
		if (selectedTask) {
			selectedTaskNeedsRefresh = true;
		}
	},

	listTasks(query: TaskListQuery = {}, config: TaskStoreConfig = {}) {
		if (SHOULD_USE_DUMMY_DATA) {
			let tasks = [...dummyTasks, ...dummyTasks, ...dummyTasks, ...dummyTasks, ...dummyTasks];

			if (query.category) {
				tasks = tasks.filter((task) => task.category === query.category);
			}

			if (query.status) {
				tasks = tasks.filter((task) => task.status === query.status);
			}

			if (typeof query.limit === "number") {
				tasks = tasks.slice(0, query.limit);
			}

			return Promise.resolve(clone(tasks));
		}

		return httpGet<TaskRecord[]>("/api/tasks", { ...config, query });
	},

	async getTaskById(taskId: string, config: TaskStoreConfig = {}, options: SelectedFetchOptions = {}) {
		const { forceRefresh = false } = options;
		if (selectedTask && selectedTaskId === taskId && !selectedTaskNeedsRefresh && !forceRefresh) {
			return selectedTask;
		}

		if (SHOULD_USE_DUMMY_DATA) {
			const task = dummyTasks.find((entry) => entry.id === taskId);
			if (!task) {
				throw new Error(`Task ${taskId} not found`);
			}

			const copiedTask = clone(task);
			setSelectedTaskState(copiedTask);
			return copiedTask;
		}

		const task = await httpGet<TaskRecord>(`/api/tasks/${taskId}`, config);
		setSelectedTaskState(task);
		return task;
	},

	async createTask(payload: CreateTaskPayload, config: TaskStoreConfig = {}) {
		if (SHOULD_USE_DUMMY_DATA) {
			const createdTask: TaskRecord = {
				id: `dummy-task-${Date.now()}`,
				category: payload.category,
				title: payload.title,
				description: payload.description,
				status: "waiting",
				checklist: payload.checklist ?? [],
				updatedAt: new Date().toISOString(),
			};

			dummyTasks = [createdTask, ...dummyTasks];
			invalidateSelectedTaskIfMatches(createdTask.id);
			return clone(createdTask);
		}

		const task = await httpPost<TaskRecord, CreateTaskPayload>("/api/tasks", payload, config);
		invalidateSelectedTaskIfMatches(task.id);
		return task;
	},

	async updateTask(taskId: string, payload: UpdateTaskPayload, config: TaskStoreConfig = {}) {
		if (SHOULD_USE_DUMMY_DATA) {
			const existingTask = dummyTasks.find((task) => task.id === taskId);
			if (!existingTask) {
				throw new Error(`Task ${taskId} not found`);
			}

			const updatedTask: TaskRecord = {
				...existingTask,
				...payload,
				updatedAt: new Date().toISOString(),
			};

			dummyTasks = dummyTasks.map((task) => (task.id === taskId ? updatedTask : task));
			invalidateSelectedTaskIfMatches(taskId);
			return clone(updatedTask);
		}

		const task = await httpPut<TaskRecord, UpdateTaskPayload>(`/api/tasks/${taskId}`, payload, config);
		invalidateSelectedTaskIfMatches(taskId);
		return task;
	},

	async completeTask(taskId: string, payload: CompleteTaskPayload, config: TaskStoreConfig = {}) {
		if (SHOULD_USE_DUMMY_DATA) {
			const existingTask = dummyTasks.find((task) => task.id === taskId);
			if (!existingTask) {
				throw new Error(`Task ${taskId} not found`);
			}

			const completedTask: TaskRecord = {
				...existingTask,
				status: "complete",
				mood: payload.mood,
				finalNotes: payload.finalNotes,
				recur: payload.recur,
				keepsakeUrl: payload.keepsakeUrl,
				completedAt: payload.completedAt ?? new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			dummyTasks = dummyTasks.map((task) => (task.id === taskId ? completedTask : task));
			invalidateSelectedTaskIfMatches(taskId);
			return clone(completedTask);
		}

		const task = await httpPut<TaskRecord, CompleteTaskPayload>(
			`/api/tasks/${taskId}/complete`,
			payload,
			config
		);
		invalidateSelectedTaskIfMatches(taskId);
		return task;
	},
};
