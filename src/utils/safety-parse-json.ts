export default function safelyParseJSON(json: any): any {
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    // console.error(e);
  }
  return parsed;
}
