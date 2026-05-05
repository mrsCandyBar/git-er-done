import type { Column, Mood, Task } from "../app/(post-login)/tasks/task/types";
import type { TaskCategory, TaskCategoryModel } from "../models/userProfile";
import { httpGet, httpPost, httpPut, type GenericRequestConfig } from "./httpClient";

export type TaskRecord = {
	_id: string;
	category: string;
	name: string;
	description: string;
	state: Column["state"];
	recurId?: string;
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
	category: string;
	name: string;
	description: string;
	checklist?: Task[];
};

export type UpdateTaskPayload = {
	category: string;
	name: string;
	description: string;
	state?: Column["state"];
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
	category?: string;
	recurringTasks?: boolean;
	recurId?: Column["recurId"];
	state?: Column["state"];
	limit?: number;
};

type TaskStoreConfig = Omit<GenericRequestConfig, "query">;
type SelectedFetchOptions = { forceRefresh?: boolean; };

let selectedTaskCategories: TaskCategoryModel[] | null = null;
let selectedTask: TaskRecord | null = null;
let selectedTaskId: string | null = null;
let selectedTaskNeedsRefresh = false;

function setSelectedTaskState(task: TaskRecord) {
	if (task) {
		selectedTask = task;
		selectedTaskId = task._id;
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

	getAllRecurringTasks(query: TaskListQuery = {}, config: TaskStoreConfig = {}) {
		return httpGet<TaskRecord[]>("/recurring-tasks/getAll", { ...config, query });
	},

	async getAllTaskCategories(query: TaskListQuery = {}, config: TaskStoreConfig = {}) {
		if (selectedTaskCategories) {
			return selectedTaskCategories;
		}
		let taskCategories:any = await httpGet<TaskCategoryModel[]>("/task-categories/getAll", { ...config, query });
		selectedTaskCategories = taskCategories || [];
		return selectedTaskCategories;
	},

	async getTaskById(taskId: string, config: TaskStoreConfig = {}, options: SelectedFetchOptions = {}) {
		const { forceRefresh = false } = options;
		if (selectedTask && selectedTaskId === taskId && !selectedTaskNeedsRefresh && !forceRefresh) {
			return selectedTask;
		}

		if (!taskId) { return null; }
		const task:any = await httpGet<TaskRecord>(`/tasks/get/${taskId}`, config);
		task && setSelectedTaskState(task);
		return task;
	},

	getRecurringTask(taskId: string, config: TaskStoreConfig = {}) {
		return httpGet<TaskRecord[]>(`/recurring-tasks/get/${taskId}`, config);
	},

	async createTask(payload: CreateTaskPayload, config: TaskStoreConfig = {}) {
		payload.category = selectedTaskCategories?.find((cat) => cat.name == payload.category)?._id || payload.category;
		console.log("Creating task with payload:", payload, selectedTaskCategories, selectedTaskCategories?.find((cat) => cat.name == payload.category)?._id);
		const task = await httpPost<TaskRecord, CreateTaskPayload>("/tasks/create", payload, config);
		return task;
	},

	async updateTask(taskId: string, payload: UpdateTaskPayload, config: TaskStoreConfig = {}) {
		payload.category = selectedTaskCategories?.find((cat) => cat.name == payload.category)?._id || payload.category;
		console.log("Updating task with payload:", payload, selectedTaskCategories, selectedTaskCategories?.find((cat) => cat.name == payload.category)?._id);
		if (!selectedTask || selectedTaskId !== taskId) {
			throw new Error("Can only update the currently selected task. Please call getTaskById first to select the task.");
		}
		
		const task = await httpPut<TaskRecord, UpdateTaskPayload>(`/tasks/update/${taskId}`, payload, config);
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

		const task = await httpPut<TaskRecord, CompleteTaskPayload>(`/tasks/complete/${taskId}`, payload, config);
		task && setSelectedTaskState(task);
		return task;
	},
};
