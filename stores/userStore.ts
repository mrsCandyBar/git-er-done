import type { UserProfile } from "../models/userProfile";
import { defaultUserProfile } from "../models/userProfile";
import { httpGet, httpPost, httpPut, type RequestConfig } from "./httpClient";

export type CreateUserPayload = Omit<UserProfile, "updatedDate" | "lastLoginDate">;
export type UpdateUserPayload = Partial<UserProfile>;
type UserStoreConfig = Omit<RequestConfig, "query">;
type SelectedFetchOptions = { forceRefresh?: boolean; };

let selectedUser: UserProfile | null = null;
let selectedUserKey: string | null = null;
let selectedUserNeedsRefresh = false;

const SHOULD_USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_DUMMY_DATA === "true";
let dummyCurrentUser: UserProfile = { ...defaultUserProfile };

function setSelectedUserState(user: UserProfile, key: string) {
	selectedUser = user;
	selectedUserKey = key;
	selectedUserNeedsRefresh = false;
}

export const userStore = {

	// General upkeep of selected user state, 
	// which is used to cache the currently viewed user profile 
	// (either "me" or another user by id) and avoid unnecessary refetches. 
	// The store provides methods to get/set/clear the selected user, 
	// as well as invalidate it when updates occur.

	getSelectedUser() { return selectedUser; },

	setSelectedUser(user: UserProfile, key = "me") { setSelectedUserState(user, key);},

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
			const user = dummyCurrentUser;
			setSelectedUserState(user, "me");
			return user;
		}

		const user = await httpGet<UserProfile>("/api/users/me", config);
		setSelectedUserState(user, "me");
		return user;
	},


	// login/logout methods for demonstration purposes - 
	// in a real app these would likely involve more complex auth flows and token management

	async loginWithGoogle(credential: string, config: UserStoreConfig = {}) {
		if (SHOULD_USE_DUMMY_DATA) {
			setSelectedUserState(dummyCurrentUser, "me");
			return dummyCurrentUser;
		}

		const user = await httpPost<UserProfile, { credential: string }>(
			"/api/users/login/google",
			{ credential },
			config
		);
		setSelectedUserState(user, "me");
		return user;
	},

	logout() {
		userStore.clearSelectedUser();
		return true;
	},

	
	// Update the user profile
	// This method will be used to update the user's status or other profile information.

	async updateCurrentProfile(payload?: any, config: UserStoreConfig = {}) {
		if (SHOULD_USE_DUMMY_DATA) {
			dummyCurrentUser = {
				...dummyCurrentUser,
				...payload,
			};
			setSelectedUserState(dummyCurrentUser, "me");
			return dummyCurrentUser;
		}

		const user = await httpPut<UserProfile, UpdateUserPayload>("/api/users/me", payload, config);
		setSelectedUserState(user, "me");
		return user;
	},
};
