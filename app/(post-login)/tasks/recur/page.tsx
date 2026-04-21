"use client";

import { Button, Card, Text } from "@/components/index";
import styles from "./page.module.scss";

export default function RecurringTasksPage() {
  return (
    <div className={styles.page}>
      
      <Card>
        <br/>
        <Text as="p" align="center" fullWidth>
          A history of YOUR progress<br/> 
          is a powerful reminder of what you are capable of.
        </Text>

        <Text as="h1" align="center" fullWidth>
          The title of the recurring task goes here
        </Text>

        <br/>
        <Text as="p" align="center" fullWidth>
          You started on 21/04/2024 <br/>
          It took "1 hour" to finish.<br/>
          You said: "I feel accomplished and relieved to have this done." [mood]
        </Text>
        
        <Text as="p" align="center" fullWidth>
          You have done it again <b>12 times</b>.<br/>
          Your general mood has been, <br/>
          that this makes you HAPPY.
        </Text>

        <br/>
        <Text as="p" align="center" fullWidth>
          <b>And here is the best part:</b><br/>
          These are your experiences<br/><br/>
              - "this was hard, but worth the effort"<br/>
              04/04/2024 HAPPY<br/>
              - "I didn't want to do it, but I'm glad I did"<br/>
              28/04/2024 NEUTRAL<br/>
              - "I feel like I'm improving at this!"<br/>
              21/05/2024 HAPPY<br/><br/>
              ...See All!<br/><br/>

          
          These are the keepsakes you have saved over time<br/>
              - QUEST 01 [url](date) [mood]<br/>
              - QUEST 02 [url](date) [mood]<br/>
              - QUEST 03 [url](date) [mood]<br/>
              - QUEST 04 [url](date) [mood]<br/>
              Open all in a new window
        </Text>

        <br/>
        <Text as="p" align="center" fullWidth>
          And as a result YOU have earned these badges<br/>
          [badges].
        </Text>

        <br/>
        <Text as="p" align="center" fullWidth>
          You have tracked 74 hours<br/>
          over 6 months on this quest
        </Text>

        // Add a timeline of progress here, with the recurring quotes as tagged <br/>
        // milestones with mood emotes to celebrate the journey. 

        <br/>
        <br/>
        <Text as="h2" align="center" fullWidth>
          Keep it up! <br/>
          You're doing great!
        </Text>
        <br/>

        <Button href="" variant="filled">
          Shall we continue questing together?
        </Button>

      </Card>
    </div>
  );
}
