import { httpDelete, httpGet, httpPost, httpPut, type GenericRequestConfig } from "./httpClient";

export type BadgeRecord = {
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

export type CreateBadgePayload = Omit<BadgeRecord, "_id">;
export type UpdateBadgePayload = Partial<Omit<BadgeRecord, "_id">>;

type BadgeStoreConfig = Omit<GenericRequestConfig, "query">;
type SelectedFetchOptions = { forceRefresh?: boolean };

export const badgesStore = {

	getAllBadges(config: BadgeStoreConfig = {}) {
		return httpGet<BadgeRecord[]>("/badges/getAll", config);
	},

	async getBadgeById(badgeId: string, config: BadgeStoreConfig = {}, options: SelectedFetchOptions = {}) {
		const badge = await httpGet<BadgeRecord>(`/badges/get/${badgeId}`, config);
		return badge;
	},

	async createBadge(payload: CreateBadgePayload, config: BadgeStoreConfig = {}) {
		const badge = await httpPost<BadgeRecord, CreateBadgePayload>("/badges/create", payload, config);
		return badge;
	},

	async updateBadge(badgeId: string, payload: UpdateBadgePayload, config: BadgeStoreConfig = {}) {
		const badge = await httpPut<BadgeRecord, UpdateBadgePayload>(`/badges/update/${badgeId}`, payload, config);
		return badge;
	},

	async deleteBadge(badgeId: string, config: BadgeStoreConfig = {}) {
		const deleted = await httpDelete<BadgeRecord>(`/badges/delete/${badgeId}`, config);
		return deleted;
	},
};
