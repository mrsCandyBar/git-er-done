import type { UserProfile, UserStatusType } from "../models/userProfile";
import { httpGet, httpPost, httpPut, type RequestConfig } from "./httpClient";

export type CreateUserPayload = Omit<UserProfile, "updatedDate" | "lastLoginDate">;
export type UpdateUserPayload = Partial<UserProfile>;
type UserStoreConfig = Omit<RequestConfig, "query">;
type SelectedFetchOptions = { forceRefresh?: boolean; };

let selectedUser: UserProfile | null = null;
let selectedUserNeedsRefresh = false;

function setSelectedUserState(user?: UserProfile) {
	if (user) {
		selectedUser = user;
		selectedUserNeedsRefresh = false;
	}
}

export const userStore = {

	// General upkeep of selected user state, 
	// which is used to cache the currently viewed user profile 
	// (either "me" or another user by id) and avoid unnecessary refetches. 
	// The store provides methods to get/set/clear the selected user, 
	// as well as invalidate it when updates occur.

	getSelectedUser() { return selectedUser; },

	setSelectedUser(user: UserProfile) { setSelectedUserState(user);},

	clearSelectedUser() {
		selectedUser = null;
		selectedUserNeedsRefresh = false;
	},

	invalidateSelectedUser() {
		if (selectedUser) {
			selectedUserNeedsRefresh = true;
		}
	},


	async getCurrentProfile(config: UserStoreConfig = {}, options: SelectedFetchOptions = {}) {
		const { forceRefresh = false } = options;
		if (selectedUser) {
			if (selectedUser && !selectedUserNeedsRefresh && !forceRefresh) { return selectedUser; }
			const user = await httpGet<UserProfile>("/users/get/" + selectedUser.id, config);
			setSelectedUserState(user);
			return user;
		} else {
			const user = await httpGet<UserProfile>("/users/me", config);
			setSelectedUserState(user);
			return user;
		}
	},


	// login/logout methods for demonstration purposes - 
	// in a real app these would likely involve more complex auth flows and token management

	async loginWithGoogle(idToken: string, config: UserStoreConfig = {}) {
		const response:any = await httpPost<UserProfile, { idToken: string }>("/users/login/google", { idToken }, config);
		console.log("Logged in user:", response);
		setSelectedUserState(response?.user);
		return response?.user;
	},

	logout() {
		userStore.clearSelectedUser();
		return true;
	},

	
	// Update the user profile
	// This method will be used to update the user's status or other profile information.

	async updateCurrentProfile(payload?: any, config: UserStoreConfig = {}) {
		const user = await httpPut<UserProfile, UserProfile>("/users/" + selectedUser?.id, payload, config);
		setSelectedUserState(user);
		return user;
	},

	async updateStatus(status: UserStatusType, config: UserStoreConfig = {}) {
		const user = await httpPut<UserProfile, { status: UserStatusType }>(
			"/users/updateStatus/" + selectedUser?.id, 
			{ status }, 
			config
		);
		setSelectedUserState(user);
		return user;
	},
};
