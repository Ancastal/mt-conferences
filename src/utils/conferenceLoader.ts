import type { Conference } from "@/types/conference";

// Import all YAML files from the conferences directory
// This works with Vite's import.meta.glob feature
const conferenceModules = import.meta.glob('@/data/conferences/*.yml', { eager: true });

/**
 * Load all conferences from individual YAML files
 */
export function loadConferences(): Conference[] {
  const conferences: Conference[] = [];
  
  // Each module is a default export containing a single conference object
  Object.values(conferenceModules).forEach((module: any) => {
    if (module.default) {
      conferences.push(module.default);
    }
  });
  
  return conferences;
}

export default loadConferences; 