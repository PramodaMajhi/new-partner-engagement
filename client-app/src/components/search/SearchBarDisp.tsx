import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Row, Col, Button, Form } from 'react-bootstrap';
import url from 'url'
import SearchBar from 'material-ui-search-bar'
import AutoComplete from 'material-ui/AutoComplete';
import iconBSCLogo from '../../img/BSC-Logo-Lrg@2x.png';
import * as currentUserModel from '../../models/currentUser';
import { login } from '../../actions/login';
import { startGet } from '../../actions/get'
import { setValues } from '../../actions/values'
import { startInsert } from "../../actions/insert"
import { VendorSearchList } from './VendorsSearchList'
import Highlighter from "react-highlight-words";
import { VendorDetails } from './VendorDetails'
import { businessUnitOptions } from '.././shared'
import { AddNewVendorModal } from './AddNewVendorModal'
import '../../css/login.css';

interface ISearchProps {
  vendors?: any,
  vendorFilter?: string,
  displayVendor?: boolean,
  dispatch?: (name: any) => any,
}
interface ISearchState {
  vendors?: any,
  searchString?: string,
  toggle?: boolean,
  showModal?: boolean
}


class searchBarDisp extends React.Component<ISearchProps & RouteComponentProps, ISearchState> {

  constructor(props) {
    super(props);
    this.state = { searchString: "", vendors: [], toggle: false, showModal: false };
  }

  componentDidMount() {
    this.props.dispatch(startGet('vendors'))
    this.setState({ vendors: this.props.vendors });
  }
  componentWillReceiveProps(nextProps: ISearchProps) {
    if ((this.props.vendors && nextProps.vendors &&
      (this.props.vendors.length !== nextProps.vendors.length))) {
      this.props.dispatch(startGet('vendors'))
      this.setState({ vendors: nextProps.vendors });
    }
  }

  handleChange = (newValue: any) => {
    this.setState({ searchString: newValue, toggle: true });
    this.props.dispatch(setValues({ vendorFilter: 'All' }))
  }
  onRequestSearch = (newValue: any) => {
    console.log("on-search-requested" + newValue);
  }

  handlePushSearch = (search) => {
    this.props.dispatch(setValues({ vendorFilter: search }))
    // const filteredVendor = this.state.vendors.filter(v => {
    //   return v.businessUnit === search;
    // })
    // this.setState({ vendors: filteredVendor });

  }

  handleBrowse = () => {
    this.props.dispatch(setValues({ vendorFilter: '' }))
    this.props.history.push('/');
  }

  closeModal = () => {
    this.setState({ showModal: false, })
  }

  addVendor = (formData, businessUnit, maturityLevel, processStage) => {

    if(formData &&  businessUnit) {     
      console.log(businessUnit)
              
    }
    let urlObj = url.parse(formData.website.value);
    let domain  = urlObj.hostname
    let values = {
      vendorName: formData.name.value,
      businessUnit: businessUnit,
      keyFocusArea:formData.keyfocus.value,
      website:formData.website.value,
      domain: domain.toLowerCase(),
      maturityLevel: maturityLevel,
      processStage: processStage, 
      vendorContact: {
        name: formData.contactName.value,
        title:formData.title.value,
        phone: formData.phone.value,
        email: formData.email.value        
      },
      bscContact: {        
      },

    }

    startInsert('vendors', values)(this.props.dispatch)
      .then(() => {
        this.props.dispatch(startGet('vendors'))
      })
  }

  openModal = () => {
    this.setState({ showModal: true })
  }

