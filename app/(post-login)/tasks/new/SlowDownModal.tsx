"use client";

import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Modal from "../../../../components/Modal";
import Text from "../../../../components/Text";

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
        <Text as="h1" tone="secondary" fullWidth>
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
