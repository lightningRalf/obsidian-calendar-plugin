import type { Moment } from "moment";
import type { TFile, WorkspaceLeaf } from "obsidian";
import {
  createMonthlyNote,
  getMonthlyNoteSettings,
} from "obsidian-daily-notes-interface";

import type { ISettings } from "src/settings";
import { createConfirmationDialog } from "src/ui/modal";

/**
 * Create a Monthly Note for a given date.
 */
export async function tryToCreateMonthlyNote(
  date: Moment,
  ctrlPressed: boolean,
  settings: ISettings,
  cb?: (newFile: TFile) => void
): Promise<void> {
  const { workspace } = window.app;
  const { format } = getMonthlyNoteSettings();
  const filename = date.format(format);

  const createFile = async () => {
    const monthlyNote = await createMonthlyNote(date);
    let leaf: WorkspaceLeaf;
    if (ctrlPressed) {
      if (settings.ctrlClickOpensInNewTab) {
        leaf = workspace.getLeaf('tab');
      } else {
        leaf = workspace.getLeaf('split', 'vertical');
      }
    } else {
      leaf = workspace.getLeaf(false);
    }
    await leaf.openFile(monthlyNote, { active: true });
    cb?.(monthlyNote);
  };

  if (settings.shouldConfirmBeforeCreate) {
    createConfirmationDialog({
      cta: "Create",
      onAccept: createFile,
      text: `File ${filename} does not exist. Would you like to create it?`,
      title: "New Monthly Note",
    });
  } else {
    await createFile();
  }
}
