
/**
 * Converts a Google Drive share link to a direct image URL.
 * @param url The Google Drive URL.
 * @returns A direct image URL or the original URL if it's not a Google Drive link.
 */
export const normalizeImageUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    // Regular expression to capture the file ID from various Google Drive URL formats
    const gDriveRegex = /https:\/\/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/;
    const match = url.match(gDriveRegex);

    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  } catch (e) {
    // Fallback to original url if regex fails
    return url;
  }

  // Return original URL if it's not a recognized Google Drive link
  return url;
};
