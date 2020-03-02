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
import { startInsert, createAttachment } from "../../actions/insert"
import { startMerge } from "../../actions/merge"
import { startUpload } from "../../actions/upload"
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
  upload?: any,
  dispatch?: (name: any) => any,
}
interface ISearchState {
  vendors?: any,
  searchString?: string,
  toggle?: boolean,
  showModal?: boolean,
  profileImage?: []
}


class searchBarDisp extends React.Component<ISearchProps & RouteComponentProps, ISearchState> {

  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
      vendors: [],
      toggle: false,
      showModal: false,
      profileImage: []
    };
  }

  componentDidMount() {
    this.props.dispatch(startGet('vendors'))
    // this.props.dispatch(startGet('attachments'))
    this.setState({ vendors: this.props.vendors });
  }
  componentWillReceiveProps(nextProps: ISearchProps) {
    if ((this.props.vendors && nextProps.vendors &&
      (this.props.vendors.length !== nextProps.vendors.length))) {
      this.props.dispatch(startGet('vendors'))
      // this.props.dispatch(startGet('attachments'))
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

  addVendor = async (formData, businessUnit, maturityLevel, processStage, profileImg) => {

    if (formData && businessUnit) {
      console.log(businessUnit)

    }
    let urlObj = url.parse(formData.website.value);
    let domain = urlObj.hostname
    let values = {
      vendorName: formData.name.value,
      businessUnit: businessUnit,
      keyFocusArea: formData.keyfocus.value,
      website: formData.website.value,
      domain: domain.toLowerCase(),
      maturityLevel: maturityLevel,
      processStage: processStage,
      vendorContact: {
        name: formData.contactName.value,
        title: formData.title.value,
        phone: formData.phone.value,
        email: formData.email.value
      },
      bscContact: {
      },
      attachments: []

    }
    let id
    let fileAttachContainer = {}
    await startInsert('vendors', values)(this.props.dispatch)
      .then(_id => {
        id = _id
        console.log("generated", id);
        fileAttachContainer["name"] = id
      })

    await createAttachment('attachments', fileAttachContainer)(this.props.dispatch)
    this.setState({ profileImage: profileImg })
    this.fileUpload(fileAttachContainer, profileImg);
  }

  fileUpload = async (containerName, profileImg) => {
    await startUpload(containerName.name, profileImg)(this.props.dispatch)
    let imageLogoUrl = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://localhost:3001/api'
    let vendorObj = {
      id: containerName.name,
      profileLogo: `${imageLogoUrl}/attachments/${containerName.name}/download/${profileImg[0].name}`
    }
    await startMerge('vendors', vendorObj)
    this.props.dispatch(startGet('vendors'));
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
      <>
        <div className="searchBarContainer">
          <div className="searchBar">
            <SearchBar
              value={this.state.searchString}
              onChange={(newValue) => this.handleChange(newValue)}
              onRequestSearch={(newValue) => this.onRequestSearch(newValue)}
              style={{
                margin: '0 auto',
                maxWidth: 1140,               
              }}
              hintText="Partner name, contact, or focus area" />
          </div>
        </div>
        <div className="container">

          <Row>
            <Col className="search-result-section browse-text" >
              <span className="browse">All Partners</span> <span className="arrow"> > </span>
              {
                <span className="browse-search-text"> {'(' + _vendors.length + ')'}</span>
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
          <VendorSearchList vendors={_vendors} search={search} />

        </div>
      </>
    )
  }
}

const mapStateToProps = (state: any, ownProps: ISearchProps) => {

  const vendors = state.entitiesData.vendors.data;
  let upload = state.upload
  const vendorFilter = 'All'//state.values.vendorFilter // commented due to no department wise filter displayed all the vendors
  const result = {
    vendors: vendors,
    vendorFilter: vendorFilter,
    upload: upload
  }
  return result
}

export const SearchBarDisp = connect(mapStateToProps)(searchBarDisp);
