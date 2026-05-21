import { UserProfile } from "@/models/userProfile";
import { TaskRecord } from "./taskStore";
import { 
  dummyLoginUser, 
  dummyCurrentUser, 
  dummyCurrentUser_friend_1_task,
  dummyCurrentUser_friendNew,
  dummyCurrentUser_friendClose, 
  dummyCurrentUser_friendDear } from "./dummyDatasets/user";
import { 
  dummyTasks,
  dummyTasks_completed,
  dummyTasks_more,
  dummyTasks_more_completed
} from "./dummyDatasets/tasks";

let dummySelectedUser: UserProfile | null = null;
let dummySelectedTask: TaskRecord | null = null;
let dummyTaskListCache: TaskRecord[] = [...dummyTasks];

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
      const foundTask = dummyTasks.find((entry) => entry._id === taskId);
      if (!foundTask) { throw new Error(`Task ${taskId} not found`); }
      dummySelectedTask = foundTask;
      return dummySelectedTask;
    }
  }

  else if (method === "POST") {
    console.log("Dummy API received POST request to", path, "with body:", body);
    if (path.includes("/users/login/google")) {
      dummySelectedUser = dummyLoginUser.user;
      return dummyLoginUser;

    } else if (path.includes("/tasks")) {
      dummyTaskListCache = (dummyTaskListCache.length > 0) ? 
          [body, ...dummyTaskListCache] : 
          [body];
      return dummyTaskListCache;
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
      dummySelectedTask = dummySelectedTask ? {
				...dummySelectedTask,
				state: "busy"
			} : {
        ...dummyTasks[0],
        state: "busy"
      };

      return dummySelectedTask;
      
    } else if (path.includes("/tasks/pause/")) {
      dummySelectedTask = dummySelectedTask ? {
				...dummySelectedTask,
				state: "waiting"
			} : {
        ...dummyTasks[0],
        state: "waiting"
      };

      return dummySelectedTask;
      
    } else if (path.includes("/tasks/")) {
      dummySelectedTask = dummySelectedTask ? {
				...dummySelectedTask,
				...body
			} : {
        ...dummyTasks[0],
        ...body
      };

      return dummySelectedTask;

    } else if (path.includes("/complete")) {
      if (body) {
        dummySelectedTask = dummySelectedTask ? {
          ...dummySelectedTask,
          state: "complete",
          completed: { ...body },
        } : {
          ...dummyTasks[0],
          state: "complete",
          completed: { ...body },
        };
        return dummySelectedTask;
      }
    }
  }
};