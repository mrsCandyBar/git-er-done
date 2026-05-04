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

function setSelectedTaskState(task: TaskRecord) {
	if (task) {
		selectedTask = task;
		selectedTaskId = task.id;
		selectedTaskNeedsRefresh = false;
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

	getAllTasks(query: TaskListQuery = {}, config: TaskStoreConfig = {}) {
		return httpGet<TaskRecord[]>("/tasks/getAll", { ...config, query });
	},

	async getTaskById(taskId: string, config: TaskStoreConfig = {}, options: SelectedFetchOptions = {}) {
		const { forceRefresh = false } = options;
		if (selectedTask && selectedTaskId === taskId && !selectedTaskNeedsRefresh && !forceRefresh) {
			return selectedTask;
		}

		const task = await httpGet<TaskRecord>(`/tasks/${taskId}`, config);
		task && setSelectedTaskState(task);
		return task;
	},

	async createTask(payload: CreateTaskPayload, config: TaskStoreConfig = {}) {
		const task = await httpPost<TaskRecord, CreateTaskPayload>("/tasks", payload, config);
		return task;
	},

	async updateTask(taskId: string, payload: UpdateTaskPayload, config: TaskStoreConfig = {}) {
		if (!selectedTask || selectedTaskId !== taskId) {
			throw new Error("Can only update the currently selected task. Please call getTaskById first to select the task.");
		}
		
		const task = await httpPut<TaskRecord, UpdateTaskPayload>(`/tasks/${taskId}`, payload, config);
		task && setSelectedTaskState(task);
		return task;
	},

	async startTask(taskId: string, config: TaskStoreConfig = {}) {
		if (!selectedTask || selectedTaskId !== taskId) {
			throw new Error("Can only start a currently selected task");
		}
		
		const task = await httpPut<TaskRecord, {}>(`/tasks/start/${taskId}`, {}, config);
		task && setSelectedTaskState(task);
		return task;
	},

	async pauseTask(taskId: string, config: TaskStoreConfig = {}) {
		if (!selectedTask || selectedTaskId !== taskId) {
			throw new Error("Can only pause a currently selected task");
		}
		
		const task = await httpPut<TaskRecord, {}>(`/tasks/pause/${taskId}`, {}, config);
		task && setSelectedTaskState(task);
		return task;
	},

	async completeTask(taskId: string, payload: CompleteTaskPayload, config: TaskStoreConfig = {}) {
		if (!selectedTask || selectedTaskId !== taskId) {
			throw new Error(`Task ${taskId} not found`);
		}

		const task = await httpPut<TaskRecord, CompleteTaskPayload>(`/tasks/${taskId}/complete`, payload, config);
		task && setSelectedTaskState(task);
		return task;
	},
};
