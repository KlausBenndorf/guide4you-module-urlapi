export function assertRelativePath (value) {
  if (value.match(/^(?:[a-z]+:)?\/\//i)) {
    throw new Error('The provided conf parameter is absolute. Only relative paths are allowed.')
  }
}
