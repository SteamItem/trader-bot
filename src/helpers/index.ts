function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function compareStrings(s1: string, s2: string): boolean {
  s1 = s1.trim();
  s2 = s2.trim();
  if (s1.length !== s2.length) {
    return false;
  }
  return s1.localeCompare(s2) === 0;
}

export default {
  sleep,
  compareStrings
}