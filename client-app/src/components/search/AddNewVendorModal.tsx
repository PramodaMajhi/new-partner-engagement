import * as React from 'react'
import * as Modal from 'react-modal'
import { Row, Col, Button, Form } from 'react-bootstrap';
import url from 'url'
import Select from 'react-select';
import { businessUnitOptions, maturityLevelOptions, processStageOptions } from '.././shared'
import './AddNewVendorModal.css';
import { connect } from 'react-redux';
import uploadIcon from '../../img/Upload@2x.png'
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl, isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'


interface IAddNewVendorModalProps {
    options?: any[],
    vendors?: any,
    addVendor?: (formData: any, businessUnit: any, maturityLevel: any, processStage: any, profileImg: any, phone: any) => any,
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
    phoneError?: string,


}

export class VendorModal extends React.Component<IAddNewVendorModalProps, IAddNewVendorModalState> {
    constructor(props) {
        super(props)
        this.state = {
            maturityLevel: null,
            businessUnit: null,
            processStage: null,
            selectedFile: [],
            businessUnitError: false,
            maturityError: false,
            domainError: false,
            phone: '',
            phoneError: '',
        }
    }
    componentWillMount() {
        Modal.setAppElement('body')
    }
    componentDidMount() {
        Modal.setAppElement('body')
    }

    addVendor = (event) => {
        if (isValidPhoneNumber(this.state.phone)) {
            this.setState({ phoneError: "Enter valid phone#" })
        }

        event.preventDefault();
        let domainExist;
        if (this.props.vendors.length) {
            let urlObj = url.parse(event.currentTarget.website.value);
            domainExist = this.props.vendors.filter(v => {
                return v.domain === urlObj.hostname.toLowerCase()
            })

            if (domainExist.length) {
                this.setState({ domainError: true })
            }
        }

        if (this.state.businessUnitError || this.state.maturityError || domainExist.length === 0) {
            const form = event.currentTarget;
            this.props.addVendor(form, this.state.businessUnit, this.state.maturityLevel, this.state.processStage, this.state.selectedFile, this.state.phone);
            this.props.close(false); // closing popup            
        }
        if (this.state.businessUnit === null) {
            this.setState({ businessUnitError: true })
        }
        if (this.state.maturityLevel === null) {
            this.setState({ maturityError: true })
        }

    }

    handleChange = maturityLevel => {
        this.setState({ maturityLevel: maturityLevel });
        if (maturityLevel === null) {
            this.setState({ maturityError: true })
        }
    };

    handleProcessStage = processStage => {
        this.setState({ processStage: processStage });
    };

    handleMultiChange = (businessUnit) => {
        this.setState({ businessUnit: businessUnit });
        if (businessUnit === null) {
            this.setState({ businessUnitError: true })
        }
    }

    fileChangedHandler = (event) => {
        this.setState({ selectedFile: event.target.files });
    }

    setPhoneNumber = (phone) => {
        this.setState({ phone: phone });
    }

    render() {
        const { close, options } = this.props
        const { } = this.state;
        let isValid 
        if(this.state.phone!==null) { 
             isValid = isValidPhoneNumber(this.state.phone)    
        }
        
        console.log(isValid)
        const modal = (
            <Modal isOpen={true}
                contentLabel="Modal"
                className="treatmentSetModal"
                onRequestClose={close}
                shouldCloseOnOverlayClick={false} >
                <div className="container">

                    <div>
                        <h2 className="addSurveyHeader">Add New Partner</h2>
                    </div>
                    <Form onSubmit={this.addVendor}>
                        <Row>
                            <Col >
                                <Form.Label className="formLabel custom-formLabel">COMPANY NAME*</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="name"
                                    className="mb-4"
                                    placeholder="Company Name"
                                />
                            </Col>
                            <Col xs={12}>
                                <Form.Label className="formLabel custom-formLabel">DESCRIPTION*</Form.Label>
                                <Form.Control required as="textarea" className="mb-4" name="description" rows="3" placeholder="Description" />
                            </Col>
                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">WEBSITE*</Form.Label>
                                <Form.Control
                                    required
                                    type="url"
                                    className="mb-4"
                                    name="website" placeholder="Site url" />
                                {this.state.domainError ? (<span className="duplicateDomain">Duplicate found. Please edit original entry</span>) : null}
                            </Col>

                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">UPLOAD PROFILE IMAGE*</Form.Label>
                                <input style={{ display: 'none' }}
                                    type="file"
                                    onChange={this.fileChangedHandler}
                                    ref={fileInput => this.fileInput = fileInput}
                                />
                                <img src={uploadIcon} onClick={() => this.fileInput.click()} />
                            </Col>
                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">FUNCTIONAL AREAS*</Form.Label>
                                <Select required
                                    value={this.state.businessUnit}
                                    options={options} isMulti={true}
                                    onChange={this.handleMultiChange}
                                    lassNamePrefix="assignSelect"
                                    name="businessUnit"
                                    className="mb-4"
                                    style={{ borderColor: this.state.businessUnitError ? "#b94a48" : "#aaa" }}
                                />
                            </Col>
                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">MATURITY LEVEL*</Form.Label>
                                <Select required
                                    value={this.state.maturityLevel}
                                    options={maturityLevelOptions}
                                    onChange={this.handleChange}
                                    lassNamePrefix="assignSelect"
                                    name="maturityLevel"
                                    className="mb-4"
                                    style={{ borderColor: this.state.maturityError ? "#b94a48" : "#aaa" }}
                                />
                            </Col>

                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">KEY FOCUS AREA</Form.Label>
                                <Form.Control type="text" name="keyfocus" className="mb-4" />
                            </Col>

                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">PARTNERSHIP PROCESS STAGE</Form.Label>
                                <Select
                                    value={this.state.processStage}
                                    options={processStageOptions}
                                    onChange={this.handleProcessStage}
                                    lassNamePrefix="assignSelect"
                                    name="stage"
                                    className="mb-4"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">COMPANY CONTACT PERSON</Form.Label>
                                <Form.Control type="text" name="contactName" className="mb-4" />
                            </Col>
                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">TITLE</Form.Label>
                                <Form.Control type="text" name="title" className="mb-4" />
                            </Col>
                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">EMAIL</Form.Label>
                                <Form.Control type="email" name="email" className="mb-4" />
                            </Col>
                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">PHONE</Form.Label>
                                {/* <Form.Control type="text" name="phone" className="mb-4" /> */}
                                <PhoneInput
                                    defaultCountry="US"
                                    // className="PhoneInputInput"
                                    value={this.state.phone}
                                    onChange={this.setPhoneNumber} />

                                    {
                                        isValid ?  null : <span style={{color:'red'}}></span>
                                    }
                            </Col>
                        </Row>

                        <br />
                        <Row className="justify-content-end">
                            <Col className="col-12 save-cancel-button">
                                <Button onClick={this.props.close} className="cancel-button">CANCEL</Button>
                                <Button type="submit">SAVE</Button>
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
