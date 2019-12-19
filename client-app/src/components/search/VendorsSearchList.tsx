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
                            <TableRow>
                                <TableCell className="patientTable">VENDOR &amp; BUSINESS/PRODUCTS</TableCell>
                                <TableCell className="patientTable">PROCESS STAGE</TableCell>
                                <TableCell className="patientTable">BUSINESS UNIT</TableCell>
                                <TableCell className="patientTable">VENDOR CONTACTS</TableCell>
                                <TableCell className="patientTable">BSC CONTACTS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vendors && vendors.map((vendor, i) => {
                                return (

                                    <TableRow className="patientRow" key={i}>
                                        <Link to={`/vendor-details/`} >
                                            <TableCell align="right" className="patientCol ">
                                                <div className="patient-name-spec">
                                                    <Highlighter
                                                        highlightClassName="YourHighlightClass"
                                                        searchWords={[search]}
                                                        autoEscape={true}
                                                        textToHighlight={vendor.vendorName}
                                                    /></div>
                                                <div>
                                                    {vendor.businessType}
                                                </div>
                                            </TableCell>
                                        </Link>
                                        <TableCell align="right" className="patientCol">
                                            <Highlighter
                                                highlightClassName="YourHighlightClass"
                                                searchWords={[search]}
                                                autoEscape={true}
                                                textToHighlight={vendor.engagementLevel}
                                            /></TableCell>
                                        <TableCell align="right" className="patientCol">

                                            <Highlighter
                                                highlightClassName="YourHighlightClass"
                                                searchWords={[search]}
                                                autoEscape={true}
                                                textToHighlight={vendor.businessUnit}
                                            />
                                        </TableCell>
                                        <TableCell align="right" className="patientCol">
                                            <Highlighter
                                                highlightClassName="YourHighlightClass"
                                                searchWords={[search]}
                                                autoEscape={true}
                                                textToHighlight={vendor.vendorContact.name}
                                            />
                                        </TableCell>
                                        <TableCell align="right" className="patientCol">

                                            <Highlighter
                                                highlightClassName="YourHighlightClass"
                                                searchWords={[search]}
                                                autoEscape={true}
                                                textToHighlight={vendor.bscContact.name}
                                            />
                                        </TableCell>
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
