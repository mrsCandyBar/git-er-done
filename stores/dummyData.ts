import { UserProfile } from "@/models/userProfile";
import { TaskRecord } from "./taskStore";
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

let dummySelectedUser: UserProfile | null = null;
let dummySelectedTask: TaskRecord | null = null;
let dummyTaskListCache: TaskRecord[] = [...dummyTasks_more, ...dummyTasks_more_completed];

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
    }
  }
};