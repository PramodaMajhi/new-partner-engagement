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
import { GADataLayer, domainAndUrl } from '../../utils'
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
import psl from 'psl'
import '../../css/login.css';
import ReactGA from 'react-ga'
import { CONF } from '../../conf'

interface ISearchProps {
  vendors?: any,
  searchVal?: string,
  singleVendor?: any,
  dispatch?: (name: any) => any,
}
interface ISearchState {
  searchString?: string,
  toggle?: boolean,
  showModal?: boolean,
  profileImage?: [],
  width?: Number,
}


class searchBarDisp extends React.Component<ISearchProps & RouteComponentProps, ISearchState> {

  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
      toggle: false,
      showModal: false,
      profileImage: [],
      width: 1140
    };
  }

  componentDidMount() {
    this.props.dispatch(startGet('vendors'))
    window.addEventListener("resize", () => {
      this.setState({ width: window.innerWidth });
    });
    // GA tag
    let dataLayer = GADataLayer();
    dataLayer.push({
      'event': 'virtualPageView',
      'pageName': 'search'
    });
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

    // Search for GA
    let dataLayer = GADataLayer();
    const searchEventAction = this.props.vendors.length ? 'Success' : 'Failure'
    dataLayer.push({
      'event': 'eventTracker',
      'eventCategory': 'Partner Record Search',
      'eventAction': searchEventAction,
      'eventLabel': newValue
    });

  }
  onRequestSearch = (newValue: any) => {
    //  console.log("on-search-requested" + newValue);
  }



  closeModal = () => {
    this.setState({ showModal: false, })
  }

  addVendor = async (singleVendor, profileImg) => {

    const website = singleVendor.website;

    const values = domainAndUrl(website);
    const strUrl = values[0];
    const domain = values[1];

    singleVendor['domain'] = domain;
    singleVendor['website'] = strUrl;
    const sessionUser = JSON.parse(localStorage.getItem("loggedinUser"));
    if (Object.entries(sessionUser).length) {
      singleVendor.createdBy = {
        id: sessionUser.id,
        firstName: sessionUser.firstName,
        lastName: sessionUser.lastName,
        email: sessionUser.email
      }
    }

    let id
    let fileAttachContainer = {}
    await startInsert('vendors', singleVendor)(this.props.dispatch)
      .then(_id => {
        id = _id
       // console.log("generated", id);
        fileAttachContainer["name"] = id
      })

    await createAttachment('attachments', fileAttachContainer)(this.props.dispatch)
    this.setState({ profileImage: profileImg })
    this.fileUpload(fileAttachContainer, profileImg);
    // GA tag
    let dataLayer = GADataLayer();
    dataLayer.push({
      'event': 'eventTracker',
      'eventCategory': 'Partner Records Add or Edit',
      'eventAction': 'Partner Record Add',
      'eventLabel': 'Success'
    });
  }

  fileUpload = async (containerName, profileImg) => {
    await startUpload(containerName.name, profileImg)(this.props.dispatch)
    // let imageLogoUrl = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://localhost:3001/partnerengage-api/api'

    if (profileImg.length) {
      let vendorObj = {
        id: containerName.name,
        profileLogo: `${CONF.APP_API_URL.API_URL}/attachments/${containerName.name}/download/${profileImg[0].name}`
      }
      await startMerge('vendors', vendorObj)
    }
    this.props.dispatch(startGet('vendors'));
  }

  openModal = () => {
    this.setState({ showModal: true })
  }

  render() {
    const { vendors, searchVal, singleVendor } = this.props
    const { width } = this.state

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
              hintText={width < 992 ? "Search partners" : "Partner name, focus area or business unit"} />
          </div>
        </div>
        <div className="container">

          <div className="partner-action">
            <div className="browse-text" >
              <span className="browse">All Partners</span> <span className="arrow"></span>
              {
                <span className="browse-search-text"> {'(' + vendors.length + ')'}</span>
              }
            </div>
            <div className="browse-text addPartner" onClick={this.openModal}>
              {
                sessionUser.userType !== 'limited' ? '+ ADD NEW PARTNER' : ''
              }
            </div>
            {
              this.state.showModal &&
              (<AddNewVendorModal close={this.closeModal}
                addVendor={this.addVendor}
                vendors={this.props.vendors}
                singleVendor={singleVendor}
                isEdit={false} />)
            }
          </div>
          <VendorSearchList vendors={vendors} search={searchVal} />

        </div>
      </>
    )
  }
}

const mapStateToProps = (state: any, ownProps: ISearchProps) => {


  let singleVendor = [{
    vendorName: "",
    description: "",
    imageUrl: "",
    website: "",
    domain: "",
    keyFocusArea: "",
    profileLogo: "",
    hasAttachment: false,
    attachments: [],
    businessUnit: [],
    vendorContact: {},
    bscContact: {},
    maturityLevel: {},
    processStage: {},
    events: [],
    createdBy: {},
    modifiedBy: {}
  }]

  const result = {
    vendors: sel.searchPartnersSel(state),
    searchVal: sel.searchFilterSel(state),
    singleVendor: singleVendor
  }
  return result
}

export const SearchBarDisp = connect(mapStateToProps)(searchBarDisp);
