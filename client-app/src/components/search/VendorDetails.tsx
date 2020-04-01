import * as React from 'react';
import { connect } from 'react-redux';

import 'react-circular-progressbar/dist/styles.css';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import '../../css/vendor-overview.css';
import { Tabs, Tab, Row, Col, Form, Button } from 'react-bootstrap';
import { startGet, startGetAttachments } from '../../actions/get'
import { startMerge } from '../../actions/merge'
import { startUpload } from "../../actions/upload"
import { IFile } from '../../models/types'
import { GADataLayer } from '../../utils'
import ReactTimeAgo from 'react-time-ago'
import Select from 'react-select';
import { processStageOptions } from '.././shared'
import apiClient from '../../util/api-client';

import profileIcon from '../../img/icon-profile@2x.png'
import profileLarge from '../../img/profile-lg@2x.png';
import contactIcon from '../../img/icon-contacts@2x.png'
import activityIcon from '../../img/icon-activity@2x.png'
import attachIcon from '../../img/icon-attachments@2x.png'
import editIcon from '../../img/icon-edit@2x.png'
import { Attachments } from './Attachments';
import { AddNewVendorModal } from './AddNewVendorModal'
import { businessUnitOptions } from '.././shared'
import url from 'url'
import ReactGA from 'react-ga'
import { CONF } from '../../conf'


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

