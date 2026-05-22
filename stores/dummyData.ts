import { UserProfile } from "@/models/userProfile";
import { TaskRecord } from "./taskStore";
import type { AchievementRecord } from "./achievementsStore";
import type { BadgeRecord } from "./badgesStore";
import { 
  dummyLoginUser, 
  dummyCurrentUser, 
  dummyCurrentUser_friend_1_task,
  dummyCurrentUser_friendNew,
  dummyCurrentUser_friendDear,
  dummyCurrentUser_friendClose, 
   } from "./dummyDatasets/user";
import { 
  dummyTasks,
  dummyTasks_completed,
  dummyTasks_more,
  dummyTasks_more_completed
} from "./dummyDatasets/tasks";
import { rewards } from "./dummyDatasets/rewards";  
import { achievements } from "./dummyDatasets/achievements";  

let dummySelectedUser: UserProfile | null = null;
let dummySelectedTask: TaskRecord | null = null;
let dummyTaskListCache: TaskRecord[] = [...dummyTasks_more, ...dummyTasks_more_completed];
let dummyAchievementListCache: AchievementRecord[] = [...achievements];
let dummyBadgeListCache: BadgeRecord[] = [...rewards];

export function returnDummyData(method: string, path: string, body?: any) {
  if (method === "GET") {
    if (path.includes("/users/get/") || path.includes("/users/me")) {
      dummySelectedUser = dummyCurrentUser;
      return dummySelectedUser;

    } else if (path.includes("/tasks/getAll")) {
      let filteredTasks = dummyTaskListCache;
      if (body && body.query && body.query) {
        if (body.query.state) {
          filteredTasks = filteredTasks.length > 0 ?
              filteredTasks.filter((task) => task.state === body.query.state) : [];
        } else if (body.query.category) {
          filteredTasks = filteredTasks.length > 0 ?
              filteredTasks.filter((task) => task.category === body.query.category) : [];
        }
      } 
      return filteredTasks;

    } else if (path.includes("/tasks/")) {
      const taskId = path.split("/").pop();
      const foundTask = dummyTaskListCache.find((entry) => entry._id === taskId);
      if (!foundTask) { throw new Error(`Task ${taskId} not found`); }
      dummySelectedTask = foundTask;
      return dummySelectedTask;

    } else if (path.includes("/achievements/getAll")) {
      return dummyAchievementListCache;

    } else if (path.includes("/achievements/get/")) {
      const achievementId = path.split("/").pop();
      const foundAchievement = dummyAchievementListCache.find((entry) => entry._id === achievementId);
      if (!foundAchievement) { throw new Error(`Achievement ${achievementId} not found`); }
      return foundAchievement;

    } else if (path.includes("/badges/getAll")) {
      return dummyBadgeListCache;

    } else if (path.includes("/badges/get/")) {
      const badgeId = path.split("/").pop();
      const foundBadge = dummyBadgeListCache.find((entry) => entry._id === badgeId);
      if (!foundBadge) { throw new Error(`Badge ${badgeId} not found`); }
      return foundBadge;
    }
  }

  else if (method === "POST") {
    console.log("Dummy API received POST request to", path, "with body:", body);
    if (path.includes("/users/login/google")) {
      dummySelectedUser = dummyLoginUser.user;
      return dummyLoginUser;

    } else if (path.includes("/tasks/update/")) {
      const taskId = path.split("/").pop();
      const foundTask = dummyTaskListCache.findIndex((entry) => entry._id === taskId);
      if (foundTask === -1) { throw new Error(`Task ${taskId} not found`); }
      else {
        dummyTaskListCache[foundTask] = {
          ...dummyTaskListCache[foundTask],
          ...body,
        }
      }
      return dummyTaskListCache;

    } else if (path.includes("/tasks")) {
      const taskId = path.split("/").pop();
      const foundTask = dummyTaskListCache.findIndex((entry) => entry._id === taskId);
      if (foundTask === -1) { throw new Error(`Task ${taskId} not found`); }
      else {
        dummyTaskListCache[foundTask] = {
          ...dummyTaskListCache[foundTask],
          ...body,
        }
      }
      return dummyTaskListCache;

    } else if (path.includes("/achievements/create")) {
      const newAchievement: AchievementRecord = {
        _id: String(Date.now()),
        title: body?.title ?? "",
        description: body?.description ?? "",
        tagline: body?.tagline,
        gainedFrom: body?.gainedFrom,
        physicalTrait: body?.physicalTrait,
      };
      dummyAchievementListCache = [newAchievement, ...dummyAchievementListCache];
      return newAchievement;

    } else if (path.includes("/badges/create")) {
      const newBadge: BadgeRecord = {
        _id: String(Date.now()),
        title: body?.title ?? "",
        description: body?.description ?? "",
        tagline: body?.tagline,
        gainedFrom: body?.gainedFrom,
        physicalTrait: body?.physicalTrait,
      };
      dummyBadgeListCache = [newBadge, ...dummyBadgeListCache];
      return newBadge;
    }
  }

  else if (method === "PUT") {
    if (path.includes("/users/") || path.includes("/users/updateStatus/")) {
      dummySelectedUser = dummySelectedUser ?  {
				...dummySelectedUser,
				...body,
			} : {
        ...dummyCurrentUser,
        ...body,
      }
      return dummySelectedUser;

    } else if (path.includes("/tasks/start/")) {
      const taskId = path.split("/").pop();
      const foundTask = dummyTaskListCache.findIndex((entry) => entry._id === taskId);
      if (foundTask === -1) { throw new Error(`Task ${taskId} not found`); }
      else {
        dummyTaskListCache[foundTask] = {
          ...dummyTaskListCache[foundTask],
          state: "busy"
        }
      }

      dummySelectedTask = dummyTaskListCache[foundTask]
      return dummySelectedTask;
      
    } else if (path.includes("/tasks/pause/")) {
      const taskId = path.split("/").pop();
      const foundTask = dummyTaskListCache.findIndex((entry) => entry._id === taskId);
      if (foundTask === -1) { throw new Error(`Task ${taskId} not found`); }
      else {
        dummyTaskListCache[foundTask] = {
          ...dummyTaskListCache[foundTask],
          state: "waiting"
        }
      }

      dummySelectedTask = dummyTaskListCache[foundTask]
      return dummySelectedTask;
      
    } else if (path.includes("/tasks/")) {
      const taskId = path.split("/").pop();
      const foundTask = dummyTaskListCache.findIndex((entry) => entry._id === taskId);
      if (foundTask === -1) { throw new Error(`Task ${taskId} not found`); }
      else {
        dummyTaskListCache[foundTask] = {
          ...dummyTaskListCache[foundTask],
          ...body
        }
      }

      dummySelectedTask = dummyTaskListCache[foundTask]
      return dummySelectedTask;

    } 
    
    else if (path.includes("/complete")) {
      const taskId = path.split("/").pop();
      const foundTask = dummyTaskListCache.findIndex((entry) => entry._id === taskId);
      if (foundTask === -1) { throw new Error(`Task ${taskId} not found`); }
      else {
        dummyTaskListCache[foundTask] = {
          ...dummyTaskListCache[foundTask],
          state: "complete",
          completed: { ...body },
        }
      }

      dummySelectedTask = dummyTaskListCache[foundTask]
      return dummySelectedTask;

    } else if (path.includes("/achievements/update/")) {
      const achievementId = path.split("/").pop();
      const foundAchievement = dummyAchievementListCache.findIndex((entry) => entry._id === achievementId);
      if (foundAchievement === -1) { throw new Error(`Achievement ${achievementId} not found`); }

      dummyAchievementListCache[foundAchievement] = {
        ...dummyAchievementListCache[foundAchievement],
        ...body,
      };

      return dummyAchievementListCache[foundAchievement];

    } else if (path.includes("/badges/update/")) {
      const badgeId = path.split("/").pop();
      const foundBadge = dummyBadgeListCache.findIndex((entry) => entry._id === badgeId);
      if (foundBadge === -1) { throw new Error(`Badge ${badgeId} not found`); }

      dummyBadgeListCache[foundBadge] = {
        ...dummyBadgeListCache[foundBadge],
        ...body,
      };

      return dummyBadgeListCache[foundBadge];
    }
  }

  else if (method === "DELETE") {
    if (path.includes("/achievements/delete/")) {
      const achievementId = path.split("/").pop();
      const foundAchievement = dummyAchievementListCache.findIndex((entry) => entry._id === achievementId);
      if (foundAchievement === -1) { throw new Error(`Achievement ${achievementId} not found`); }

      const deletedAchievement = dummyAchievementListCache[foundAchievement];
      dummyAchievementListCache = dummyAchievementListCache.filter((entry) => entry._id !== achievementId);
      return deletedAchievement;

    } else if (path.includes("/badges/delete/")) {
      const badgeId = path.split("/").pop();
      const foundBadge = dummyBadgeListCache.findIndex((entry) => entry._id === badgeId);
      if (foundBadge === -1) { throw new Error(`Badge ${badgeId} not found`); }

      const deletedBadge = dummyBadgeListCache[foundBadge];
      dummyBadgeListCache = dummyBadgeListCache.filter((entry) => entry._id !== badgeId);
      return deletedBadge;
    }
  }
};