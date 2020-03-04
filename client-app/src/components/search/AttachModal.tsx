import * as React from 'react'
import * as Modal from 'react-modal'
import * as Dropzone from 'react-dropzone'

import { FileList } from './FileList'
import { CONF } from '../../conf'

import  './attachModal.css'

interface IAttachProps {
  files: Map<String, {}>
  addFiles: (list)=>any;
  removeFile: (string)=>any; 
  close: () => any;
}

interface IAttachState {
  allowedMimeTypes: string,
}

export class AttachModal extends React.Component<IAttachProps, IAttachState> {
   constructor(props) {
      super(props)
      this.state = {
           allowedMimeTypes: CONF.VENDOR_FILES_ATTACH.ALLOWED_MIME_TYPES.join()
      }
   }

   render() {    
     const {files, addFiles, removeFile, close} = this.props
     // The button should say "Close" if the user has not selected any files and "Attach Files" if they have
     const buttonText = (files && files.size) ? "Attach Files" : "Close"
     let modal = (
        <Modal isOpen={true} 
               contentLabel="Modal" 
               className="attachModal" 
               onRequestClose={close} 
               shouldCloseOnOverlayClick={false}>
          <h2>Attach Files</h2>
          <div className="warning">DO NOT ATTACH FILES WITH PHI</div>
          <Dropzone className="dropZone"
                    accept={this.state.allowedMimeTypes}
                    onDrop={addFiles} 
                    maxSize={CONF.VENDOR_FILES_ATTACH.MAX_FILE_SIZE}>
                  <div className="dropMsg">Drop files here or click here to select files</div>
                  <div className="finePrint">{`(Limit of ${CONF.VENDOR_FILES_ATTACH.MAX_FILES} files, .pptx, .docx, .xlsx, .pdf, images, ${CONF.VENDOR_FILES_ATTACH.MAX_FILE_SIZE_TEXT} max each)`}</div>
          </Dropzone>           
        </Modal>
    ) 

    return modal
  }
}