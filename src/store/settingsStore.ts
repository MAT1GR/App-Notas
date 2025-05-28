import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FontFamily = 'font-outfit' | 'font-inter' | 'font-serif' | 'font-mono';
export type FontSize = 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';
export type LineHeight = 'leading-relaxed' | 'leading-loose' | 'leading-normal';

interface Settings {
  font: FontFamily;
  fontSize: FontSize;
  lineHeight: LineHeight;
  fullscreenMode: boolean;
}

interface SettingsState {
  settings: Settings;
  setFont: (font: FontFamily) => void;
  setFontSize: (size: FontSize) => void;
  setLineHeight: (lineHeight: LineHeight) => void;
  toggleFullscreen: () => void;
  setFullscreen: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        font: 'font-outfit',
        fontSize: 'text-base',
        lineHeight: 'leading-relaxed',
        fullscreenMode: false,
      },
      
      setFont: (font) => set((state) => ({
        settings: { ...state.settings, font }
      })),
      
      setFontSize: (fontSize) => set((state) => ({
        settings: { ...state.settings, fontSize }
      })),
      
      setLineHeight: (lineHeight) => set((state) => ({
        settings: { ...state.settings, lineHeight }
      })),
      
      toggleFullscreen: () => set((state) => ({
        settings: { 
          ...state.settings, 
          fullscreenMode: !state.settings.fullscreenMode 
        }
      })),
      
      setFullscreen: (enabled) => set((state) => ({
        settings: { ...state.settings, fullscreenMode: enabled }
      })),
    }),
    {
      name: 'inkroom-settings',
    }
  )
);