// GA global window variable
// declare global {
//     interface Window {
//         dataLayer: any
//     }
// }

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
        // ReactGA.pageview('view-profile');    
        // window.dataLayer = window.dataLayer || [];
        // window.dataLayer.push({
        //     'event': 'virtualPageView',
        //     'pageName': 'view-profile'
        // });

        let dataLayer = GADataLayer();
        dataLayer.push({
            'event': 'virtualPageView',
            'pageName': 'view-profile'
        });
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
        let title = '';
        let businessUnit = '';
        let name = '';
        if (Object.entries(localStoreCurrUser).length) {
            name = localStoreCurrUser.firstName + ' ' + localStoreCurrUser.lastName;
            businessUnit = localStoreCurrUser.businessUnit;
            title = localStoreCurrUser.title;
        }

        let note = {
            "name": name,
            "businessUnit": businessUnit,
            "title": title,
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

        // GA tag
        let dataLayer = GADataLayer();
        dataLayer.push({
            'event': 'virtualPageView',
            'pageName': 'add-note'
        });


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
        singleVendor['modifiedAt'] = new Date();
        const sessionUser = JSON.parse(localStorage.getItem("loggedinUser"));
        if (Object.entries(sessionUser).length) {
            singleVendor.modifiedBy = {
                id: sessionUser.id,
                firstName: sessionUser.firstName,
                lastName: sessionUser.lastName,
                email: sessionUser.email
            }
        }
        await startMerge('vendors', singleVendor)
        // await this.props.dispatch(startGet('vendors'));
        //  await createAttachment('attachments', fileAttachContainer)(this.props.dispatch)
        this.setState({ profileImage: profileImg })
        if (profileImg.length) {
            this.fileUpload(singleVendor.id, profileImg);
        }

        // GA tag
        let dataLayer = GADataLayer();
        dataLayer.push({
            'event': 'eventTracker',
            'eventCategory': 'Partner Records Add or Edit',
            'eventAction': 'Partner Record Edit',
            'eventLabel': 'Success'
        });

    }


    fileUpload = async (containerName, profileImg) => {
        await startUpload(containerName, profileImg)(this.props.dispatch)
        if (profileImg.length) {
            let vendorObj = {
                id: containerName,
                profileLogo: `${CONF.APP_API_URL.API_URL}/attachments/${containerName}/download/${profileImg[0].name}`
            }
            await startMerge('vendors', vendorObj)
            this.props.dispatch(startGet('vendors'));
        }
    }


    render() {
        const { vendor, events } = this.props;
        const sessionUser = JSON.parse(localStorage.getItem("loggedinUser"));

        let isLimitedUser = false
        if (sessionUser.userType === 'limited') {
            isLimitedUser = true
        }
        //  console.log(vendor)
        // console.log(vendor[0].vendorName);
        const totalNotes = events.length;

        return (<div className="ai-ml-container">
            <div className="vendor-result mb-5">
                <Link to={`/`}>
                    <span className="carrot">
                        <svg width="9" height="18" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.08984 5.65234C0.773438 6.00391 0.773438 6.53125 1.08984 6.84766L5.87109 11.6289C6.22266 11.9805 6.75 11.9805 7.06641 11.6289L7.875 10.8555C8.19141 10.5039 8.19141 9.97656 7.875 9.66016L4.46484 6.25L7.875 2.875C8.19141 2.55859 8.19141 1.99609 7.875 1.67969L7.06641 0.871094C6.75 0.554688 6.22266 0.554688 5.87109 0.871094L1.08984 5.65234Z" fill="#8392A5" />
                        </svg>
                    </span>All Partners
                </Link>
            </div>
            <Tabs defaultActiveKey="profile" id="vendor-detail">
                <Tab eventKey="profile"
                    title={<span className="tabTextImg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12" >
                            <path d="M3.5 1.92188C3.5 2.16797 3.69141 2.35938 3.9375 2.35938H13.5625C13.7812 2.35938 14 2.16797 14 1.92188V0.828125C14 0.609375 13.7812 0.390625 13.5625 0.390625H3.9375C3.69141 0.390625 3.5 0.609375 3.5 0.828125V1.92188ZM3.9375 6.73438H13.5625C13.7812 6.73438 14 6.54297 14 6.29688V5.20312C14 4.98438 13.7812 4.76562 13.5625 4.76562H3.9375C3.69141 4.76562 3.5 4.98438 3.5 5.20312V6.29688C3.5 6.54297 3.69141 6.73438 3.9375 6.73438ZM3.9375 11.1094H13.5625C13.7812 11.1094 14 10.918 14 10.6719V9.57812C14 9.35938 13.7812 9.14062 13.5625 9.14062H3.9375C3.69141 9.14062 3.5 9.35938 3.5 9.57812V10.6719C3.5 10.918 3.69141 11.1094 3.9375 11.1094ZM0.4375 2.6875H2.1875C2.40625 2.6875 2.625 2.49609 2.625 2.25V0.5C2.625 0.28125 2.40625 0.0625 2.1875 0.0625H0.4375C0.191406 0.0625 0 0.28125 0 0.5V2.25C0 2.49609 0.191406 2.6875 0.4375 2.6875ZM0.4375 7.0625H2.1875C2.40625 7.0625 2.625 6.87109 2.625 6.625V4.875C2.625 4.65625 2.40625 4.4375 2.1875 4.4375H0.4375C0.191406 4.4375 0 4.65625 0 4.875V6.625C0 6.87109 0.191406 7.0625 0.4375 7.0625ZM0.4375 11.4375H2.1875C2.40625 11.4375 2.625 11.2461 2.625 11V9.25C2.625 9.03125 2.40625 8.8125 2.1875 8.8125H0.4375C0.191406 8.8125 0 9.03125 0 9.25V11C0 11.2461 0.191406 11.4375 0.4375 11.4375Z" />
                        </svg>
                        <span className="tabText">Profile</span>
                    </span>
                    }>
                    <Row className="row-padding">
                        <Col md={8}>
                            <Row>
                                <Col xs={2} className="mobile-view">
                                    {/* <div>
                                        <img src={profileLarge} style={{ height: '60px', width: '60px' }} />
                                    </div> */}
                                    <div className="edit-profile-Img"
                                        style={{ background: `url(${vendor[0].profileLogo || profileLarge})` }}>
                                    </div>
                                </Col>
                                <Col xs={10} className="mobile-column">
                                    <Row>
                                        <div className="vendorName">
                                            {vendor[0].vendorName}
                                            {
                                                sessionUser.userType !== 'limited' ?
                                                    (<span onClick={this.openModal}>
                                                        <span><img src={editIcon} style={{ height: '18px', width: '18px', marginLeft: '25px' }} /></span>
                                                        <span className="edit-profile">EDIT PROFILE </span>
                                                    </span>) : null
                                            }

                                        </div>

                                    </Row>
                                    <Row>
                                        <div className="domain">
                                            <a href={vendor[0].website} target="_blank"> {vendor[0].domain}</a>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="description mt-3 mb-3">{vendor[0].description}</div>
                                    </Row>
                                    <Row>
                                        <div className="lastUpdated mb-3">LAST UPDATED
                                            <span style={{ marginRight: '6px' }}>&#58;</span>
                                            {
                                                Object.entries(vendor[0].modifiedBy).length ?
                                                    (<span style={{ fontWeight: 400 }}>{this.getDateAndYear(vendor[0].modifiedAt)} By {vendor[0].modifiedBy.firstName + ' ' + vendor[0].modifiedBy.lastName}</span>)
                                                    : <span style={{ fontWeight: 400 }}>{this.getDateAndYear(vendor[0].createdAt)} By {vendor[0].createdBy.firstName + ' ' + vendor[0].createdBy.lastName}</span>
                                            }

                                        </div>
                                    </Row>
                                    <div className="row-padding">
                                        <Row>
                                            <Col xs={6}>
                                                <div className="headingItem mb-3">KEY FOCUS AREAS</div>
                                                <div className="businessType">{vendor[0].keyFocusArea}</div>
                                            </Col>
                                            <Col xs={6}>
                                                <div className="headingItem mb-3">BSC BUSINESS UNITS</div>
                                                {/* <div className="businessType">{vendor[0].businessUnit}</div> */}
                                                {vendor[0].businessUnit ? vendor[0].businessUnit.map(b => {
                                                    return <div key={b.value} className="mb-2">
                                                        <div className="businessType"> {b.label}</div>
                                                    </div>
                                                }) : null
                                                }
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>

                        </Col>
                        <Col md={4}>
                            <Form onSubmit={this.addNotes} id="noteform">
                                <Form.Label className="formLabel custom-formLabel recentNotes">
                                    <span style={{ marginRight: '10px' }}><svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 0.625C4.11719 0.625 1 3.19531 1 6.3125C1 7.67969 1.57422 8.91016 2.55859 9.89453C2.20312 11.2891 1.05469 12.4922 1.05469 12.5195C1 12.5742 0.972656 12.6836 1 12.7656C1.05469 12.8477 1.10938 12.875 1.21875 12.875C3.02344 12.875 4.39062 12.0273 5.04688 11.4805C5.94922 11.8086 6.93359 12 8 12C11.8555 12 15 9.45703 15 6.3125C15 3.19531 11.8555 0.625 8 0.625Z" fill="#1C2D41" />
                                    </svg>
                                    </span>
                                    Notes ({totalNotes})
                                </Form.Label>
                                <Form.Control required as="textarea" className="mb-4"
                                    name="notes" rows="3"
                                    value={this.state.notes}
                                    onChange={this.notesOnChange}
                                    placeholder="Write a note..." />
                                <Button type="submit" className="btn btn-primary mb-4" style={{ width: '100%' }} disabled={isLimitedUser}>POST</Button>
                            </Form>

                            {
                                events ? events.map((e, i) => {
                                    return (<div key={i} className="mt-3 mb-4 pb-4 notes-border-bottom">
                                        <div className="notes-name">{e.name} <span>&#183;</span> <span style={{ fontWeight: 400 }}>{e.businessUnit}</span></div>
                                        <div className="notes-name">{e.title}</div>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" >
                        <path d="M2.17578 13.5195C3.78906 15.1602 6.41406 15.1875 8.05469 13.5195L12.7578 8.70703C12.9219 8.54297 12.9219 8.26953 12.7305 8.10547L12.1016 7.47656C11.9375 7.3125 11.6641 7.3125 11.5 7.47656L6.79688 12.2891C5.86719 13.2461 4.36328 13.2461 3.43359 12.2891C2.50391 11.332 2.50391 9.74609 3.46094 8.78906L9.20312 2.91016C9.72266 2.39062 10.5703 2.39062 11.0898 2.91016C11.6094 3.45703 11.6094 4.35938 11.0898 4.90625L6.08594 10.0195C5.97656 10.1289 5.78516 10.1289 5.64844 10.0195C5.53906 9.88281 5.53906 9.63672 5.67578 9.5L9.61328 5.50781C9.77734 5.31641 9.77734 5.04297 9.58594 4.87891L8.98438 4.27734C8.79297 4.08594 8.51953 4.11328 8.35547 4.27734L4.41797 8.29688C3.625 9.08984 3.59766 10.4023 4.39062 11.2227C5.18359 12.0703 6.52344 12.0703 7.34375 11.25L12.3477 6.13672C13.5508 4.90625 13.5234 2.91016 12.3477 1.67969C11.1172 0.449219 9.14844 0.449219 7.94531 1.67969L2.20312 7.55859C0.589844 9.19922 0.5625 11.8516 2.17578 13.5195Z" />
                    </svg>
                    <span className="tabText">Attachments</span></span>}>
                    <Col className="mt-5">
                        <Attachments vendor={vendor} isLimitedUser={isLimitedUser} />
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