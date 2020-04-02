import * as React from 'react'
import * as Modal from 'react-modal'
import { Row, Col, Button, Form } from 'react-bootstrap';
import url from 'url'
import psl from 'psl'
import Select from 'react-select';
import { businessUnitOptions, maturityLevelOptions, processStageOptions } from '.././shared'
import './AddNewVendorModal.css';
import { connect } from 'react-redux';
import uploadIcon from '../../img/Upload@2x.png'
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input/input'
import 'react-phone-number-input/style.css'
import profileLarge from '../../img/profile-lg@2x.png';
import ReactGA from 'react-ga'
import { GADataLayer, domainAndUrl } from '../../utils'
interface IAddNewVendorModalProps {
    vendors?: any,
    singleVendor?: any,
    isEdit?: boolean,
    addVendor?: (vendor, profileImg: any) => any,
    close?: (name: any) => any,
    dispatch?: (name: any) => any,
}

interface IAddNewVendorModalState {
    maturityLevel?: any,
    businessUnit?: any,
    processStage?: any,
    selectedFile?: [],
    isFileVerified?: boolean,
    maturityError?: boolean,
    domainError?: boolean,
    phone?: string,
    isValidPh?: boolean,
    vendor?: any,
    imagePreviewUrl?: any,


}

const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() })

export class VendorModal extends React.Component<IAddNewVendorModalProps, IAddNewVendorModalState> {
    fileInput: HTMLInputElement;
    constructor(props) {
        super(props)
        this.state = {
            maturityLevel: null,
            businessUnit: null,
            processStage: {},
            selectedFile: [],
            isFileVerified: false,
            maturityError: false,
            domainError: false,
            phone: '',
            isValidPh: true,
            imagePreviewUrl: '',
            vendor: this.props ? this.props.singleVendor : []

        }
    }
    componentWillMount() {
        Modal.setAppElement('body')
    }
    componentDidMount() {
        Modal.setAppElement('body')
        // ReactGA.modalview('edit-profile');
        // GA tag
        let dataLayer = GADataLayer();
        dataLayer.push({
            'event': 'virtualPageView',
            'pageName': 'view-profile-modal'
        });
    }

    addVendor = (event) => {

        event.preventDefault();

        const website = event.currentTarget.website.value;
        const vendorName = event.currentTarget.vendorName.value;
        const values = domainAndUrl(website);
        const domain = values[1];
        let domainExist;
        if (this.props.vendors.length) {
            
            domainExist = this.props.vendors.filter(v => {
                return v.domain === domain || v.vendorName === vendorName
            })

            if (domainExist.length) {
                if (this.props.isEdit && (this.state.vendor[0].id === domainExist[0].id)) {
                    this.setState({ domainError: false })
                } else {
                    this.setState({ domainError: true })
                    return
                }
            }
        }

        this.props.addVendor(this.state.vendor[0], this.state.selectedFile);
        this.props.close(false); // closing popup          
    }

    handleMaturityChange = maturityLevel => {
        this.setState({ maturityLevel: maturityLevel });
        if (maturityLevel === null) {
            this.setState({ maturityError: true })
        }
        this.state.vendor[0].maturityLevel = maturityLevel
        this.setState({ vendor: this.state.vendor })
    };

    handleProcessStage = processStage => {
        this.setState({ processStage: processStage });
        this.state.vendor[0].processStage = processStage
        this.setState({ vendor: this.state.vendor })
    };

    handleFuncAreaChange = (businessUnit) => {
        this.setState({ businessUnit: businessUnit });
        if (businessUnit === null) {
            this.setState({ isFileVerified: true })
        }

        this.state.vendor[0].businessUnit = businessUnit
        this.setState({ vendor: this.state.vendor })
    }

    fileChangedHandler = (event) => {
        event.preventDefault();
        this.setState({ selectedFile: event.target.files });
        let reader = new FileReader();
        let file = event.target.files[0];
        const currentFileType = file.type
        if (!acceptedFileTypesArray.includes(currentFileType)) {
            this.setState({ isFileVerified: true })
            return false
        }

        reader.onload = () => {
            this.setState({ imagePreviewUrl: reader.result });
        }

        reader.readAsDataURL(file)
    }

    setPhoneNumber = (phone) => {
        this.state.vendor[0].vendorContact.phone = phone
        this.setState({ vendor: this.state.vendor })
    }

