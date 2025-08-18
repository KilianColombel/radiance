import { customizeGlobalCursorStyles, type CustomCursorStyleConfig } from "react-resizable-panels";
import { useLayoutEffect } from 'react';

export function useCustomCursor() {
  useLayoutEffect(() => {
    function customCursor({ isPointerDown }: CustomCursorStyleConfig) {
      return isPointerDown ? "grabbing" : "grab";
    }
    customizeGlobalCursorStyles(customCursor);

    return () => {
      customizeGlobalCursorStyles(null);
    };
  }, []);
}