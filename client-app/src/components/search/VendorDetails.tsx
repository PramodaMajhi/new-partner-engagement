import * as React from 'react';
import { connect } from 'react-redux';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Line, Circle } from 'rc-progress';
import '../../css/vendor-overview.css';
import { Tabs, Tab, Row, Col, Form, Button } from 'react-bootstrap';
import { startGet, startGetAttachments } from '../../actions/get'
import { startMerge } from '../../actions/merge'
import { startUpload } from "../../actions/upload"
import { IFile } from '../../models/types'
import ReactTimeAgo from 'react-time-ago'
import Select from 'react-select';
import { processStageOptions } from '.././shared'
import apiClient from '../../util/api-client';

import profileIcon from '../../img/icon-profile@2x.png'
import contactIcon from '../../img/icon-contacts@2x.png'
import activityIcon from '../../img/icon-activity@2x.png'
import attachIcon from '../../img/icon-attachments@2x.png'
import editIcon from '../../img/icon-edit@2x.png'
import { Attachments } from './Attachments';
import { AddNewVendorModal } from './AddNewVendorModal'
import { businessUnitOptions } from '.././shared'
import url from 'url'

interface IVendorDetailState {
    showButton?: boolean,
    vendor?: any,
    processStage?: any,
    notes?: string,
    files?: Map<string, IFile>,
    phase?: any,
    showModal?: boolean,
    profileImage?: []
}

interface IVendorDetailProps {
    vendor?: any,
    vendors?: any,
    vid?: any,
    events?: [],
    dispatch?: (name: any) => any,
}



class vendorDetails extends React.Component<IVendorDetailProps & RouteComponentProps, IVendorDetailState> {

    constructor(props) {
        super(props)
        this.state = {
            processStage: this.props.vendor ? this.props.vendor[0].processStage : null,
            notes: '',
            phase: 0,
            files: new Map(),
            profileImage: []
        }
    }
    componentDidMount() {
        this.props.dispatch(startGet('vendors'))
        let filter = {
            id: this.props.vendor[0].id
        }
        this.props.dispatch(startGet("attachments", filter))
    }

    componentWillReceiveProps(nextProps: IVendorDetailProps) {
        if ((this.props.vendor.id !== nextProps.vendor.id)) {
            this.props.dispatch(startGet('vendors'))
            let filter = {
                id: this.props.vendor[0] ? this.props.vendor[0].id : null
            }
            this.props.dispatch(startGet("attachments", filter))

        }
    }

    handleProcessStage = processStage => {
        this.setState({ processStage: processStage });
    };

    addNotes = (e) => {
        e.preventDefault();
        let localStoreCurrUser = JSON.parse(localStorage.getItem("loggedinUser"))
        let note = {
            "name": localStoreCurrUser ? (localStoreCurrUser.firstName + ' ' + localStoreCurrUser.lastName) : '',
            "date": new Date(),
            "text": e.currentTarget.notes.value
        }
        let newEvents = {
            "events": [...this.props.events, note]
        }
        apiClient.patch(`/vendors/${this.props.vid}`, newEvents)
            .then(response => {
                this.setState({ notes: '' })
                this.props.dispatch(startGet('vendors'));
            }).catch(err => { throw new Error(err); });


    }

    getTimeStamp = (date) => {
        var time = new Date(date);
        return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    }
    getDateAndYear = (date) => {
        var time = new Date(date);
        return time.toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    }

    notesOnChange = (e) => {
        this.setState({ notes: e.target.value })
    }

    openAttach = () => {
        this.setState({ phase: 1 })
    }


    closeModal = () => {
        this.setState({ showModal: false, })
    }
    openModal = () => {
        this.setState({ showModal: true })
    }



    editVendor = async (singleVendor, profileImg) => {
        let urlObj = url.parse(singleVendor.website);
        let domain = urlObj.hostname
        singleVendor['domain'] = domain;
        //  singleVendor['id'] = this.props.vid;

        let fileAttachContainer = {}
        await startMerge('vendors', singleVendor)
        // await this.props.dispatch(startGet('vendors'));
        //  await createAttachment('attachments', fileAttachContainer)(this.props.dispatch)
        this.setState({ profileImage: profileImg })
        if (profileImg.length) {
            this.fileUpload(singleVendor.id, profileImg);
        }
    }


    fileUpload = async (containerName, profileImg) => {
        await startUpload(containerName, profileImg)(this.props.dispatch)
        let imageLogoUrl = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://localhost:3001/api'

        if (profileImg.length) {
            let vendorObj = {
                id: containerName,
                profileLogo: `${imageLogoUrl}/attachments/${containerName}/download/${profileImg[0].name}`
            }
            await startMerge('vendors', vendorObj)
        }
        // this.props.dispatch(startGet('vendors'));
    }


