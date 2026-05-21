"use client";

import { Button, Card, Modal, Text } from "@/components/index";

type SlowDownModalProps = {
  isOpen: boolean;
  onClose: () => void;
  maxTasksAllowed: number;
};

export default function SlowDownModal({ isOpen, onClose, maxTasksAllowed }: SlowDownModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="A+ for Productivity!"
      showFooterCloseButton={false}
    >
      <Card bare minHeight={false}>
        <Text as="h2" tone="secondary" fullWidth>
          <big>🏇🏻💨&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; _🏰 🐲!!!</big>
        </Text>

        <Text as="p" tone="secondary">
          You&apos;ve created <b>{maxTasksAllowed}</b> quests!
        </Text>

        <br/>
        <Button variant="filled" onClick={onClose}>
          Let&apos;s pick one and make it happen! 🎯
        </Button>
      </Card>
    </Modal>
  );
}
