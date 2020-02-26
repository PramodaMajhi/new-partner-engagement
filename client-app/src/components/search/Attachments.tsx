import * as React from 'react'
import { connect } from 'react-redux'
import { Line } from 'rc-progress';
import AttachmentIcon from 'material-ui/svg-icons/file/attachment'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import { startGet } from "../../actions/get"
import { CONF } from '../../conf'
import { copyMap, mapToList } from '../../utils'
import { IFile } from '../../models/types'
import { PhaseEnum } from '.././shared'
import './attachments.css'
import  './attachModal.css'
import Dropzone from 'react-dropzone'

interface IAttachmentsProps {
  dispatch?: (any) => any,
}

interface IAttachmentsState {
  phase?: any,
  files?: [],
  showUploadProgress?: boolean,
  allowedMimeTypes?: string,

}

class attachments extends React.Component<IAttachmentsProps, IAttachmentsState> {

  constructor(props) {
    super(props)
    this.state = {
      phase: PhaseEnum.Filling,
      files: [],
      showUploadProgress: false,
      allowedMimeTypes: CONF.VENDOR_FILES_ATTACH.ALLOWED_MIME_TYPES.join()
    };
  }

  addFiles = (files) => {

    files.forEach(file => {
      console.log(file);
    })
    // call api for upload 
    this.setState({ files: files });

  }

  render() {

    let list = []
    this.state.files.forEach((v, k) => {
      list.push(<div className="uploadFile" key={k}>
        <Line percent={v.percent} strokeColor="green" />
        <div className="uploadName">{v.name}</div>
        {v.error && (<div className="uploadError">{v.error}</div>)}
      </div>)
    })
    let uploadList = (
      <div className="uploadList">
        {list}
      </div>
    )

    return (
      <div className="attachment">
        <h2>Attachments</h2>
        {uploadList}
        <Dropzone onDrop={this.addFiles} accept={this.state.allowedMimeTypes}>
          {({ getRootProps, getInputProps }) => (
            <section className="mt-5">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="dropMsg">Drop files here or click here to select files</div>
                <div className="finePrint">{`(Limit of ${CONF.VENDOR_FILES_ATTACH.MAX_FILES} files, .pptx, .docx, .xlsx, .pdf, images, ${CONF.VENDOR_FILES_ATTACH.MAX_FILE_SIZE_TEXT} max each)`}</div>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: IAttachmentsProps) => {

  const result = {

  }
  return result
}

export const Attachments = connect(mapStateToProps)(attachments)
