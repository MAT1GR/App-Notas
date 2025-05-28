import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  ChevronDown,
  Type,
  PanelLeftClose,
  Maximize,
} from 'lucide-react';
import { useSettingsStore, FontFamily } from '../../store/settingsStore';

interface EditorToolbarProps {
  editor: Editor;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const { settings, setFont, setFontSize, setLineHeight, toggleFullscreen } = useSettingsStore();
  const [showFontMenu, setShowFontMenu] = useState(false);
  
  if (!editor) {
    return null;
  }
  
  const fontOptions: { value: FontFamily; label: string }[] = [
    { value: 'font-outfit', label: 'Outfit' },
    { value: 'font-inter', label: 'Inter' },
    { value: 'font-serif', label: 'Serif' },
    { value: 'font-mono', label: 'Monospace' },
  ];
  
  return (
    <div className="border-b border-background-tertiary/50 px-4 py-2 bg-background-secondary flex items-center">
      <div className="flex items-center space-x-1 mr-4">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`icon-btn ${editor.isActive('bold') ? 'bg-background-tertiary/70 text-content-primary' : ''}`}
          aria-label="Bold"
          title="Bold (Ctrl+B)"
        >
          <Bold size={18} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`icon-btn ${editor.isActive('italic') ? 'bg-background-tertiary/70 text-content-primary' : ''}`}
          aria-label="Italic"
          title="Italic (Ctrl+I)"
        >
          <Italic size={18} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`icon-btn ${editor.isActive('underline') ? 'bg-background-tertiary/70 text-content-primary' : ''}`}
          aria-label="Underline"
          title="Underline (Ctrl+U)"
        >
          <Underline size={18} />
        </button>
      </div>
      
      <div className="flex items-center space-x-1 mr-4">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`icon-btn ${editor.isActive('heading', { level: 1 }) ? 'bg-background-tertiary/70 text-content-primary' : ''}`}
          aria-label="Heading 1"
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`icon-btn ${editor.isActive('heading', { level: 2 }) ? 'bg-background-tertiary/70 text-content-primary' : ''}`}
          aria-label="Heading 2"
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`icon-btn ${editor.isActive('heading', { level: 3 }) ? 'bg-background-tertiary/70 text-content-primary' : ''}`}
          aria-label="Heading 3"
          title="Heading 3"
        >
          <Heading3 size={18} />
        </button>
      </div>
      
      <div className="flex items-center space-x-1 mr-4">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`icon-btn ${editor.isActive('bulletList') ? 'bg-background-tertiary/70 text-content-primary' : ''}`}
          aria-label="Bullet List"
          title="Bullet List"
        >
          <List size={18} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`icon-btn ${editor.isActive('orderedList') ? 'bg-background-tertiary/70 text-content-primary' : ''}`}
          aria-label="Ordered List"
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </button>
      </div>
      
      <div className="flex items-center ml-auto">
        <div className="relative">
          <button
            onClick={() => setShowFontMenu(!showFontMenu)}
            className="flex items-center space-x-1 px-2 py-1.5 rounded-md hover:bg-background-tertiary/50 text-sm"
          >
            <Type size={16} />
            <span className="hidden sm:inline-block">
              {fontOptions.find(f => f.value === settings.font)?.label || 'Font'}
            </span>
            <ChevronDown size={14} />
          </button>
          
          {showFontMenu && (
            <div className="absolute z-10 mt-1 bg-background-secondary border border-background-tertiary rounded-md shadow-lg py-1 w-48">
              <div className="px-3 py-2 text-xs text-content-secondary border-b border-background-tertiary/50">
                Font Family
              </div>
              {fontOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFont(option.value);
                    setShowFontMenu(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-background-tertiary/50 ${settings.font === option.value ? 'text-ui-primary' : 'text-content-primary'}`}
                >
                  <span className={option.value}>{option.label}</span>
                </button>
              ))}
              
              <div className="px-3 py-2 text-xs text-content-secondary border-b border-t border-background-tertiary/50 mt-1">
                Font Size
              </div>
              <div className="px-3 py-2 flex items-center justify-between">
                <button
                  onClick={() => setFontSize('text-sm')}
                  className={`px-2 py-1 rounded ${settings.fontSize === 'text-sm' ? 'bg-background-tertiary text-content-primary' : 'text-content-secondary'}`}
                >
                  Small
                </button>
                <button
                  onClick={() => setFontSize('text-base')}
                  className={`px-2 py-1 rounded ${settings.fontSize === 'text-base' ? 'bg-background-tertiary text-content-primary' : 'text-content-secondary'}`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setFontSize('text-lg')}
                  className={`px-2 py-1 rounded ${settings.fontSize === 'text-lg' ? 'bg-background-tertiary text-content-primary' : 'text-content-secondary'}`}
                >
                  Large
                </button>
              </div>
              
              <div className="px-3 py-2 text-xs text-content-secondary border-b border-t border-background-tertiary/50 mt-1">
                Line Spacing
              </div>
              <div className="px-3 py-2 flex items-center justify-between">
                <button
                  onClick={() => setLineHeight('leading-normal')}
                  className={`px-2 py-1 rounded ${settings.lineHeight === 'leading-normal' ? 'bg-background-tertiary text-content-primary' : 'text-content-secondary'}`}
                >
                  Tight
                </button>
                <button
                  onClick={() => setLineHeight('leading-relaxed')}
                  className={`px-2 py-1 rounded ${settings.lineHeight === 'leading-relaxed' ? 'bg-background-tertiary text-content-primary' : 'text-content-secondary'}`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setLineHeight('leading-loose')}
                  className={`px-2 py-1 rounded ${settings.lineHeight === 'leading-loose' ? 'bg-background-tertiary text-content-primary' : 'text-content-secondary'}`}
                >
                  Loose
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={toggleFullscreen}
          className="icon-btn ml-2"
          aria-label={settings.fullscreenMode ? 'Exit fullscreen' : 'Enter fullscreen'}
          title={settings.fullscreenMode ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {settings.fullscreenMode ? <PanelLeftClose size={18} /> : <Maximize size={18} />}
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;