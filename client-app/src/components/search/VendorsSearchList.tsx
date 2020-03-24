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
import profileLarge from '../../img/profile-lg@2x.png';
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
            <div className="patientList search-table-container">
                <Row className="">
                    <Table className="patientTable">
                        <TableHead>
                            <TableRow className="tableHeader mobile-view">
                                <TableCell className="patientTable">PARTNER NAME</TableCell>
                                <TableCell className="patientTable">FOCUS AREAS</TableCell>
                                <TableCell className="patientTable">BSC BUSINESS UNITS</TableCell>
                                {/* <TableCell className="patientTable">COMPANY CONTACTS</TableCell>
                                <TableCell className="patientTable">BSC CONTACTS</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vendors && vendors.map((vendor, i) => {

                                return (

                                    <TableRow className="patientRow" key={i}>
                                        <Link to={`/vendor-details/${vendor.id}`} >
                                            <TableCell align="right" className="patientCol ">
                                                <Row className="patient-name-spec">
                                                    <div>
                                                        <div className="profile-Img"
                                                            style={{ background: `url(${vendor.profileLogo || profileLarge})` }}>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Highlighter
                                                            highlightClassName="YourHighlightClass"
                                                            searchWords={[search]}
                                                            autoEscape={true}
                                                            textToHighlight={vendor.vendorName}
                                                        />
                                                    </div>
                                                </Row>
                                            </TableCell>
                                        </Link>                                       
                                        <TableCell className="mobile-view">
                                            <Highlighter
                                                highlightClassName="YourHighlightClass"
                                                searchWords={[search]}
                                                autoEscape={true}
                                                textToHighlight={vendor.keyFocusArea}
                                            />
                                        </TableCell>

                                        <TableCell align="right" className="patientCol mobile-view">
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
                                    </TableRow>)
                            })}

                        </TableBody>
                    </Table>
                </Row>
            </div>
        </div>
    }
}
