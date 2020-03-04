import * as React from 'react';
import { connect } from 'react-redux';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Line, Circle } from 'rc-progress';
import '../../css/vendor-overview.css';
import { Tabs, Tab, Row, Col, Form, Button } from 'react-bootstrap';
import { startGet, startGetAttachments } from '../../actions/get'
import { IFile } from '../../models/types'
import ReactTimeAgo from 'react-time-ago'
import Select from 'react-select';
import { processStageOptions } from '.././shared'
import apiClient from '../../util/api-client';

import profileIcon from '../../img/icon-profile@2x.png'
import contactIcon from '../../img/icon-contacts@2x.png'
import activityIcon from '../../img/icon-activity@2x.png'
import attachIcon from '../../img/icon-attachments@2x.png'
import { Attachments } from './Attachments';

interface IVendorDetailState {
    showButton?: boolean,
    vendor?: any,
    processStage?: any,
    notes?: string,
    files?: Map<string, IFile>,
    phase?: any,
}

interface IVendorDetailProps {
    vendor?: any,
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
            files: new Map()
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
        let note = {
            "name": "TestAdmin TestAdmin",
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

    getAge = birthDate => {
        return Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / 3.15576e+10)
    }

    notesOnChange = (e) => {
        this.setState({ notes: e.target.value })
    }

    openAttach = () => {
        this.setState({ phase: 1 })
    }

    render() {
        const { vendor, events } = this.props;
        //  console.log(vendor)
        // console.log(vendor[0].vendorName);

        return (<div className="ai-ml-container">
            <div className="vendor-result"> <Link to={`/`}><span className="carrot">&lt;</span>All Partners</Link></div>
            <Tabs defaultActiveKey="profile" id="vendor-detail">
                <Tab eventKey="profile" title={<span className="tabTextImg"><img src={profileIcon} /><span className="tabText">Profile</span></span>}>
                    <Row className="row-padding">
                        <Col md={8}>
                            <div className="vendorName">{vendor[0].vendorName}</div>
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
                            <Form onSubmit={this.addNotes} id="noteform" style={{width:'459px'}}>
                                <Form.Label className="formLabel custom-formLabel recentNotes">Recent Notes</Form.Label>
                                <Form.Control required as="textarea" className="mb-4"
                                    name="notes" rows="3"
                                    value={this.state.notes}
                                    onChange={this.notesOnChange}
                                    placeholder="Write a note..." />
                                <Button type="submit" className="btn btn-primary btn-block mb-4">POST</Button>
                            </Form>

                            {
                                events ? events.map((e, i) => {
                                    return (<Row key={i}>
                                        <Col xs={6}>
                                            <div className="notes-name">{e.name}</div>
                                        </Col>
                                        <Col xs={6}>
                                            <div className="time-ago">
                                                <ReactTimeAgo date={e.date} />
                                            </div>
                                        </Col>
                                        <Col xs={12}>
                                            <div className="text-notes">
                                                {e.text}
                                            </div>
                                        </Col>
                                    </Row>)
                                }) : null
                            }
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="contact" title={<span className="tabTextImg"><img src={contactIcon} /><span className="tabText">Contacts</span></span>}>
                    <Col className="mt-5">
                        <div className="businessType">{vendor[0].vendorContact.name}</div>
                        <div className="businessType">{vendor[0].vendorContact.title}</div>
                        <div className="businessType">{vendor[0].vendorContact.email}</div>
                        <div className="businessType">{vendor[0].vendorContact.phone}</div>
                    </Col>
                </Tab>
                <Tab eventKey="activity" title={<span className="tabTextImg"><img src={activityIcon} /><span className="tabText">Activity Feed</span></span>}>
                    <Col className="mt-5">
                        <div>TBD</div>
                    </Col>
                </Tab>
                <Tab eventKey="attachment" title={<span className="tabTextImg"><img src={attachIcon} /><span className="tabText">Attachments</span></span>}>
                    <Col className="mt-5">
                        <Attachments vendor={vendor} />
                    </Col>
                </Tab>
            </Tabs>

        </div>)
    }

}

const mapStateToProps = (state: any, ownProps: IVendorDetailProps & RouteComponentProps) => {
    const vid = ownProps.match.params.vid;
    let vendor = state.entitiesData.vendors ? state.entitiesData.vendors.data : [];
    if (vendor.length) {
        vendor = vendor.filter(v => {
            return v.id === vid
        })
    }
    //  console.log(vid);
    const result = {
        vid: vid,
        vendor: vendor,
        events: vendor[0].events ? vendor[0].events.sort((a, b) => {
            return (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)
        }) : []

    }
    return result;
}

export const VendorDetails = connect(mapStateToProps)(vendorDetails);