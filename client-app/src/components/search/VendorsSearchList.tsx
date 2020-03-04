import * as React from 'react';
import { Row, Col, FormControl, Button, Dropdown } from 'react-bootstrap';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import '../../css/login.css';
import iconCirle from '../../img/icon-circle-care@2x.png';
import searchBar from '../../img/search-bar.png';
import apiClient from '../../util/api-client';
import Highlighter from "react-highlight-words";
// export enum RiskLevelEnum {
//     LOW = 10,
//     MEDIUM = 25
// }

interface IVendorListProps {
    vendors?: any,
    search?: string
}

export class VendorSearchList extends React.Component<IVendorListProps & RouteComponentProps, {}> {

    constructor(props) {
        super(props);
    }

    createGlimpse = (str: string, maxLength) => {
        if (!str || str.length < maxLength) {
            return str
        }
        const spaceIdx = str.indexOf(' ', maxLength - 10)
        if (spaceIdx <= maxLength) {
            return str.substr(0, spaceIdx) + " ..."
        }
        return str.substr(0, maxLength) + "..."
    }

    render() {
        const { vendors, search } = this.props

        return <div className="container pt-3">
            <div className="patientList ai-ml-container">
                <Row className="mt-4">
                    <Table className="patientTable">
                        <TableHead>
                            <TableRow className="tableHeader">
                                <TableCell className="patientTable">PARTNER NAME &amp; KEY FOCUS AREAS</TableCell>
                                <TableCell className="patientTable">PROCESS STAGE</TableCell>
                                <TableCell className="patientTable">FUNCTIONAL AREAS</TableCell>
                                <TableCell className="patientTable">COMPANY CONTACTS</TableCell>
                                {/* <TableCell className="patientTable">BSC CONTACTS</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vendors && vendors.map((vendor, i) => {

                                return (

                                    <TableRow className="patientRow" key={i}>
                                        <Link to={`/vendor-details/${vendor.id}`} >
                                            <TableCell align="right" className="patientCol ">
                                                <Row className="patient-name-spec">
                                                    <Col xs={4}>
                                                        <img src={vendor.profileLogo || 'http://via.placeholder.com/50x50'}
                                                            style={{ height: '50px', width: '50px' }} />
                                                    </Col>
                                                    <Col xs={8}>
                                                        <Highlighter
                                                            highlightClassName="YourHighlightClass"
                                                            searchWords={[search]}
                                                            autoEscape={true}
                                                            textToHighlight={vendor.vendorName}
                                                        />
                                                        <div>{vendor.keyFocusArea}</div>
                                                    </Col>
                                                </Row>


                                            </TableCell>
                                        </Link>
                                        <TableCell align="right" className="patientCol">
                                            {<Highlighter
                                                highlightClassName="YourHighlightClass"
                                                searchWords={[search]}
                                                autoEscape={true}
                                                textToHighlight={vendor.processStage ? vendor.processStage.label : null}
                                            />
                                            }
                                        </TableCell>
                                        <TableCell align="right" className="patientCol">
                                            {vendor.businessUnit ? vendor.businessUnit.map(b => {
                                                return <div key={b.value} className="mb-2">
                                                    <Highlighter
                                                        highlightClassName="YourHighlightClass"
                                                        searchWords={[search]}
                                                        autoEscape={true}
                                                        textToHighlight={b.label}
                                                    />
                                                </div>
                                            }) : null
                                            }
                                        </TableCell>
                                        <TableCell align="right" className="patientCol">
                                            <Highlighter
                                                highlightClassName="YourHighlightClass"
                                                searchWords={[search]}
                                                autoEscape={true}
                                                textToHighlight={vendor.vendorContact.name}
                                            />
                                        </TableCell>
                                        {/* <TableCell align="right" className="patientCol">

                                            <Highlighter
                                                highlightClassName="YourHighlightClass"
                                                searchWords={[search]}
                                                autoEscape={true}
                                                textToHighlight={vendor.bscContact.name}
                                            />
                                        </TableCell> */}
                                        {/* <TableCell align="right" className="patientCol">{this.createGlimpse(vendor.careDetails.facility, 20)}</TableCell>
                                            
                                            
                                               
                                                  */}
                                    </TableRow>)
                            })}

                        </TableBody>
                    </Table>
                </Row>
            </div>
        </div>
    }
}
