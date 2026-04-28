import type { UserProfile, UserStatusType } from "../models/userProfile";
import { defaultUserProfile } from "../models/userProfile";
import { httpGet, httpPost, httpPut, type RequestConfig } from "./httpClient";

export type UserListQuery = {
	status?: UserStatusType;
	limit?: number;
	cursor?: string;
};

export type CreateUserPayload = Omit<UserProfile, "updatedDate" | "lastLoginDate">;

export type UpdateUserPayload = Partial<UserProfile>;

type UserStoreConfig = Omit<RequestConfig, "query">;

type SelectedFetchOptions = {
	forceRefresh?: boolean;
};

let selectedUser: UserProfile | null = null;
let selectedUserKey: string | null = null;
let selectedUserNeedsRefresh = false;

const SHOULD_USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_DUMMY_DATA === "true";

const clone = <T,>(value: T): T => {
	if (typeof structuredClone === "function") {
		return structuredClone(value);
	}

	return JSON.parse(JSON.stringify(value)) as T;
};

let dummyCurrentUser: UserProfile = clone(defaultUserProfile);
let dummyUsersById: Record<string, UserProfile> = {
	me: dummyCurrentUser,
	"dummy-user": dummyCurrentUser,
};

function setSelectedUserState(user: UserProfile, key: string) {
	selectedUser = user;
	selectedUserKey = key;
	selectedUserNeedsRefresh = false;
}

function invalidateSelectedUserIfMatches(key: string) {
	if (selectedUserKey === key) {
		selectedUserNeedsRefresh = true;
	}
}

export const userStore = {
	getSelectedUser() {
		return selectedUser;
	},

	setSelectedUser(user: UserProfile, key = "me") {
		setSelectedUserState(user, key);
	},

	clearSelectedUser() {
		selectedUser = null;
		selectedUserKey = null;
		selectedUserNeedsRefresh = false;
	},

	invalidateSelectedUser() {
		if (selectedUser) {
			selectedUserNeedsRefresh = true;
		}
	},

	async getCurrentProfile(config: UserStoreConfig = {}, options: SelectedFetchOptions = {}) {
		const { forceRefresh = false } = options;
		if (selectedUser && selectedUserKey === "me" && !selectedUserNeedsRefresh && !forceRefresh) {
			return selectedUser;
		}

		if (SHOULD_USE_DUMMY_DATA) {
			const user = clone(dummyCurrentUser);
			setSelectedUserState(user, "me");
			return user;
		}

		const user = await httpGet<UserProfile>("/api/users/me", config);
		setSelectedUserState(user, "me");
		return user;
	},

	async getUserById(userId: string, config: UserStoreConfig = {}, options: SelectedFetchOptions = {}) {
		const { forceRefresh = false } = options;
		if (selectedUser && selectedUserKey === userId && !selectedUserNeedsRefresh && !forceRefresh) {
			return selectedUser;
		}

		if (SHOULD_USE_DUMMY_DATA) {
			const user = clone(dummyUsersById[userId] ?? dummyCurrentUser);
			setSelectedUserState(user, userId);
			return user;
		}

		const user = await httpGet<UserProfile>(`/api/users/${userId}`, config);
		setSelectedUserState(user, userId);
		return user;
	},

	listUsers(query: UserListQuery = {}, config: UserStoreConfig = {}) {
		if (SHOULD_USE_DUMMY_DATA) {
			const users = Object.values(dummyUsersById);
			const filtered = query.status ? users.filter((user) => user.status === query.status) : users;
			const limited = typeof query.limit === "number" ? filtered.slice(0, query.limit) : filtered;
			return Promise.resolve(clone(limited));
		}

		return httpGet<UserProfile[]>("/api/users", { ...config, query });
	},

	async createUser(payload: CreateUserPayload, config: UserStoreConfig = {}) {
		if (SHOULD_USE_DUMMY_DATA) {
			const now = new Date().toISOString().slice(0, 10);
			const createdUser: UserProfile = {
				...payload,
				updatedDate: now,
				lastLoginDate: now,
			};

			dummyCurrentUser = clone(createdUser);
			dummyUsersById = {
				...dummyUsersById,
				me: clone(createdUser),
				"dummy-user": clone(createdUser),
			};

			invalidateSelectedUserIfMatches("me");
			return clone(createdUser);
		}

		const user = await httpPost<UserProfile, CreateUserPayload>("/api/users", payload, config);
		invalidateSelectedUserIfMatches("me");
		return user;
	},

	async updateUser(userId: string, payload: UpdateUserPayload, config: UserStoreConfig = {}) {
		if (SHOULD_USE_DUMMY_DATA) {
			const existing = dummyUsersById[userId] ?? dummyCurrentUser;
			const updatedUser = {
				...existing,
				...payload,
			};

			dummyUsersById = {
				...dummyUsersById,
				[userId]: clone(updatedUser),
			};

			if (userId === "me" || userId === "dummy-user") {
				dummyCurrentUser = clone(updatedUser);
			}

			invalidateSelectedUserIfMatches(userId);
			invalidateSelectedUserIfMatches("me");
			return clone(updatedUser);
		}

		const user = await httpPut<UserProfile, UpdateUserPayload>(`/api/users/${userId}`, payload, config);
		invalidateSelectedUserIfMatches(userId);
		invalidateSelectedUserIfMatches("me");
		return user;
	},

	async updateCurrentProfile(payload: UpdateUserPayload, config: UserStoreConfig = {}) {
		if (SHOULD_USE_DUMMY_DATA) {
			dummyCurrentUser = {
				...dummyCurrentUser,
				...payload,
			};

			dummyUsersById = {
				...dummyUsersById,
				me: clone(dummyCurrentUser),
				"dummy-user": clone(dummyCurrentUser),
			};

			invalidateSelectedUserIfMatches("me");
			return clone(dummyCurrentUser);
		}

		const user = await httpPut<UserProfile, UpdateUserPayload>("/api/users/me", payload, config);
		invalidateSelectedUserIfMatches("me");
		return user;
	},

	async loginWithGoogle(credential: string, config: UserStoreConfig = {}) {
		if (SHOULD_USE_DUMMY_DATA) {
			invalidateSelectedUserIfMatches("me");
			return clone(dummyCurrentUser);
		}

		const user = await httpPost<UserProfile, { credential: string }>(
			"/api/users/login/google",
			{ credential },
			config
		);
		invalidateSelectedUserIfMatches("me");
		return user;
	},
};
