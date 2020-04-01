// import { IFile } from '../models/types'
import { CONF } from '../conf'
let API_ROOT = CONF.APP_API_URL.API_URL


// upload a single file as an attachment to a list item
export const upload = (container, file: any, fd:any, callback: (percent) => void) => {
  let promise = new Promise((resolve, reject) => {
    const url = API_ROOT+`/attachments/${container}/upload`

    let xhr = new XMLHttpRequest()

    if (callback) {
      xhr.addEventListener("progress" , e => {
        if (e.lengthComputable) {
          var percentage = Math.round((e.loaded * 100) / e.total)
          callback(percentage);
        }
      })
    }
    
    xhr.addEventListener("load", e => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(xhr.responseText)
        return
      }

      if (callback) {
        callback(100)
      }

      resolve(xhr.response)
    })

    xhr.addEventListener("error", e => {
      reject(xhr.responseText)
    })

    xhr.addEventListener("abort", e => {
      reject("upload aborted")
    })

    // Note: You need to add the event listeners before calling open() on the request. 
    // Otherwise the progress events will not fire.

    xhr.open("POST", url)          
    xhr.send(fd);   
  })

  return promise 
}
