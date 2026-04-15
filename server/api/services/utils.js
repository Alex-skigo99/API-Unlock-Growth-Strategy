/**
 * Extracts the first JSON object from an LLM response string.
 * Handles cases where the AI wraps JSON in markdown code blocks or extra text.
 */
export const extractJsonFromString = (str) => {
  const jsonRegex = /{[^}]*}/;
  const match = str.match(jsonRegex);
  if (match) {
    try {
      const jsonString = match[0];
      const jsonObject = JSON.parse(jsonString.replace(/(\w+):/g, '"$1":'));
      return jsonObject;
    } catch (e) {
      console.error("Error parsing JSON:", e);
      return "";
    }
  }
  console.warn("No JSON object found in the string");
  return "";
};
