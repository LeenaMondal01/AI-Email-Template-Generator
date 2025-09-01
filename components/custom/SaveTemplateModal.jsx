"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function SaveTemplateModal({ open, onClose, onSave, initialName }) {
  const [name, setName] = useState(initialName || "");

  // Sync prop -> state whenever the modal opens or initialName changes
  useEffect(() => {
    if (open) setName(initialName || "");
  }, [initialName, open]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialName ? "Update Template Name" : "Save Template"}</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Give a name to the template"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}