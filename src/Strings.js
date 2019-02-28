const capitalizeString = str =>
  str
    .charAt(0)
    .toUpperCase()
    .concat(str.slice(1));

const replaceDashWithSpace = str => str.replace(/-/g, ' ');

const cleanString = str => capitalizeString(replaceDashWithSpace(str));

export { capitalizeString, replaceDashWithSpace, cleanString };
