import * as React from 'react'
import { connect } from 'react-redux'
import { Line } from 'rc-progress';
import AttachmentIcon from 'material-ui/svg-icons/file/attachment'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import { startGet } from "../../actions/get"
import { startMerge } from "../../actions/merge"
import { startUpload } from "../../actions/upload"
import { CONF } from '../../conf'
import { GADataLayer } from '../../utils'
import { IFile } from '../../models/types'
import { PhaseEnum } from '.././shared'
import './attachments.css'
import './attachModal.css'
import ellipsisIcon from '../../img/Ellipsis.png';
import { Dropdown } from 'react-bootstrap';
import Dropzone from 'react-dropzone'

interface IAttachmentsProps {
  vendor?: any,
  upload?: any,
  attachments?: any,
  isLimitedUser?: boolean,
  dispatch?: (any) => any,
}

interface IAttachmentsState {
  phase?: any,
  files?: [],
  error?: string,
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

  componentDidMount() {
    // let dataLayer = GADataLayer();
    // dataLayer.push({
    //   'event': 'virtualPageView',
    //   'pageName': 'view-attachment'
    // });
  }

  getDateAndYear = (date) => {
    if (date === undefined) {
      return '';
    }
    var time = new Date(date);
    return time.toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }

  uploadFiles = async () => {
    this.setState({
      phase: PhaseEnum.Uploading,
      showUploadProgress: true
    })
    await startUpload(this.props.vendor[0].id, this.state.files)(this.props.dispatch)

    let attachments = [...this.props.vendor[0].attachments]
    let serverRelativeUrl = CONF.APP_API_URL.API_URL
    let localStoreCurrUser = JSON.parse(localStorage.getItem("loggedinUser"))
    this.props.upload.files.forEach((v, k) => {

      let fileAttachObj = {
        fileName: v.name,
        serverRelativeUrl: `${serverRelativeUrl}/attachments/${this.props.vendor[0].id}/download/${v.name}`,
        firstName: localStoreCurrUser.firstName,
        lastName: localStoreCurrUser.lastName,
        id: localStoreCurrUser.id,
        uploadDate: new Date(),
      }
      const found = attachments.find(({ fileName }) => {
        return fileName === v.name
      })
      if (!found) {
        attachments.push(fileAttachObj)
      } else {
        this.setState({ error: 'Duplicate file' })
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
    let dataLayer = GADataLayer();

    dataLayer.push({
      'event': 'virtualPageView',
      'pageName': 'file-attached'
    });

  }

  deleteFile = (fileName: string) => {
    console.log("file name to be deleted", fileName);
    return
  }
  render() {
    const { vendor, isLimitedUser } = this.props
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
        {this.state.showUploadProgress && uploadList}
        <div className="list">
          {
            (vendor && vendor[0].attachments.length)
              ? (vendor[0].attachments.map((a, i) => {
                return (
                  <div key={i} className="attachmentsDetail">
                    <div className="fileName">
                      <a href={a.serverRelativeUrl} target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 14 15" style={{ marginRight: '8px', fill: '#1C2D41' }}>
                          <path d="M2.17578 13.5195C3.78906 15.1602 6.41406 15.1875 8.05469 13.5195L12.7578 8.70703C12.9219 8.54297 12.9219 8.26953 12.7305 8.10547L12.1016 7.47656C11.9375 7.3125 11.6641 7.3125 11.5 7.47656L6.79688 12.2891C5.86719 13.2461 4.36328 13.2461 3.43359 12.2891C2.50391 11.332 2.50391 9.74609 3.46094 8.78906L9.20312 2.91016C9.72266 2.39062 10.5703 2.39062 11.0898 2.91016C11.6094 3.45703 11.6094 4.35938 11.0898 4.90625L6.08594 10.0195C5.97656 10.1289 5.78516 10.1289 5.64844 10.0195C5.53906 9.88281 5.53906 9.63672 5.67578 9.5L9.61328 5.50781C9.77734 5.31641 9.77734 5.04297 9.58594 4.87891L8.98438 4.27734C8.79297 4.08594 8.51953 4.11328 8.35547 4.27734L4.41797 8.29688C3.625 9.08984 3.59766 10.4023 4.39062 11.2227C5.18359 12.0703 6.52344 12.0703 7.34375 11.25L12.3477 6.13672C13.5508 4.90625 13.5234 2.91016 12.3477 1.67969C11.1172 0.449219 9.14844 0.449219 7.94531 1.67969L2.20312 7.55859C0.589844 9.19922 0.5625 11.8516 2.17578 13.5195Z" />
                        </svg>
                        {a.fileName}
                      </a>
                    </div>
                    {
                      a.uploadDate !== undefined ?
                        <div className="fileDelete">
                          <div className="uploadedUserName">
                            {a.firstName + ' ' + a.lastName}
                            <span style={{ marginRight: '5px', marginLeft: '5px' }}>&#183;</span>{this.getDateAndYear(a.uploadDate)}
                          </div>
                          <div>
                            {/* <img src={ellipsisIcon} style={{ width: '20px', height: '6px' }} /> */}
                          </div>
                        </div> : null
                    }

                  </div>
                )
              }))
              : (<div className="empty">There are no attachments for this partner</div>)
          }
        </div>
        {
          !isLimitedUser ?
            <>
              <Dropzone onDrop={this.addFiles} accept={this.state.allowedMimeTypes}>
                {({ getRootProps, getInputProps }) => (
                  <section className="">
                    <div {...getRootProps()} className="drop-area">
                      <input {...getInputProps()} />
                      <div className="dropMsg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" style={{ marginRight: '8px' }}>
                          <path d="M2.17578 13.5195C3.78906 15.1602 6.41406 15.1875 8.05469 13.5195L12.7578 8.70703C12.9219 8.54297 12.9219 8.26953 12.7305 8.10547L12.1016 7.47656C11.9375 7.3125 11.6641 7.3125 11.5 7.47656L6.79688 12.2891C5.86719 13.2461 4.36328 13.2461 3.43359 12.2891C2.50391 11.332 2.50391 9.74609 3.46094 8.78906L9.20312 2.91016C9.72266 2.39062 10.5703 2.39062 11.0898 2.91016C11.6094 3.45703 11.6094 4.35938 11.0898 4.90625L6.08594 10.0195C5.97656 10.1289 5.78516 10.1289 5.64844 10.0195C5.53906 9.88281 5.53906 9.63672 5.67578 9.5L9.61328 5.50781C9.77734 5.31641 9.77734 5.04297 9.58594 4.87891L8.98438 4.27734C8.79297 4.08594 8.51953 4.11328 8.35547 4.27734L4.41797 8.29688C3.625 9.08984 3.59766 10.4023 4.39062 11.2227C5.18359 12.0703 6.52344 12.0703 7.34375 11.25L12.3477 6.13672C13.5508 4.90625 13.5234 2.91016 12.3477 1.67969C11.1172 0.449219 9.14844 0.449219 7.94531 1.67969L2.20312 7.55859C0.589844 9.19922 0.5625 11.8516 2.17578 13.5195Z" />
                        </svg>
                          DRAG YOUR ATTACHMENT HERE, OR <span style={{ color: '#0095DA' }}>BROWSE</span>
                      </div>
                      <div className="finePrint">{`(Files  .pptx, .docx, .xlsx, .pdf, images`}</div>
                    </div>
                  </section>
                )}
              </Dropzone>
            </> : null
        }

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
