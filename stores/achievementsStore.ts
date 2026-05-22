import type { CategoryBuckets } from "../models/userProfile";
import { httpDelete, httpGet, httpPost, httpPut, type GenericRequestConfig } from "./httpClient";

export type AchievementRecord = {
	_id: string;
	title: string;
	description: string;
	tagline?: string;
	gainedFrom?: string;
	physicalTrait?: {
		icon: {
			value: string;
			width: number;
			height: number;
			textSizes: {
			round: number;
			symbol: number;
			}
		},
		label: {
			value: string;
			textSticker: string[];
			offset_round: number;
			offset_round_full: number;
			labelWidth: number;
			labelHeight: number;
			textSizes: {
			round: number[];
			text: number[];
			}
		},
		subtitle: {
			value: string;
			offset_round: number;
			offset_round_full: number;
			textSizes: {
			round: number[];
			}
		},
		color: {
			accent: string;
			contrast: string;
		}
	};
	createdDate?: string | null | undefined;
	updatedDate?: string | null | undefined;
};

export type CreateAchievementPayload = Omit<AchievementRecord, "_id">;
export type UpdateAchievementPayload = Partial<Omit<AchievementRecord, "_id">>;

type AchievementStoreConfig = Omit<GenericRequestConfig, "query">;
type SelectedFetchOptions = { forceRefresh?: boolean };

export const achievementsStore = {

	getAllAchievements(config: AchievementStoreConfig = {}) {
		return httpGet<AchievementRecord[]>("/achievements/getAll", config);
	},

	async getAchievementById(achievementId: string, config: AchievementStoreConfig = {}, options: SelectedFetchOptions = {}) {
		const achievement = await httpGet<AchievementRecord>(`/achievements/get/${achievementId}`, config);
		return achievement;
	},

	async createAchievement(payload: CreateAchievementPayload, config: AchievementStoreConfig = {}) {
		const achievement = await httpPost<AchievementRecord, CreateAchievementPayload>("/achievements/create", payload, config);
		return achievement;
	},

	async updateAchievement(achievementId: string, payload: UpdateAchievementPayload, config: AchievementStoreConfig = {}) {
		const achievement = await httpPut<AchievementRecord, UpdateAchievementPayload>(`/achievements/update/${achievementId}`, payload, config);
		return achievement;
	},

	async deleteAchievement(achievementId: string, config: AchievementStoreConfig = {}) {
		const deleted = await httpDelete<AchievementRecord>(`/achievements/delete/${achievementId}`, config);
		return deleted;
	},
};
