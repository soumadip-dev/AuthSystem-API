declare module '*.svg' {
  const content: string; // This means: when I import an SVG, it’s a string
  export default content;
}

declare module '*.png' {
  const content: string; // Same for PNG
  export default content;
}

declare module '*.jpg' {
  const content: string; // Same for JPG
  export default content;
}

declare module '*.jpeg' {
  const content: string; // Same for JPEG
  export default content;
}
