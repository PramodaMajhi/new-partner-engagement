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

// export enum RiskLevelEnum {
//     LOW = 10,
//     MEDIUM = 25
// }

interface IVendorListProps {
    vendors?: any,
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
        const { vendors } = this.props

        return <div className=" pt-3">
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
                                            <TableCell align="right" className="patientCol ">
                                                <div className="patient-name-spec">{vendor.vendorName}</div>
                                            </TableCell>
                                            <TableCell align="right" className="patientCol"></TableCell>
                                            {/* <TableCell align="right" className="patientCol">{this.createGlimpse(vendor.careDetails.facility, 20)}</TableCell>
                                            <TableCell align="right" className="patientCol">{vendor.careDetails.assingedPcp}</TableCell>
                                            <TableCell align="right" className="patientCol">{vendor.diagonosisAtAdmission}</TableCell>
                                            <TableCell align="right" className="patientCol">{vendor.careDetails.admission}</TableCell>                                             */}
                                        </TableRow>)
                            })}

                        </TableBody>
                    </Table>
                </Row>
            </div>
        </div>
    }
}
