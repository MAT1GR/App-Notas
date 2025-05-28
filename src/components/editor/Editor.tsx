import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { useDocumentStore } from '../../store/documentStore';
import { useSettingsStore } from '../../store/settingsStore';
import EditorToolbar from './EditorToolbar';
import { debounce } from '../../utils/editorUtils';

const Editor: React.FC = () => {
  const { currentDocument, updateDocument, saveToLocalStorage, loadFromLocalStorage } = useDocumentStore();
  const { settings } = useSettingsStore();
  const [documentTitle, setDocumentTitle] = useState(currentDocument?.title || 'Untitled Document');
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Placeholder.configure({
        placeholder: 'Start writing your masterpiece...',
      }),
      Underline,
    ],
    content: currentDocument?.content || '',
    autofocus: 'end',
    onUpdate: debounce(({ editor }) => {
      const content = editor.getHTML();
      
      if (currentDocument) {
        // Save to cloud if we have a document
        updateDocument(currentDocument.id, {
          content,
        });
      } else {
        // Otherwise save to local storage
        saveToLocalStorage({
          title: documentTitle,
          content,
        });
      }
    }, 1000),
  });
  
  // Update editor content when current document changes
  useEffect(() => {
    if (editor && currentDocument) {
      // Only update if content is different to prevent cursor jumps
      if (editor.getHTML() !== currentDocument.content) {
        editor.commands.setContent(currentDocument.content);
      }
      setDocumentTitle(currentDocument.title);
    }
  }, [editor, currentDocument]);
  
  // Load from local storage if no document is selected
  useEffect(() => {
    if (editor && !currentDocument) {
      const localDocument = loadFromLocalStorage();
      if (localDocument) {
        editor.commands.setContent(localDocument.content || '');
        setDocumentTitle(localDocument.title || 'Untitled Document');
      }
    }
  }, [editor, currentDocument, loadFromLocalStorage]);
  
  // Apply settings
  useEffect(() => {
    if (editor) {
      editor.view.dom.classList.toggle('fullscreen', settings.fullscreenMode);
      editor.view.dom.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
      editor.view.dom.classList.add(settings.fontSize);
      
      editor.view.dom.classList.remove('leading-normal', 'leading-relaxed', 'leading-loose');
      editor.view.dom.classList.add(settings.lineHeight);
    }
  }, [editor, settings]);
  
  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setDocumentTitle(newTitle);
    
    if (currentDocument) {
      updateDocument(currentDocument.id, {
        title: newTitle,
      });
    } else {
      saveToLocalStorage({
        title: newTitle,
        content: editor?.getHTML() || '',
      });
    }
  };
  
  if (!editor) {
    return <div className="p-6">Loading editor...</div>;
  }
  
  return (
    <div className={`h-full flex flex-col ${settings.fullscreenMode ? 'fullscreen' : ''}`}>
      {!settings.fullscreenMode && (
        <div className="border-b border-background-tertiary/50 px-6 py-3">
          <input
            type="text"
            value={documentTitle}
            onChange={handleTitleChange}
            className="bg-transparent text-xl font-medium w-full focus:outline-none"
            placeholder="Untitled Document"
          />
        </div>
      )}
      
      <EditorToolbar editor={editor} />
      
      <div className={`flex-1 overflow-y-auto ${settings.font} ${settings.fontSize} ${settings.lineHeight}`}>
        <div className="max-w-3xl mx-auto">
          <EditorContent editor={editor} className="min-h-full" />
        </div>
      </div>
    </div>
  );
};

export default Editor;