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

import '../../css/login.css';

interface ISearchProps {    
  }
  

class searchBarDisp extends React.Component<ISearchProps & RouteComponentProps, {}> {

  constructor(props) {
    super(props);    
  }

  

  render() {

    return (
      <div>
        <Row className="justify-content-center" id="loginPageLogo">
          <img src={iconBSCLogo} />
        </Row>
        <Row className="justify-content-center" id="loginPageTitle">
          <h3>Start Up/Vendor Assessment</h3>
        </Row>   
        <div className="searchBar">
          <SearchBar
              onChange={() => console.log('onChange')}
              onRequestSearch={() => console.log('onRequestSearch')}
              style={{
                  margin: '0 auto',
                  maxWidth: 1200
           }}/>
        </div>    
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: ISearchProps) => {
  const currentUser = state.user ? state.user.currentUser : '';
  const userType = currentUser ? currentUser.userType : '';
  const loginError = currentUser ? currentUser.error : '';
  const accessToken = state.user ? state.user.accessToken : null;
  const result = {
    userType: userType,
    loggedinUser: currentUser,
    loginError: loginError,
    accessToken: accessToken
  }
  return result
}

export const SearchBarDisp = connect(mapStateToProps)(searchBarDisp);
