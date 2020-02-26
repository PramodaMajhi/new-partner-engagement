import * as React from 'react'

import  './attachModal.css'

export const FileList = (props) => {
   const {files, remove} = props

   let fileDiv = null
   if (files.size > 0) {
      let list = []
      let i = 0
      files.forEach((file, name) => {
          var ele = <div key={i++} className="file">                                        
                      {remove && (<div className="fileRemove" onClick={() => remove(name)}>&#x2573;</div>) }                                        
                      <div className="fileName">{name}</div>                                                                         
                    </div>
          list.push(ele)
      }) 

      fileDiv =  <div className="fileList">
                    <div>Files to be attached to vendor partner:</div>
                    <div>
                      {list}
                    </div>
                  </div> 
    } 
  
    return fileDiv
}



