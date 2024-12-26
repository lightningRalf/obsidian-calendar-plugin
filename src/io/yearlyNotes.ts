import type { Moment } from "moment";
import type { TFile } from "obsidian";
import {
  createYearlyNote,
  getYearlyNoteSettings,
} from "obsidian-daily-notes-interface";

import type { ISettings } from "src/settings";
import { createConfirmationDialog } from "src/ui/modal";

/**
 * Create a Yearly Note for a given date.
 */
export async function tryToCreateYearlyNote(
  date: Moment,
  ctrlPressed: boolean,
  settings: ISettings,
  cb?: (newFile: TFile) => void
): Promise<void> {
  const { workspace } = window.app;
  const { format } = getYearlyNoteSettings();
  const filename = date.format(format);

  const createFile = async () => {
    const yearlyNote = await createYearlyNote(date);
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
    await leaf.openFile(yearlyNote, { active: true });
    cb?.(yearlyNote);
  };

  if (settings.shouldConfirmBeforeCreate) {
    createConfirmationDialog({
      cta: "Create",
      onAccept: createFile,
      text: `File ${filename} does not exist. Would you like to create it?`,
      title: "New Yearly Note",
    });
  } else {
    await createFile();
  }
}
