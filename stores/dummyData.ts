import { UserProfile } from "@/models/userProfile";
import { TaskRecord } from "./taskStore";

export const dummyTasks: TaskRecord[] = [
    {
        id: "dummy-dance-class",
        category: "fun",
        name: "Dance Class for Beginners",
        description: "Let's get those feet moving! This beginner-friendly dance class is perfect for anyone looking to have fun.",
        status: "waiting",
        checklist: [
            { id: "dummy-dance-class-1", label: "Book an appointment", checked: true },
            { id: "dummy-dance-class-2", label: "Arrange transportation", checked: true },
            { id: "dummy-dance-class-3", label: "Take a keepsake photo", checked: false },
        ],
        updatedDate: new Date().toISOString(),
    },
];

export const dummyCurrentUser: UserProfile = { 
  id: "69ebe15ad506dd037214c89b",
  status: "friend",
  name: "Candice Bar",
  profilePicture: "https://lh3.googleusercontent.com/a/ACg8ocKkfePBiQdfVEcR5NV5NfNhOAEx91qvQtyibO0NITg6-yc-4LPR=s96-c",
  dob: "1987-07-04",
  about: "Curious, reflective, and always chasing wonder.",
  progressUpdatePush: {
    schedule: "monthly",
    lastUpdateSent: "2026-10-03T22:00:00.000+00:00",
    lastUpdatedDate: "2026-10-03T22:00:00.000+00:00",
    updatedDate: "2026-10-03T22:00:00.000+00:00"
  },
  startedDate: "2026-04-14",
  updatedDate: "2026-04-14",
  lastLoginDate: "2026-04-14",
  inspirations: [
    {
      inspiration: "Vivienne Westwood, Yoshitaka Amano, Sephiroth",
      reason: "To be more bold!",
      url: "",
    },
  ],
  achievements: [
    {
      completed: {
        new: ["1","2","3","4","5"],
        fun: ["6","7","8"],
        quest: ["9"],
      },
      recognized: ["11","12"],
    },
  ],
  aspirations: {
    new: ["1","2","3","4","5"],
    fun: ["6","7","8"],
    quest: ["9"],
  },
};

let dummySelectedUser: UserProfile | null = null;
let dummySelectedTask: TaskRecord | null = null;
let dummyTaskListCache: TaskRecord[] = [...dummyTasks];

export function returnDummyData(method: string, path: string, body?: any) {
  if (method === "GET") {
    if (path.includes("/api/users/get/") || path.includes("/api/users/me")) {
      dummySelectedUser = dummyCurrentUser;
      return dummySelectedUser;

    } else if (path.includes("/api/tasks/getAll")) {
      let filteredTasks = dummyTaskListCache;
      if (body && body.query && body.query) {
        if (body.query.status) {
          filteredTasks = filteredTasks.length > 0 ?
              filteredTasks.filter((task) => task.status === body.query.status) : [];
        } else if (body.query.category) {
          filteredTasks = filteredTasks.length > 0 ?
              filteredTasks.filter((task) => task.category === body.query.category) : [];
        }
      } 
      return filteredTasks;

    } else if (path.includes("/api/tasks/")) {
      const taskId = path.split("/").pop();
      const foundTask = dummyTasks.find((entry) => entry.id === taskId);
      if (!foundTask) { throw new Error(`Task ${taskId} not found`); }
      dummySelectedTask = foundTask;
      return dummySelectedTask;
    }
  }

  else if (method === "POST") {
    if (path.includes("/api/users/login/google")) {
      dummySelectedUser = dummyCurrentUser;
      return dummySelectedUser;

    } else if (path.includes("/api/tasks")) {
      dummyTaskListCache = (dummyTaskListCache.length > 0) ? 
          [body, ...dummyTaskListCache] : 
          [body];
      return dummyTaskListCache;
    }
  }

  else if (method === "PUT") {
    if (path.includes("/api/users/") || path.includes("/api/users/updateStatus/")) {
      dummySelectedUser = dummySelectedUser ?  {
				...dummySelectedUser,
				...body,
			} : {
        ...dummyCurrentUser,
        ...body,
      }
      return dummySelectedUser;

    } else if (path.includes("/api/tasks/start/")) {
      dummySelectedTask = dummySelectedTask ? {
				...dummySelectedTask,
				status: "busy"
			} : {
        ...dummyTasks[0],
        status: "busy"
      };

      return dummySelectedTask;
      
    } else if (path.includes("/api/tasks/pause/")) {
      dummySelectedTask = dummySelectedTask ? {
				...dummySelectedTask,
				status: "waiting"
			} : {
        ...dummyTasks[0],
        status: "waiting"
      };

      return dummySelectedTask;
      
    } else if (path.includes("/api/tasks/")) {
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
          status: "complete",
          completed: { ...body },
        } : {
          ...dummyTasks[0],
          status: "complete",
          completed: { ...body },
        };
        return dummySelectedTask;
      }
    }
  }
};