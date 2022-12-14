export const parseNumberFromRegex = (text: string, regex: RegExp, defaultValue: number): number => {
  const matches = text.match(regex);
  return matches ? parseInt(matches[1], 10) : defaultValue;
};
export const parseFloatFromRegex = (text: string, regex: RegExp, defaultValue: number): number => {
  const matches = text.match(regex);
  return matches ? parseFloat(matches[1]) : defaultValue;
};
export const parseStringFromRegex = (text: string, regex: RegExp, defaultValue: string): string => {
  const matches = text.match(regex);
  return matches ? matches[1] : defaultValue;
};

export const replaceAll = (text: string, regexes: RegExp[], replace: string = ""): string =>
  regexes.reduce((soFar, regex) => soFar.replace(regex, replace), text);

export const replaceOrAppend = (text: string, regex: RegExp, replace: string = ""): string => {
  return text.match(regex) ? text.replace(regex, replace) : text.concat(replace);
};
