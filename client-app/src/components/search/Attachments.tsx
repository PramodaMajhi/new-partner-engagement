import * as React from 'react'
import { connect } from 'react-redux'
import { Line } from 'rc-progress';
import AttachmentIcon from 'material-ui/svg-icons/file/attachment'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import { startGet } from "../../actions/get"
import { startMerge } from "../../actions/merge"
import { startUpload } from "../../actions/upload"
import { CONF } from '../../conf'
import { copyMap, mapToList } from '../../utils'
import { IFile } from '../../models/types'
import { PhaseEnum } from '.././shared'
import './attachments.css'
import './attachModal.css'
import Dropzone from 'react-dropzone'

interface IAttachmentsProps {
  vendor?: any,
  upload?: any,
  attachments?: any,
  dispatch?: (any) => any,
}

interface IAttachmentsState {
  phase?: any,
  files?: [],
  error?:string,
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
    this.uploadFiles();

  }

  uploadFiles = async () => {
    this.setState({
      phase: PhaseEnum.Uploading,
      showUploadProgress: true
    })
    await startUpload(this.props.vendor[0].id, this.state.files)(this.props.dispatch)

    let attachments = [...this.props.vendor[0].attachments]
    let serverRelativeUrl = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://localhost:3001/api'

    this.props.upload.files.forEach((v, k) => {

      let fileAttachObj = {
        fileName: v.name,
        serverRelativeUrl: `${serverRelativeUrl}/attachments/${this.props.vendor[0].id}/download/${v.name}`,
      }
      const found = attachments.find(({ fileName }) => {
        return fileName === v.name
      })
      if (!found) {
        attachments.push(fileAttachObj)
      }else {
        this.setState({error:'Duplicate file'})
      }

    })


    let vendorObj = {
      id: this.props.vendor[0].id,
      attachments: attachments
    }
    await startMerge('vendors', vendorObj)
    this.props.dispatch(startGet('vendors'));
    this.setState({ phase: PhaseEnum.Complete })
    setTimeout(() => {
      this.setState({ showUploadProgress: false })
    }, 1000)


  }

  deleteFile = (fileName: string) => {
    console.log("file name to be deleted", fileName);
    return
  }
  render() {
    const { vendor } = this.props
    let list = []
    this.props.upload.files.forEach((v, k) => {
      list.push(<div className="uploadFile" key={k}>
        <Line percent={v.percent} strokeColor="green" />
        <div className="uploadName">{v.name}</div>
        {v.error || this.state.error && (<div className="uploadError">{v.error || this.state.error}</div>)}
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
        {this.state.showUploadProgress && uploadList}
        <div className="list">
          {
            (vendor && vendor[0].attachments.length)
              ? (vendor[0].attachments.map((a, i) => {
                return (
                  <div key={i} className="attachmentsDetail">
                    <div className="fileName">
                      <a href={a.serverRelativeUrl} target="_blank">{a.fileName}</a>
                    </div>
                    <div className="fileDelete">
                      {/* <DeleteIcon onClick={() => this.deleteFile(a.fileName)} /> */}
                    </div>
                  </div>
                )
              }))
              : (<div className="empty">There are no attachments for this idea</div>)
          }
        </div>

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
  let upload = state.upload
  const result = {
    upload: upload,
  }
  return result
}

export const Attachments = connect(mapStateToProps)(attachments)