  render() {
    const { vendors, vendorFilter } = this.props
    // console.log("Vendor filter ==> " + vendorFilter);
    // console.log(vendors);

    let businessUnit = vendorFilter;
    let filteredVendor = this.state.vendors;
    if (businessUnit != '' && businessUnit != 'All') {
      filteredVendor = this.state.vendors.filter(v => {
        return v.businessUnit === businessUnit;
      })

    }
    let engagementLevel = vendorFilter;
    if (engagementLevel != '' && businessUnit != 'Health Innovation Technology' && businessUnit != 'All') {
      filteredVendor = this.state.vendors.filter(v => {
        return v.engagementLevel === engagementLevel;
      })

    }
    let _vendors = filteredVendor
    let search = this.state.searchString.trim().toLowerCase();

    if (search.length > 0) {
      _vendors = _vendors.filter((vendor) => {
        // return vendor.vendorName.toLowerCase().match(search) ||
        //   vendor.businessType.toLowerCase().match(search) ||
        //   vendor.businessUnit.toLowerCase().match(search) ||
        //   vendor.bscContact.name.toLowerCase().match(search) ||
        //   vendor.vendorContact.name.toLowerCase().match(search) ||
        //   vendor.engagementLevel.toLowerCase().match(search)
        //   ;
        return 
      });
    }
    return (
      <div className="container">

        <div className="searchBar">
          <SearchBar
            value={this.state.searchString}
            onChange={(newValue) => this.handleChange(newValue)}
            onRequestSearch={(newValue) => this.onRequestSearch(newValue)}
            style={{
              margin: '0 auto',
              maxWidth: 1200
            }}
            hintText="Search vendor or keyword" />
        </div>


        {vendorFilter == '' ?
          <>
            <div className="search-result-section browse-text">Browse recommended categories...</div>
            <div className="row search-result-section">

              <div className="sm-2" onClick={() => { this.handlePushSearch('All') }}>
                <div className="search_option" >
                  All Vendors
                </div>
              </div>



              <div className="sm-2" onClick={() => { this.handlePushSearch('Initial Engagement') }}>
                <div className="search_option">
                  Initial Engagement
                </div>
              </div>


              <div className="sm-2" onClick={() => { this.handlePushSearch('Exploration') }}>
                <div className="search_option">
                  Exploration
                </div>
              </div>

              <div className="sm-2" onClick={() => { this.handlePushSearch('Production') }}>
                <div className="search_option">
                  Proof of Concept
                </div>
              </div>

              <div className="sm-2" onClick={() => { this.handlePushSearch('Pilot') }}>
                <div className="search_option">
                  Pilot
                </div>
              </div>

              <div className="sm-2" onClick={() => { this.handlePushSearch('Production') }}>
                <div className="search_option">
                  Production
                </div>
              </div>


              <div className="sm-2" onClick={() => { this.handlePushSearch('Exploration') }}>
                <div className="search_option">
                  User Experience
                </div>
              </div>
              <div className="sm-2" onClick={() => { this.handlePushSearch('Exploration') }}>
                <div className="search_option">
                  Robotics
                </div>
              </div>
              <div className="sm-2" onClick={() => { this.handlePushSearch('Exploration') }}>
                <div className="search_option">
                  AI/ML
                </div>
              </div>

              <div className="sm-2" onClick={() => { this.handlePushSearch('Health Innovation Technology') }}>
                <div className="search_option">
                  Health Innovation Technology
                </div>
              </div>
            </div>

          </> : <Row>
            <Col className="search-result-section browse-text" >
              <span className="browse" onClick={this.handleBrowse}> Browse</span> <span className="arrow"> > </span>
              {
                <span className="browse-search-text"> {businessUnit} {'(' + _vendors.length + ')'}</span>
              }

            </Col>
            <Col className="search-result-section browse-text addPartner" onClick={this.openModal}>
              + ADD NEW PARTNER
            </Col>
            {
              this.state.showModal &&
              (<AddNewVendorModal close={this.closeModal}
                addVendor={this.addVendor} options={businessUnitOptions} vendors={this.props.vendors} />)
            }
          </Row>

        }
        {vendorFilter != '' ?
          <VendorSearchList vendors={_vendors} search={search} /> : ''
        }
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: ISearchProps) => {

  const vendors = state.entitiesData.vendors.data;
  const vendorFilter = state.values.vendorFilter
  const result = {
    vendors: vendors,
    vendorFilter: vendorFilter
  }
  return result
}

export const SearchBarDisp = connect(mapStateToProps)(searchBarDisp);
