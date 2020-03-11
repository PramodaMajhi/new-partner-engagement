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
    options?: any[],
    vendors?: any,
    singleVendor?: any,
    isEdit?: boolean,
    addVendor?: (singleVendor, profileImg: any) => any,
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
    singleVendor?: any


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
            singleVendor: this.props ? this.props.singleVendor : []

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

        this.props.addVendor(this.state.singleVendor[0], this.state.selectedFile);
        this.props.close(false); // closing popup            


    }

    handleMaturityChange = maturityLevel => {
        this.setState({ maturityLevel: maturityLevel });
        if (maturityLevel === null) {
            this.setState({ maturityError: true })
        }
        this.state.singleVendor[0].maturityLevel = maturityLevel
        this.setState({ singleVendor: this.state.singleVendor })
    };

    handleProcessStage = processStage => {
        this.setState({ processStage: processStage });
        this.state.singleVendor[0].processStage = processStage
        this.setState({ singleVendor: this.state.singleVendor })
    };

    handleFuncAreaChange = (businessUnit) => {
        this.setState({ businessUnit: businessUnit });
        if (businessUnit === null) {
            this.setState({ businessUnitError: true })
        }

        this.state.singleVendor[0].businessUnit = businessUnit
        this.setState({ singleVendor: this.state.singleVendor })
    }

    fileChangedHandler = (event) => {
        this.setState({ selectedFile: event.target.files });
    }

    setPhoneNumber = (phone) => {
        this.state.singleVendor[0].vendorContact.phone = phone
        this.setState({ singleVendor: this.state.singleVendor })
    }

    handleInputChange = (e, property) => {
        e.preventDefault()
        this.setState({ singleVendor: [...this.state.singleVendor] })
        const tempObj = this.state.singleVendor[0]
        tempObj[property] = e.target.value
        this.setState({ singleVendor: this.state.singleVendor })
    }

    handleNestedInputChange = (e, property) => {
        e.preventDefault()
        this.setState({ singleVendor: [...this.state.singleVendor] })
        const tempObj = this.state.singleVendor[0].vendorContact
        tempObj[property] = e.target.value
        this.setState({ singleVendor: this.state.singleVendor })
    }

    render() {
        const { close, options } = this.props
        const singleVendor = this.state.singleVendor[0]
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
                            <Col >
                                <Form.Label className="formLabel custom-formLabel">COMPANY NAME*</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="vendorName"
                                    value={singleVendor.vendorName}
                                    className="mb-4"
                                    placeholder="Company Name"
                                    onChange={(e) => this.handleInputChange(e, 'vendorName')}
                                />
                            </Col>
                            <Col xs={12}>
                                <Form.Label className="formLabel custom-formLabel">DESCRIPTION*</Form.Label>
                                <Form.Control required as="textarea"
                                    className="mb-4"
                                    name="description"
                                    rows="3"
                                    placeholder="Description"
                                    value={singleVendor.description}
                                    onChange={(e) => this.handleInputChange(e, 'description')}
                                />
                            </Col>
                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">WEBSITE*</Form.Label>
                                <Form.Control
                                    required
                                    type="url"
                                    className="mb-4"
                                    name="website" placeholder="Site url"
                                    value={singleVendor.website}
                                    onChange={(e) => this.handleInputChange(e, 'website')}
                                />
                                {this.state.domainError ? (<span className="duplicateDomain">Duplicate found. Please edit original entry</span>) : null}
                            </Col>

                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">UPLOAD PROFILE IMAGE*</Form.Label>
                                <input style={{ display: 'none' }}
                                    type="file"
                                    onChange={this.fileChangedHandler}
                                    ref={fileInput => this.fileInput = fileInput}
                                // value={this.state.singleVendor[0].website}
                                // onChange={(e) => this.handleInputChange(e, 'file')}
                                />
                                <img src={uploadIcon} onClick={() => this.fileInput.click()} 
                                     style={{ height: '20px', width: '25px', marginTop: '-5px', marginLeft: '6px' }} />
                            </Col>
                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">FUNCTIONAL AREAS*</Form.Label>
                                <Select required
                                    options={businessUnitOptions} isMulti={true}
                                    value={singleVendor.businessUnit}
                                    onChange={this.handleFuncAreaChange}
                                    lassNamePrefix="assignSelect"
                                    name="businessUnit"
                                    className="mb-4"
                                    style={{ borderColor: this.state.businessUnitError ? "#b94a48" : "#aaa" }}
                                />
                            </Col>
                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">MATURITY LEVEL*</Form.Label>
                                <Select required
                                    options={maturityLevelOptions}
                                    value={singleVendor.maturityLevel}
                                    onChange={this.handleMaturityChange}
                                    lassNamePrefix="assignSelect"
                                    name="maturityLevel"
                                    className="mb-4"
                                    style={{ borderColor: this.state.maturityError ? "#b94a48" : "#aaa" }}
                                />
                            </Col>

                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">KEY FOCUS AREA</Form.Label>
                                <Form.Control type="text"
                                    name="keyFocusArea"
                                    className="mb-4"
                                    value={singleVendor.keyFocusArea}
                                    onChange={(e) => this.handleInputChange(e, 'keyFocusArea')}
                                />
                            </Col>

                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">PARTNERSHIP PROCESS STAGE</Form.Label>
                                <Select
                                    options={processStageOptions}
                                    value={singleVendor.processStage}
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
                                <Form.Control type="text"
                                    name="name"
                                    value={singleVendor.vendorContact.name}
                                    onChange={(e) => this.handleNestedInputChange(e, 'name')}
                                    className="mb-4" />
                            </Col>
                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">TITLE</Form.Label>
                                <Form.Control type="text"
                                    name="title"
                                    value={singleVendor.vendorContact.title}
                                    onChange={(e) => this.handleNestedInputChange(e, 'title')}
                                    className="mb-4" />
                            </Col>
                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">EMAIL</Form.Label>
                                <Form.Control type="email"
                                    name="email"
                                    value={singleVendor.vendorContact.email}
                                    onChange={(e) => this.handleNestedInputChange(e, 'email')}
                                    className="mb-4" />
                            </Col>
                            <Col xs={6}>
                                <Form.Label className="formLabel custom-formLabel">PHONE</Form.Label>
                                {/* <Form.Control type="text" name="phone" className="mb-4" /> */}
                                <PhoneInput
                                    defaultCountry="US"
                                    className="PhoneInputInput"
                                    name="phone"
                                    value={singleVendor.vendorContact.phone}
                                    onChange={this.setPhoneNumber}
                                />

                                {
                                    this.state.isValidPh === true ? null : <span style={{ color: 'red' }}> Enter correct phone#</span>
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
