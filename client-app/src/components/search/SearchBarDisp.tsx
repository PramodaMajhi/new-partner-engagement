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
import * as sel from '../shared/Selectors'
import '../../css/login.css';

interface ISearchProps {
  vendors?: any,
  searchVal?: string,
  displayVendor?: boolean,
  upload?: any,
  dispatch?: (name: any) => any,
}
interface ISearchState {
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
      toggle: false,
      showModal: false,
      profileImage: []
    };
  }

  componentDidMount() {
    this.props.dispatch(startGet('vendors'))
  }
  componentWillReceiveProps(nextProps: ISearchProps) {
    if ((this.props.vendors && nextProps.vendors &&
      (this.props.vendors.length !== nextProps.vendors.length))) {
      this.props.dispatch(startGet('vendors'))
    }
  }

  handleChange = (newValue: any) => {
    this.setState({ searchString: newValue, toggle: true });
    this.props.dispatch(setValues({ searchVal: newValue }))
  }
  onRequestSearch = (newValue: any) => {
    console.log("on-search-requested" + newValue);
  }

  handlePushSearch = (search) => {
    this.props.dispatch(setValues({ searchVal: search }))
    // const filteredVendor = this.state.vendors.filter(v => {
    //   return v.businessUnit === search;
    // })
    // this.setState({ vendors: filteredVendor });

  }

  handleBrowse = () => {
    this.props.dispatch(setValues({ searchVal: '' }))
    this.props.history.push('/');
  }

  closeModal = () => {
    this.setState({ showModal: false, })
  }

  addVendor = async (formData, businessUnit, maturityLevel, processStage, profileImg, phone) => {

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
        phone: phone,
        email: formData.email.value
      },
      bscContact: {
      },
      attachments: [],
      events: []

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

    if (profileImg.length) {
      let vendorObj = {
        id: containerName.name,
        profileLogo: `${imageLogoUrl}/attachments/${containerName.name}/download/${profileImg[0].name}`
      }
      await startMerge('vendors', vendorObj)
    }
    this.props.dispatch(startGet('vendors'));
  }

  openModal = () => {
    this.setState({ showModal: true })
  }

  render() {
    const { vendors, searchVal } = this.props
    console.log("Rendered");

    const sessionUser = JSON.parse(localStorage.getItem("loggedinUser"));
    if (Object.entries(sessionUser).length === 0) {
      this.props.history.push('/login');
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
                <span className="browse-search-text"> {'(' + vendors.length + ')'}</span>
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
          <VendorSearchList vendors={vendors} search={searchVal} />

        </div>
      </>
    )
  }
}

const mapStateToProps = (state: any, ownProps: ISearchProps) => {
  const result = {
    vendors: sel.searchPartnersSel(state),
    searchVal: sel.searchFilterSel(state),
    upload: sel.upload(state)
  }
  return result
}

export const SearchBarDisp = connect(mapStateToProps)(searchBarDisp);