    handleInputChange = (e, property) => {
        e.preventDefault()
        this.setState({ vendor: [...this.state.vendor] })
        const tempObj = this.state.vendor[0]
        tempObj[property] = e.target.value
        this.setState({ vendor: this.state.vendor })
    }

    handleNestedInputChange = (e, property) => {
        e.preventDefault()
        this.setState({ vendor: [...this.state.vendor] })
        const tempObj = this.state.vendor[0].vendorContact
        tempObj[property] = e.target.value
        this.setState({ vendor: this.state.vendor })
    }

    render() {
        const { close, isEdit } = this.props
        const vendor = this.state.vendor[0]
        let { imagePreviewUrl } = this.state;
        let imagPreview = null;
        let uploadLabel = this.props.isEdit ? "UPLOAD NEW LOGO" : "UPLOAD LOGO"
        if (imagePreviewUrl) {
            imagPreview = (<div className="edit-logo" onClick={() => this.fileInput.click()}>
                <div className="profile-Img"
                    style={{ background: `url(${imagePreviewUrl})` }}>
                </div>
                <Form.Label className="formLabel custom-formLabel">UPLOAD NEW LOGO</Form.Label >
            </div>)

        } else {
            imagPreview = (<div style={{ display: 'flex', alignItems: 'center' }} onClick={() => this.fileInput.click()}>
                {isEdit ?
                    (<div>
                        <div className="profile-Img"
                            style={{ background: `url(${vendor.profileLogo || profileLarge})` }}>
                        </div>
                    </div>) :
                    <div>
                        <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', marginTop: '-12px' }}>
                            <path d="M20.1504 6.83398C20.002 4.68164 18.2207 2.9375 16.0312 2.9375C15.7344 2.9375 15.4375 2.97461 15.1777 3.04883C13.9902 1.56445 12.1719 0.5625 10.0938 0.5625C6.93945 0.5625 4.30469 2.78906 3.67383 5.75781C1.44727 6.68555 0 8.83789 0 11.25C0 14.5527 2.63477 17.1875 5.9375 17.1875H18.4062C21.3379 17.1875 23.75 14.8125 23.75 11.8438C23.75 9.58008 22.2656 7.57617 20.1504 6.83398ZM18.4062 15.4062H5.9375C3.63672 15.4062 1.78125 13.5508 1.78125 11.25C1.78125 9.17188 3.30273 7.42773 5.34375 7.16797V7.09375C5.34375 4.49609 7.45898 2.34375 10.0938 2.34375C12.0605 2.34375 13.7676 3.56836 14.4727 5.3125C14.8809 4.94141 15.4375 4.71875 16.0312 4.71875C17.3301 4.71875 18.4062 5.79492 18.4062 7.09375C18.4062 7.53906 18.2578 7.94727 18.0723 8.31836C18.1836 8.31836 18.2949 8.28125 18.4062 8.28125C20.373 8.28125 21.9688 9.87695 21.9688 11.8438C21.9688 13.8105 20.373 15.4062 18.4062 15.4062ZM10.9844 4.97852C10.7988 4.79297 10.5391 4.79297 10.3535 4.97852L6.49414 8.83789C6.30859 9.02344 6.30859 9.2832 6.49414 9.46875L7.125 10.0996C7.31055 10.2852 7.57031 10.2852 7.75586 10.0996L9.79688 8.02148V13.1797C9.79688 13.4395 9.98242 13.625 10.2422 13.625H11.1328C11.3555 13.625 11.5781 13.4395 11.5781 13.1797V8.02148L13.582 10.0996C13.7676 10.2852 14.0273 10.2852 14.2129 10.0996L14.8438 9.46875C15.0293 9.2832 15.0293 9.02344 14.8438 8.83789L10.9844 4.97852Z" fill="#8392A5" />
                        </svg>
                    </div>
                }
                <Form.Label className="formLabel custom-formLabel">{uploadLabel}</Form.Label >
            </div>)


        }

        let buttonLabel = isEdit ? 'SAVE' : 'CREATE'
        const modal = (
            <Modal isOpen={true}
                contentLabel="Modal"
                className="treatmentSetModal"
                onRequestClose={close}
                shouldCloseOnOverlayClick={false} >
                <div className="container">

                    <div>
                        <h2 className="addSurveyHeader">
                            {this.props.isEdit ? 'Edit Partner' : ' Add New Partner'}
                        </h2>
                    </div>
                    <Form onSubmit={this.addVendor}>
                        <Row>
                            <Col xs={12}>
                                <Form.Label className="formLabel custom-formLabel">COMPANY NAME<span className="required-text">(Required)</span></Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="vendorName"
                                    value={vendor.vendorName}
                                    className="input-text-full mb-4"
                                    onChange={(e) => this.handleInputChange(e, 'vendorName')}
                                />
                            </Col>

                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">COMPANY WEBSITE<span className="required-text">(Required)</span></Form.Label>
                                {
                                    // The pattern works in all scenarios below
                                    // "yahoo.com";
                                    // "www.yahoo.com";
                                    // "http://www.yahoo.com";
                                    // "yahoo.org";
                                    // "somesite.org"
                                    // "www.somesite.org"
                                    // "http://somesite.org"
                                    // "https://www.somesite.org"
                                    // "somesite.org?case=1"
                                }
                                <Form.Control
                                    required
                                    type="input"
                                    pattern="^(?:https?://|s?ftps?://)?(?!www | www\.)[A-Za-z0-9_-]+\.+[A-Za-z0-9.\/%&=\?_:;-]+$"
                                    className="input-text-full mb-4"
                                    name="website"
                                    value={vendor.website}
                                    onChange={(e) => this.handleInputChange(e, 'website')}
                                />
                                <>
                                    {this.state.domainError ?
                                        (<Row className="duplicateDomain">Duplicate found. Please edit original entry</Row>) :
                                        null
                                    }
                                </>
                                <>
                                    {this.state.isFileVerified ?
                                        (<Row className="duplicateDomain">Uploaded file is not a valid image. Only JPG, PNG and GIF files are allowed.</Row>) :
                                        null
                                    }
                                </>
                            </Col>

                            <Col xs={6}>
                                <div style={{ padding: "40px 0px" }}>
                                    {imagPreview}
                                    <input style={{ display: 'none' }}
                                        type="file"
                                        onChange={this.fileChangedHandler}
                                        accept={acceptedFileTypes}
                                        className="input-text-full mb-4"
                                        ref={fileInput => this.fileInput = fileInput}
                                    />
                                </div>
                            </Col>

                            <Col xs={12}>
                                <Form.Label className="formLabel custom-formLabel">BSC FOCUS AREAS<span className="required-text">(Required)</span></Form.Label>
                                <Form.Control required type="text"
                                    name="keyFocusArea"
                                    className="input-text-full mb-4"
                                    value={vendor.keyFocusArea}
                                    placeholder="Example: AI, Maternity, Robotics..."
                                    onChange={(e) => this.handleInputChange(e, 'keyFocusArea')}
                                />
                            </Col>
                            <Col xs={12}>
                                <Form.Label className="formLabel custom-formLabel">BSC BUSINESS UNITS - Who is working with this partner?</Form.Label>
                                <Select required
                                    options={businessUnitOptions} isMulti={true}
                                    value={vendor.businessUnit}
                                    onChange={this.handleFuncAreaChange}
                                    lassNamePrefix="assignSelect"
                                    name="businessUnit"
                                    className="mb-4"
                                    style={{ borderColor: this.state.isFileVerified ? "#b94a48" : "#aaa" }}
                                />
                            </Col>
                            <Col xs={12}>
                                <Form.Label className="formLabel custom-formLabel">COMPANY DESCRIPTION</Form.Label>
                                <Form.Control as="textarea"
                                    className="mb-4"
                                    name="description"
                                    rows="4"
                                    placeholder="Write a brief description of what the company does..."
                                    value={vendor.description}
                                    onChange={(e) => this.handleInputChange(e, 'description')}
                                />
                            </Col>
                        </Row>
                        <br />
                        <Row className="justify-content-end mb-5">
                            <Col className="col-12 save-cancel-button">
                                <Button onClick={this.props.close} variant="light" className="cancel-button">CANCEL</Button>
                                <Button type="submit" variant="primary" size="lg">{buttonLabel}</Button>
                            </Col>
                            <br />
                        </Row>
                    </Form>
                </div>
            </Modal>
        )
        return modal
    }

}

const mapStateToProps = (state: any, ownProps: IAddNewVendorModalProps) => {

    return {
    }
}

export const AddNewVendorModal = connect(mapStateToProps)(VendorModal);
