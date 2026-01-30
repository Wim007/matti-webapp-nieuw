/**
 * Action Detection Utility
 * 
 * Parses AI responses to detect actionable tips/advice.
 * AI Assistant is trained to tag actions with [ACTION: description] in responses.
 */

export interface DetectedAction {
  actionText: string;
  cleanResponse: string; // Response with [ACTION] tag removed
}

/**
 * Parse AI response for action tags
 * Format: [ACTION: description]
 * 
 * Example:
 * Input: "Dat klinkt moeilijk. [ACTION: Praat morgen met je leraar] Succes!"
 * Output: { actionText: "Praat morgen met je leraar", cleanResponse: "Dat klinkt moeilijk. Succes!" }
 */
export function detectAction(aiResponse: string): DetectedAction | null {
  const actionRegex = /\[ACTION:\s*([^\]]+)\]/i;
  const match = aiResponse.match(actionRegex);

  if (!match) {
    return null;
  }

  const actionText = match[1].trim();
  const cleanResponse = aiResponse.replace(actionRegex, '').trim();

  console.log('[ActionDetection] Detected action:', actionText);

  return {
    actionText,
    cleanResponse,
  };
}

/**
 * Check if response contains an action
 */
export function hasAction(aiResponse: string): boolean {
  return /\[ACTION:\s*[^\]]+\]/i.test(aiResponse);
}
