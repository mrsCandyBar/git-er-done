import type { Column, Mood, Task } from "../app/(post-login)/tasks/task/types";
import type { TaskCategory } from "../models/userProfile";
import { httpGet, httpPost, httpPut, type RequestConfig } from "./httpClient";

export type TaskRecord = {
	id: string;
	category: TaskCategory;
	name: string;
	description: string;
	status: Column["status"];
	checklist?: Task[];
	createdDate?: string;
	startedDate?: string;
	updatedDate?: string;
	completed?: {
		completedDate?: string;
		mood?: Mood;
		finalNotes?: string;
		recur?: boolean;
		keepsakeUrl?: string;
	}
};

export type CreateTaskPayload = {
	category: TaskCategory;
	name: string;
	description: string;
	checklist?: Task[];
};

export type UpdateTaskPayload = {
	category: TaskCategory;
	name: string;
	description: string;
	status?: Column["status"];
	checklist?: Task[];
};

export type CompleteTaskPayload = {
	mood: Mood;
	finalNotes?: string;
	keepsakeUrl?: string;
	recur?: boolean;
	completedDate?: string;
};

export type TaskListQuery = {
	category?: TaskCategory;
	status?: Column["status"];
	limit?: number;
};

type TaskStoreConfig = Omit<RequestConfig, "query">;
type SelectedFetchOptions = { forceRefresh?: boolean; };

let selectedTask: TaskRecord | null = null;
let selectedTaskId: string | null = null;
let selectedTaskNeedsRefresh = false;

const SHOULD_USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_DUMMY_DATA === "true";

let dummyTasks: TaskRecord[] = [
	{
		id: "dummy-dance-class",
		category: "fun",
		name: "Dance Class for Beginners",
		description: "Let's get those feet moving! This beginner-friendly dance class is perfect for anyone looking to have fun.",
		status: "waiting",
		checklist: [
			{ id: "dummy-dance-class-1", label: "Book an appointment", checked: true },
			{ id: "dummy-dance-class-2", label: "Arrange transportation", checked: true },
			{ id: "dummy-dance-class-3", label: "Take a keepsake photo", checked: false },
		],
		updatedDate: new Date().toISOString(),
	},
];

function setSelectedTaskState(task: TaskRecord) {
	selectedTask = task;
	selectedTaskId = task.id;
	selectedTaskNeedsRefresh = false;
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

	getAllTasks(query: TaskListQuery = {}, config: TaskStoreConfig = {}) {
		if (SHOULD_USE_DUMMY_DATA) {
			let tasks = dummyTasks;
			if (query.category) { tasks = tasks.filter((task) => task.category === query.category); }
			if (query.status) { tasks = tasks.filter((task) => task.status === query.status); }
			if (typeof query.limit === "number") { tasks = tasks.slice(0, query.limit); }
			return Promise.resolve(tasks);
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
			if (!task) { throw new Error(`Task ${taskId} not found`); }

			setSelectedTaskState(task);
			return task;
		}

		const task = await httpGet<TaskRecord>(`/api/tasks/${taskId}`, config);
		setSelectedTaskState(task);
		return task;
	},

	async createTask(payload: CreateTaskPayload, config: TaskStoreConfig = {}) {
		if (SHOULD_USE_DUMMY_DATA) {
			const createdTask: TaskRecord = {
				id: `dummy-task-${Date.now()}`,
				...payload,
				status: "waiting",
				createdDate: new Date().toISOString(),
			};

			dummyTasks = [createdTask, ...dummyTasks];
			return createdTask;
		}

		const task = await httpPost<TaskRecord, CreateTaskPayload>("/api/tasks", payload, config);
		return task;
	},

	async updateTask(taskId: string, payload: UpdateTaskPayload, config: TaskStoreConfig = {}) {
		if (!selectedTask || selectedTaskId !== taskId) {
			throw new Error("Can only update the currently selected task. Please call getTaskById first to select the task.");
		}
		else {
			if (SHOULD_USE_DUMMY_DATA) {
				this.setSelectedTask({
					...selectedTask,
					...payload,
					updatedDate: new Date().toISOString(),
				});
				return this.getSelectedTask();
			}

			const task = await httpPut<TaskRecord, UpdateTaskPayload>(`/api/tasks/${taskId}`, payload, config);
			this.setSelectedTask(task);
			return task;
		}
	},

	async startTask(taskId: string, config: TaskStoreConfig = {}) {
		if (!selectedTask || selectedTaskId !== taskId) {
			throw new Error("Can only start a currently selected task");
		}
		else {
			if (SHOULD_USE_DUMMY_DATA) {
				this.setSelectedTask({
					...selectedTask,
					status: "busy",
					updatedDate: new Date().toISOString(),
				});
				return this.getSelectedTask();
			}

			const task = await httpPut<TaskRecord, {}>(`/api/tasks/start/${taskId}`, {}, config);
			this.setSelectedTask(task);
			return task;
		}
	},

	async pauseTask(taskId: string, config: TaskStoreConfig = {}) {
		if (!selectedTask || selectedTaskId !== taskId) {
			throw new Error("Can only pause a currently selected task");
		}
		else {
			if (SHOULD_USE_DUMMY_DATA) {
				this.setSelectedTask({
					...selectedTask,
					status: "waiting",
					updatedDate: new Date().toISOString(),
				});
				return this.getSelectedTask();
			}

			const task = await httpPut<TaskRecord, {}>(`/api/tasks/pause/${taskId}`, {}, config);
			this.setSelectedTask(task);
			return task;
		}
	},

	async completeTask(taskId: string, payload: CompleteTaskPayload, config: TaskStoreConfig = {}) {
		if (!selectedTask || selectedTaskId !== taskId) {
			throw new Error(`Task ${taskId} not found`);
		}

		if (SHOULD_USE_DUMMY_DATA) {
			this.setSelectedTask({
				...selectedTask,
				status: "complete",
				completed: {
					mood: payload.mood,
					finalNotes: payload.finalNotes,
					recur: payload.recur,
					keepsakeUrl: payload.keepsakeUrl,
					completedDate: payload.completedDate ?? new Date().toISOString(),
				},
				updatedDate: new Date().toISOString(),
			});
			return this.getSelectedTask();
		}

		const task = await httpPut<TaskRecord, CompleteTaskPayload>(`/api/tasks/${taskId}/complete`, payload, config);
		this.setSelectedTask(task);
		return task;
	},
};
