import * as React from 'react';
import { connect } from 'react-redux';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Line, Circle } from 'rc-progress';
import { Button } from 'react-bootstrap';
import '../../css/vendor-overview.css';
import { Tabs, Tab, Row, Col } from 'react-bootstrap';
import { startGet } from '../../actions/get'

interface IVendorDetailState {
    showButton?: boolean,
    vendor?:any
}

interface IVendorDetailProps {
    vendor?: any,
    vid?:any,
    dispatch?: (name: any) => any,
}



class vendorDetails extends React.Component<IVendorDetailProps & RouteComponentProps, IVendorDetailState> {

    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
        this.props.dispatch(startGet('vendors'))
    }

    componentWillReceiveProps(nextProps: IVendorDetailProps) {
        if ((this.props.vendor.id !== nextProps.vendor.id)) {
            this.props.dispatch(startGet('vendors'))
        }
    }
    savePlan = () => {
        const vendorObj =
        {
            id: this.props.match.params.pid

        }
    }

    getAge = birthDate => {
        return Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / 3.15576e+10)
    }

    

    render() {
        const { vendor } = this.props;
        console.log(vendor)
        return (<div className="ai-ml-container">
            <div>Vendor Results</div>
            <Tabs defaultActiveKey="detail" id="uncontrolled-tab-example">
                <Tab eventKey="detail" title="Details">
                   <Row className="row">
                   <Col md={10}>
                       {vendor.name} Hello 
                    </Col>
                    <Col md={2}>
                        Hello
                    </Col>
                   </Row>
                </Tab>
                <Tab eventKey="contact" title="Contacts">
                    hello1
                </Tab>
                <Tab eventKey="notes" title="Notes">
                    hello2
                </Tab>
                <Tab eventKey="attachment" title="Attachments">
                    hello2
                </Tab>
            </Tabs>

        </div>)
    }

}

const mapStateToProps = (state: any, ownProps: IVendorDetailProps & RouteComponentProps) => {
    const vid = ownProps.match.params.vid;
    let vendor = state.entitiesData.vendors.data;
    if(vendor.length) {
        vendor = vendor.filter(v => {
            return v.id === vid
        })
    }
    console.log(vid);
    const result = {
        vid: vid,
        vendor:vendor

    }
    return result;
}

export const VendorDetails = connect(mapStateToProps)(vendorDetails);