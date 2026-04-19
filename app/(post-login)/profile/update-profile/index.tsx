"use client";

import Card from "../../../../components/Card";
import Form, { FormFieldConfig } from "../../../../components/Form";
import Modal from "../../../../components/Modal";
import Text from "../../../../components/Text";

type UpdateProfileProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaveInspiration: (formData: Record<string, FormDataEntryValue>) => void;
};

export default function UpdateProfile({ isOpen, onClose, onSaveInspiration }: UpdateProfileProps) {
  const fields: FormFieldConfig[] = [
    {
      name: "about",
      label: "What makes you, you?",
      type: "textarea",
      placeholder: "Tell us how you would describe yourself to a new friend.",
      required: true,
    },
    {
      name: "inspiration",
      label: (
              <Text as="span">
                <b>Inspiration 💫</b><br />
                Who or what inspires you?
              </Text>
            ),
      type: "textarea",
      rows: 4,
      placeholder: "What intriguing, exciting, or awe inducing things make you feel alive... ",
      required: true,
    },
    {
      name: "inspiration-why",
      label: "Why does this invigorate you? (optional)",
      type: "textarea",
      rows: 4,
      placeholder: "Inspiration can come from the most unexpected places, and for the most unexpected reasons.",
    },
    {
      name: "inspiration-url",
      label: "Share a link to your inspiration (optional)",
      type: "text",
      placeholder: "Link to photo, video, song, article, or anything else",
    },
  ];

  const handleSubmit = (formData: Record<string, FormDataEntryValue>) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onSaveInspiration(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showFooterCloseButton={false}
      title="Tell us about yourself 🌟"
      description="The next questions require deep thinking. Take your time, share as much or as little as you like."
    >
      <Card bare minHeight={false}>
        <Form
          fields={fields}
          submitLabel="Save your inspiration ✨"
          onSubmit={handleSubmit}
          footnote="Important! No-one will see your answers, this is just for you to reflect on and track your own progress through time."
        />
      </Card>
    </Modal>
  );
}
