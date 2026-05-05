# git-er-done
Git-er-done is a task manager for serial procrastinators. Got unfinished business, pleasure, wants, desires? Got this app installed? Got some time free? then git-er-done! 

Use emoji-pedia for icon ideas : 🚞 https://emojipedia.org/

## Environment Flags

- `NEXT_PUBLIC_USE_DUMMY_DATA=true`
  - When enabled, `userStore` and `taskStore` return in-memory dummy objects and skip all HTTP request calls.
  - Useful for UI-only development without backend dependencies.

DONE:
- tasks list page 04/13
- create tasks 04/13
- update tasks 04/14
- complete tasks 04/14
- completed task summary page 04/14
- add badges and moods for tasks completed 04/14
- show profile state based off status type in profile 04/14
- update profile 04/14
- complete profile (basic - flesh it out in the AM) 04/14
- achievements task  04/15
- achievements multiple-tasks 04/15
- add page flow to slow introduce the user to the states of how everything fits together 04/16
- add stores and state and dummy data 04/16
- recurring task page 04/21
  - This page should pull all tasks with the selected recurring ID, it'll show the recurring title, description and the completed quotes, moods and dates that those tasks were completed. 
  - It should summarise with an overall mood for this task, how often it is completed, it should show a basic timeline from when the user started the initial task until the last completed task in a timeline fashion with the mood emojis.
  - it should then end off with the latest task to start being available for the user to start if they want to, or to cancel if they wish to. 04/21
- payment/account page 04/22
- [BE] add mood to completed task object 04/24
- [BE] change recur to being an objectID to a new collection called recur 04/24
- [BE] add a new collection called recur with basic CRUD updates 04/24
- [BE] add statuses : friend, friend-new, friend-dear, friend-close (better than user), confidant (paid user) 04/24
- [BE] add a new collection called achievements with basic CRUD updates 04/24
- Rewrite store pages for easy updating of payloads and requests 04/28
- Connected to BE 05/04 WOO!
- encrypt auth token to localstorage 05/04
- [BE] add auth token to BE 05/04
- [BE] have auth token return with google login 05/04
- [BE] use auth token to call for queries that requires user specific data 05/04
- [BE] add auth for task requests 05/04
- start, pause and complete tasks

TODO:
- Test flow and payloads
  - update profile requests
  -------------------------
  - isNewUser, prompt the user to create a recognisable pattern that they can use to login to their account later on 
    - hold onto it for 1 month
    - if user leaves page for 30 mins, add a user check. simple prop check for reinit purpose in the user payload
    - if user returns a day later 
      - let the user to use the token to call the data and then prompt them for the prop check

- profile page
- recurring task page polish and timeline

- [BE] achievement notification settings (Progress Update Push)
- set achievement notification settings
- achievements can be gained via FE
  - achievements for completion in a week is task count: 6, 12 and 18 (max tasks)
  - achievements for duration: quick thinker: 5 minutes and under, focused: 15 - 30 minutes, locked-in: 30 minutes - 2 hours, mountaineer: 2 hours and higher
  - achievements for endurance: total completed task count 
      20 tasks, 
      50 tasks, 
      100 tasks, 
      210 tasks, 
      430 tasks, 
      870 tasks, 
      1750 tasks, 
      3510 tasks 

- achievements over given time frame
- achievements page overview
- achievements calendar


THEN
- MAKE PRETTY !!!!

MUCH LATER:
- BucketList