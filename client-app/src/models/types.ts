
// the type returned by the browser (and Dropzone) for <input type of File
export interface IFile {
  name: string,
  size: number,
  preview: string,
  type: string,
  lastModified: number,
  lastModifiedDate: Date,
}
