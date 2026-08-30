"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type AccountEditorProps = {
  initialName: string;
  initialBio: string;
  onSave?: (name: string, bio: string) => void;
  onCancel?: () => void;
};

export default function AccountEditor({
  initialName,
  initialBio,
  onSave,
  onCancel,
}: AccountEditorProps) {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);

  const handleSave = () => {
    onSave?.(name.trim(), bio.trim());
  };

  const handleCancel = () => {
    onCancel?.();
    setName(initialName);
    setBio(initialBio);
  };

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-md border border-ink/25 px-3 py-2 text-sm shadow-sm focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-colors"
        aria-label="Name"
      />
      <textarea
        rows={3}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about yourself..."
        className="w-full rounded-md border border-ink/25 px-3 py-2 text-sm shadow-sm focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-colors resize-none"
        aria-label="Bio"
      />
      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleCancel}
          className="px-4 py-2 text-sm hover:bg-ink/80"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="px-4 py-2 text-sm bg-accent text-surface hover:bg-accent/90"
        >
          Save
        </Button>
      </div>
    </div>
  );
}