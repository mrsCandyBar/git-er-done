"use client";

import { Button, Card, Text } from "@/components/index";
import { Timeline } from "@/components/Timeline";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { taskStore } from "@/stores";

import { Column } from "../../task/types";
import { getPropFromUrl } from "@/utilities/helper";
import moment from "moment";

export default function RecurTaskPage() {
  const [recurTask, setRecurTask] = useState<any>({});
  const [taskList, setTaskList] = useState<any>([]);
  const [recurringTaskState, setRecurringTaskState] = useState<any>({});

  useEffect(() => {
      let isMounted = true;
      async function loadPageData() {
        try {
          const [recurTask, tasks]:any = await Promise.all([
            taskStore.getRecurringTask(getPropFromUrl("recurId") as Column["recurId"] ?? ""),
            taskStore.getAllTasks({ recurId: getPropFromUrl("recurId") as Column["recurId"] ?? undefined }),
          ]);
  
          if (!isMounted) { return; }
          setRecurTask(recurTask);
          setTaskList(tasks);

          // Adding calculation for recurring task state
          const moodCount:any = {
            love: 0,
            happy: 0,
            "not-sure": 0,
            confused: 0,
            "not-for-me": 0,
          }

          tasks.forEach((task:any) => {
            if (task.completed?.mood && moodCount.hasOwnProperty(task.completed.mood)) {
              moodCount[task.completed.mood]++;
            }
          });

          const highestMood = Object.keys(moodCount).reduce((a, b) => moodCount[a] > moodCount[b] ? a : b);

          // get total time spent on the recurring task
          const totalTimeSpent = tasks.reduce((total:any, task:any) => {
            if (task.completed?.completedDate && task.createdDate) {
              total += moment(task.completed.completedDate).diff(moment(task.createdDate), "hours");
            }
            return total;
          }, 0);

          // Has saved keepsakes at least once
          const hasKeepsakes = tasks.some((task:any) => task.completed?.keepsakeUrl);

          setRecurringTaskState({
            totalCompletions: tasks[0]?.status !== "completed" ? tasks.length - 1 : tasks.length,
            mostCommonMood: highestMood,
            totalTimeSpent,
            hasKeepsakes
          });

          console.log("Loaded recurring task and tasks:", recurTask, tasks, recurringTaskState);

        } catch {}
      }
  
      loadPageData();
      return () => { isMounted = false; };
    }, []);

  return (
    <div className={styles.page}>
      
      <Card>
        <br/>
        <Text as="p" align="center" fullWidth>
          A history of YOUR progress<br/> 
          is a powerful reminder of what you are capable of.
        </Text>

        <Text as="h1" align="center" fullWidth>
          {recurTask?.name || " ... "}
        </Text>

        <br/>
        <Text as="p" align="center" fullWidth>
          You started on {moment(taskList[taskList.length - 1]?.createdDate).format("MMMM Do, YYYY")} <br/>
          It took {moment(taskList[taskList.length - 1]?.completed?.completedDate).diff(moment(taskList[taskList.length - 1]?.createdDate), "hours")} hours to finish.
        </Text>

        <Text as="blockquote" tone="secondary">
          "{taskList[taskList.length - 1]?.completed?.finalNotes}"<br/> - you [{taskList[taskList.length - 1]?.completed?.mood || "mood not recorded"}]
        </Text>
        
        {taskList.length > 1 && (
          <Text as="p" align="center" fullWidth>
            You have done it <b>{recurringTaskState.totalCompletions > 1 ? recurringTaskState.totalCompletions + " times" : "once"}</b>.<br/>
            Your general mood has been, <br/>
            that this makes you {recurringTaskState.mostCommonMood}.
          </Text>
        )}

        <br/>
        <Text as="p" align="center" fullWidth>
          <b>And here is the best part:</b><br/>
          These are your experiences
        </Text>

        {taskList.map((task:any) => 
          task?.completed?.finalNotes && (
            <div key={task._id}>
              <blockquote>"{task.completed?.finalNotes}"</blockquote>
              - {moment(task.createdDate).format("MMMM Do, YYYY")} {task.completed?.mood}<br/>
            </div>
        ))}

        {recurringTaskState.hasKeepsakes && (
          <>
            <Text as="p" align="center" fullWidth>
              These are the keepsakes you have saved over time
            </Text>

            {taskList.map((task:any) => 
              task?.completed?.keepsakeUrl && (
                <div key={task._id}>
                  <a href={task.completed?.keepsakeUrl} target="_blank" rel="noopener noreferrer">"{task.completed?.finalNotes || "Keepsake!"}"</a>
                  - {moment(task.createdDate).format("MMMM Do, YYYY")} {task.completed?.mood}<br/>
                </div>
            ))}
                
            <Text as="p" align="center" fullWidth>
                  Open all in a new window!
            </Text>
          </>
        )}

        {/*<br/>
        <Text as="p" align="center" fullWidth>
          And as a result YOU have earned these badges<br/>
          [badges].
        </Text>*/}

        <br/>
        <Text as="p" align="center" fullWidth>
          You have tracked {recurringTaskState.totalTimeSpent} hours<br/>
          over {moment(taskList[0]?.createdDate).diff(moment(taskList[taskList.length - 1]?.createdDate), "days")} days on this quest
        </Text>

        <br/>
        <br/>
        <Text as="h2" align="center" fullWidth>
          Keep it up! <br/>
          You're doing great!
        </Text>

        {/* Timeline of progress */}
        {taskList.length > 1 && (
          <div style={{ width: "100%", margin: "2rem 0" }}>
            <Timeline tasks={taskList} />
          </div>
        )}

        
        <Button href={`/tasks/task?id=${taskList[0]?._id}`} variant="filled">
          <big>Do it again!</big>
        </Button>
        <br/>
        <br/>

      </Card>
    </div>
  );
}
