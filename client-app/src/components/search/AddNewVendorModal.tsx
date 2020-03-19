import * as React from 'react'
import * as Modal from 'react-modal'
import { Row, Col, Button, Form } from 'react-bootstrap';
import url from 'url'
import Select from 'react-select';
import { businessUnitOptions, maturityLevelOptions, processStageOptions } from '.././shared'
import './AddNewVendorModal.css';
import { connect } from 'react-redux';
import uploadIcon from '../../img/Upload@2x.png'
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input/input'
import 'react-phone-number-input/style.css'

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
    businessUnitError?: boolean,
    maturityError?: boolean,
    domainError?: boolean,
    phone?: string,
    isValidPh?: boolean,
    vendor?: any


}

export class VendorModal extends React.Component<IAddNewVendorModalProps, IAddNewVendorModalState> {
    fileInput: HTMLInputElement;
    constructor(props) {
        super(props)
        this.state = {
            maturityLevel: null,
            businessUnit: null,
            processStage: {},
            selectedFile: [],
            businessUnitError: false,
            maturityError: false,
            domainError: false,
            phone: '',
            isValidPh: true,
            vendor: this.props ? this.props.singleVendor : []

        }
    }
    componentWillMount() {
        Modal.setAppElement('body')
    }
    componentDidMount() {
        Modal.setAppElement('body')
    }

    addVendor = (event) => {

        event.preventDefault();

        if (this.state.phone !== '') {
            let isValid = isPossiblePhoneNumber(this.state.phone)

            if (!isValid) {
                this.setState({ isValidPh: isValid })
                return
            }

        }

        let domainExist;
        if (!this.props.isEdit && this.props.vendors.length) {
            let urlObj = url.parse(event.currentTarget.website.value);
            domainExist = this.props.vendors.filter(v => {
                return v.domain === urlObj.hostname.toLowerCase()
            })

            if (domainExist.length) {
                this.setState({ domainError: true })
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
            this.setState({ businessUnitError: true })
        }

        this.state.vendor[0].businessUnit = businessUnit
        this.setState({ vendor: this.state.vendor })
    }

    fileChangedHandler = (event) => {
        this.setState({ selectedFile: event.target.files });
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
                                <Form.Label className="formLabel custom-formLabel">COMPANY NAME*</Form.Label>
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
                                <Form.Label className="formLabel custom-formLabel">COMPANY WEBSITE*</Form.Label>
                                <Form.Control
                                    required
                                    type="url"
                                    className="input-text-full mb-4"
                                    name="website" 
                                    value={vendor.website}
                                    onChange={(e) => this.handleInputChange(e, 'website')}
                                />
                                {this.state.domainError ? (<span className="duplicateDomain">Duplicate found. Please edit original entry</span>) : null}
                            </Col>

                            <Col xs={6}>
                                <div style={{padding: "40px 0px"}}>
                                    <img src={uploadIcon} onClick={() => this.fileInput.click()}
                                        style={{ height: '30px', width: '30px',  marginRight: '10px' }} />
                                    <Form.Label className="formLabel custom-formLabel">UPLOAD LOGO</Form.Label >
                                    <input style={{ display: 'none' }}
                                        type="file"
                                        onChange={this.fileChangedHandler}
                                        className="input-text-full mb-4"
                                        ref={fileInput => this.fileInput = fileInput}
                                    // value={this.state.singleVendor[0].website}
                                    // onChange={(e) => this.handleInputChange(e, 'file')}
                                    />
                                </div>
                            </Col>

                            <Col xs={12}>
                                <Form.Label className="formLabel custom-formLabel">COMPANY DESCRIPTION</Form.Label>
                                <Form.Control required as="textarea"
                                    className="mb-4"
                                    name="description"
                                    rows="3"
                                    placeholder="Write a brief description of what the company does..."
                                    value={vendor.description}
                                    onChange={(e) => this.handleInputChange(e, 'description')}
                                />
                            </Col>
                            <Col xs={12}>
                                <Form.Label className="formLabel custom-formLabel">FOCUS AREAS*</Form.Label>
                                <Form.Control type="text"
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
                                    style={{ borderColor: this.state.businessUnitError ? "#b94a48" : "#aaa" }}
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