    render() {
        const { vendor, events } = this.props;
        //  console.log(vendor)
        // console.log(vendor[0].vendorName);

        return (<div className="ai-ml-container">
            <div className="vendor-result"> <Link to={`/`}><span className="carrot">&lt;</span>All Partners</Link></div>
            <Tabs defaultActiveKey="profile" id="vendor-detail">
                <Tab eventKey="profile" title={<span className="tabTextImg">
                    <img src={profileIcon} /><span className="tabText">Profile</span></span>}>
                    <Row className="row-padding">
                        <Col md={8}>
                            <Row>
                                <Col xs={4}>
                                    <div className="vendorName">{vendor[0].vendorName}</div>
                                </Col>
                                <Col xs={4}>
                                    <div onClick={this.openModal}>
                                        <span><img src={editIcon} style={{ height: '18px', width: '18px', marginTop: '-5px' }} /></span>
                                        <span className="edit-profile">EDIT PROFILE </span>
                                    </div>
                                </Col>
                            </Row>
                            <div>{vendor[0].description}</div>
                            <Row className="row-margin">
                                <Col>
                                    <div className="headingItem">KEY FOCUS AREA</div>
                                    <div className="businessType">{vendor[0].keyFocusArea}</div>
                                </Col>
                                <Col>
                                    <div className="headingItem">FUNCTIONAL AREAS</div>
                                    {/* <div className="businessType">{vendor[0].businessUnit}</div> */}
                                    {vendor[0].businessUnit ? vendor[0].businessUnit.map(b => {
                                        return <div key={b.value} className="mb-2">
                                            <div className="businessType"> {b.label}</div>
                                        </div>
                                    }) : null
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label className="formLabel custom-formLabel">PARTNERSHIP PROCESS STAGE</Form.Label>
                                    <Select
                                        value={this.state.processStage}
                                        options={processStageOptions}
                                        onChange={this.handleProcessStage}
                                        lassNamePrefix="assignSelect"
                                        name="stage"
                                        className="mb-4"
                                        isDisabled={true}
                                    />
                                </Col>
                                <Col>
                                    <div className="headingItem" >PRIMARY BSC CONTACT</div>
                                    <div className="businessType">{vendor[0].bscContact.name}</div>
                                    <div className="businessType">{vendor[0].bscContact.title}</div>
                                </Col>
                            </Row>
                        </Col>
                        {/* <div className="page-header"></div> */}
                        <Col md={4}>
                            <Form onSubmit={this.addNotes} id="noteform">
                                <Form.Label className="formLabel custom-formLabel recentNotes">Recent Notes</Form.Label>
                                <Form.Control required as="textarea" className="mb-4"
                                    name="notes" rows="3"
                                    value={this.state.notes}
                                    onChange={this.notesOnChange}
                                    placeholder="Write a note..." />
                                <Button type="submit" className="btn btn-primary mb-4" style={{ width: '100%' }}>POST</Button>
                            </Form>

                            {
                                events ? events.map((e, i) => {
                                    return (<div key={i} className="mt-3 mb-4 pb-4 notes-border-bottom">
                                        <div className="notes-name">{e.name}</div>

                                        <div className="text-notes">
                                            {e.text}
                                        </div>

                                        <div className="time-ago">
                                            {/* <ReactTimeAgo date={e.date} style={{ marginRight: '14px' }} /> */}
                                            <span>{this.getTimeStamp(e.date)}</span>
                                            <span style={{ marginLeft: '6px', marginRight: '6px' }}>&#xb7;</span>
                                            <span>{this.getDateAndYear(e.date)}</span>
                                        </div>

                                    </div>)
                                }) : null
                            }
                        </Col>
                    </Row>
                    {
                        this.state.showModal &&
                        (<AddNewVendorModal close={this.closeModal}
                            addVendor={this.editVendor}
                            vendors={this.props.vendors}
                            singleVendor={this.props.vendor}
                            isEdit={true} />)
                    }
                </Tab>
                <Tab eventKey="attachment" title={<span className="tabTextImg">
                    <img src={attachIcon} />
                    <span className="tabText">Attachments</span></span>}>
                    <Col className="mt-5">
                        <Attachments vendor={vendor} />
                    </Col>
                </Tab>
                <Tab eventKey="contact" title={<span className="tabTextImg">
                    <img src={contactIcon} />
                    <span className="tabText">Contacts</span></span>}>
                    <Col className="mt-5">
                        <div className="businessType">{vendor[0].vendorContact.name}</div>
                        <div className="businessType">{vendor[0].vendorContact.title}</div>
                        <div className="businessType">{vendor[0].vendorContact.email}</div>
                        <div className="businessType">{vendor[0].vendorContact.phone}</div>
                    </Col>
                </Tab>
                <Tab eventKey="activity" title={<span className="tabTextImg">
                    <img src={activityIcon} /><span className="tabText">Activity Feed</span></span>}>
                    <Col className="mt-5">
                        <div>TBD</div>
                    </Col>
                </Tab>
            </Tabs>

        </div>)
    }

}

const mapStateToProps = (state: any, ownProps: IVendorDetailProps & RouteComponentProps) => {
    const vid = ownProps.match.params.vid;
    let vendor = state.entitiesData.vendors ? state.entitiesData.vendors.data : [];
    let vendors = state.entitiesData.vendors ? state.entitiesData.vendors.data : [];
    if (vendor.length) {
        vendor = vendor.filter(v => {
            return v.id === vid
        })
    }
    //  console.log(vid);
    const result = {
        vid: vid,
        vendor: vendor,
        vendors: vendors,
        events: vendor[0].events ? vendor[0].events.sort((a, b) => {
            return (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)
        }) : []

    }
    return result;
}

export const VendorDetails = connect(mapStateToProps)(vendorDetails);