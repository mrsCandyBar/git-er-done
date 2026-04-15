import type { ReactNode } from "react";
import type { UserStatusType } from "./userProfile";

export type LastActionType = "startedNewTask" | "completedTask" | "createdNewTask";

export type DashboardActionCardContent = {
  eyebrow: string;
  icon: string;
  title: string;
  description: (taskName: string) => ReactNode;
  primaryLabel: (taskName: string) => string;
  primaryHref: (taskHref: string) => string;
  secondaryLabel: string;
  secondaryHref: string;
};

export const dashboardActionContent: Record<LastActionType, DashboardActionCardContent> = {
  startedNewTask: {
    eyebrow: "You got this! 🚀",
    icon: "🏃",
    title: "Shall we kick off where we last dropped off?",
    description: (taskName) => <strong>{taskName}</strong>,
    primaryLabel: () => "Let's Go!",
    primaryHref: (taskHref) => taskHref,
    secondaryLabel: "Raincheck! Try another",
    secondaryHref: "/tasks",
  },
  completedTask: {
    eyebrow: "Got her done! 💪",
    icon: "🎉",
    title: "Boom. You got this! Last time you nailed",
    description: (taskName) => <strong>{taskName}</strong>,
    primaryLabel: () => "Let’s make it happen again ✨",
    primaryHref: () => "/task",
    secondaryLabel: "Let's make another!",
    secondaryHref: "/tasks/new",
  },
  createdNewTask: {
    eyebrow: "Ready to roll! 🙌",
    icon: "✨",
    title: "We added a little something new...",
    description: (taskName) => <strong>{taskName}</strong>,
    primaryLabel: () => "Give it a look 👀",
    primaryHref: (taskHref) => taskHref,
    secondaryLabel: "Raincheck! Try another",
    secondaryHref: "/tasks",
  },
};

export type FriendStatusActionCardContent = {
  eyebrow: (profileName?: string) => ReactNode;
  icon: string;
  title: string;
  description?: (profileName: string) => ReactNode;
  primaryLabel: (profileName: string) => string;
  primaryHref: () => string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export const friendStatusActionContent: Record<UserStatusType, FriendStatusActionCardContent> = {
  friend: {
    eyebrow: () => "Hello there friend!👋",
    icon: "🏃",
    title: "You're new here, let's get you set up with your first milestone!",
    primaryLabel: () => "Let's Go!",
    primaryHref: () => "/tasks/new",
  },
  friend_new: {
    eyebrow: (profileName) => `Hello again, ${profileName} ✨`,
    icon: "🎉",
    title: "Your profile is looking good, let's add a little more to make it shine.",
    primaryLabel: () => "Tiny step, big mood shift ✨",
    primaryHref: () => "/task",
  },
  friend_dear: {
    eyebrow: () => "Profile Complete! 💯!!!",
    icon: "🫶",
    title: "Thank you for sharing your inspirations and aspirations with us. Here's a 🎁 for you",
    primaryLabel: () => "Accept Gift ✨",
    primaryHref: () => "/tasks/new",
  },
  friend_close: {
    eyebrow: () => "You're a close friend! 💖",
    icon: "🌟",
    title: "Thank you for being with us on this journey.",
    primaryLabel: () => "Continue Exploring 🌍",
    primaryHref: () => "/tasks/new",
  },
};

export type CloseProfileActionCardContent = {
  eyebrow: () => ReactNode;
  profileImage: (profilePicture?: string) => ReactNode;
  title: (profileName: string) => ReactNode;
  description: (profileAbout: string) => ReactNode;
  primaryLabel: (profileName: string) => string;
  primaryHref: () => string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export const closeProfileActionContent: CloseProfileActionCardContent = {
  eyebrow: () => "Welcome back friend 💖",
  profileImage: (profilePicture) => <img src={profilePicture} alt="Profile" />,
  title: (profileName) => <>{profileName}</>,
  description: (profileAbout) => <>{profileAbout}</>,
  primaryLabel: () => "Keep Exploring 🌍",
  primaryHref: () => "/tasks/new",
};
