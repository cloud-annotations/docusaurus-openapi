// Utility functions
export const isURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) { return false }
}
