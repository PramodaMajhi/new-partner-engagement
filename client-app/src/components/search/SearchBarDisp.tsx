import * as React from 'react';
import { connect } from 'react-redux';
import Form from "react-jsonschema-form";
import { RouteComponentProps } from 'react-router';
import { Row, Col } from 'react-bootstrap';
import SearchBar from 'material-ui-search-bar'
import AutoComplete from 'material-ui/AutoComplete';
import iconBSCLogo from '../../img/BSC-Logo-Lrg@2x.png';
import * as currentUserModel from '../../models/currentUser';
import { login } from '../../actions/login';
import { startGet } from '../../actions/get'
import { setValues } from '../../actions/values'
import { VendorSearchList } from './VendorsSearchList'

import '../../css/login.css';

interface ISearchProps {
  vendors?: any,
  vendorFilter?: string,
  dispatch?: (name: any) => any,
}
interface ISearchState {
  vendors?: any,
  searchString?: string,
  toggle?: boolean
}


class searchBarDisp extends React.Component<ISearchProps & RouteComponentProps, ISearchState> {

  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
      vendors: [], toggle: false
    };
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
  }

  render() {
    const { vendors, vendorFilter } = this.props
    console.log("Vendor filter ==> " + vendorFilter);
    console.log(vendors);

    let businessUnit = vendorFilter;
    let filteredVendor = this.state.vendors;
    if (businessUnit != '' && businessUnit != 'All')  {
       filteredVendor = this.state.vendors.filter(v => {
        return v.businessUnit === businessUnit;
      })
     
    }
    let _vendors = filteredVendor
    let search = this.state.searchString.trim().toLowerCase();

    if (search.length > 0) {
      _vendors = _vendors.filter((vendor) => {
        return vendor.vendorName.toLowerCase().match(search) || vendor.businessType.toLowerCase().match(search) || vendor.businessUnit.toLowerCase().match(search);
      });
    }
    return (
      <div>
        <Row className="justify-content-center" id="loginPageLogo">
          <img src={iconBSCLogo} />
        </Row>
        <Row className="justify-content-center" id="loginPageTitle">
          {/* <h3>Start Up/Vendor Assessment</h3> */}
        </Row>
        <div className="searchBar">
          <SearchBar
            value={this.state.searchString}
            onChange={(newValue) => this.handleChange(newValue)}
            onRequestSearch={(newValue) => this.onRequestSearch(newValue)}
            style={{
              margin: '0 auto',
              maxWidth: 1200
            }} />
        </div>
        <div className="search-result-section">
          <ul>
            {_vendors.map((l, i) => {
              return (
                <li key={i}>
                  {l.vendorName} <a href="#">{l.businessType}</a>
                </li>
              );
            })}
          </ul>
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
              <div className="sm-2" onClick={() => { this.handlePushSearch('Vendor Contacts') }}>
                <div className="search_option">
                  Vendor Contacts
             </div>
              </div>
              <div className="sm-2" onClick={() => { this.handlePushSearch('BSC Contacts') }}>
                <div className="search_option">
                  BSC Contacts
              </div>
              </div>
              <div className="sm-2" onClick={() => { this.handlePushSearch('Health Innovation Technology') }}>
                <div className="search_option">
                  Health Innovation Technology
              </div>
              </div>
            </div>
          </> : <>
            <div className="search-result-section browse-text" >
              <span className="browse" onClick={this.handleBrowse}> Browse</span> <span className="arrow"> > </span>
              {
                <span className="browse-search-text"> {businessUnit} {'(' + _vendors.length + ')'}</span>
              }

            </div>
          </>

        }
        {vendorFilter != '' ?
          <VendorSearchList vendors={_vendors} /> : ''
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
