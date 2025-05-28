export function debounce<F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

export const insertDialogueScript = (editor: any) => {
  if (!editor) return;
  
  const { state } = editor;
  const { selection } = state;
  const { $from, empty } = selection;
  
  // Get current paragraph text
  const currentLine = $from.parent.textContent;
  
  // If line is empty or does not start with an em dash, insert one
  if (empty && (!currentLine || !currentLine.startsWith('—'))) {
    editor.chain()
      .insertContent('— ')
      .run();
  }
};

export const handleKeyboardShortcuts = (editor: any, event: KeyboardEvent) => {
  // Add custom keyboard shortcuts here
  // For example: Alt+D to insert dialogue script
  if (event.altKey && event.key === 'd') {
    event.preventDefault();
    insertDialogueScript(editor);
    return true;
  }
  
  return false;
};