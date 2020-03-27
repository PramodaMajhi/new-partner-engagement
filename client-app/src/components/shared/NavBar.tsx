import React from 'react'
import { Navbar, Button, Form, Nav, FormLabel, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter, RouteProps } from 'react-router';
import profile from '../../img/profile-clinician@2x.png'
import logo from '../../img/logo_bsc@2x.png'
import './navbar.css'
import { logout } from '../../actions/logout';
import { LOGOUT, ACCESS_TOKEN } from '../../actions/types';
import { resetLoginInfo } from '../../components/login/LoginUtil';
import * as currentUserModel from '../../models/currentUser';
import { GADataLayer } from '../../utils'

interface INavBarDispProps {
    email?: string,
    accessToken?: string,
    currentUser?: currentUserModel.CurrentUser,
    dispatch?: (name: any) => any
}

class navBar extends React.Component<INavBarDispProps & RouteComponentProps<any>, any> {


    handleLogout = async () => {
        // TODO: call logout api once backend auth is working
        await this.props.dispatch(logout(this.props.accessToken, this.onLogout));
        await this.props.dispatch({ type: ACCESS_TOKEN, payload: null });
         // GA tag
         let dataLayer = GADataLayer();
         dataLayer.push({
             'event': 'virtualPageView',
             'pageName': 'logout'
         });
    }

    onLogout = () => {
        resetLoginInfo();
        this.props.history.push('/login');
    }


    render() {
        let showButton = (JSON.parse(localStorage.getItem("loggedinUser")) && JSON.parse(localStorage.getItem("loggedinUser")).email)
        return (
            <div>
                {showButton ?
                    <>
                        <Navbar className="rectangle">
                            <Navbar.Brand href="/search">
                                <img className="logo" src={logo} />
                            </Navbar.Brand>
                            <Nav>
                                <LogOut handleLogout={this.handleLogout} currentUser={this.props.currentUser} />
                            </Nav>
                        </Navbar>
                    </> : null
                }
            </div>
        )
    }
}



const mapStateToProps = (state: any, ownProps: INavBarDispProps & RouteComponentProps) => {
    const currentUser = state.user.currentUser;
    const email = currentUser ? currentUser.email : '';
    const accessToken = state.user.accessToken ? state.user.accessToken : '';
    const result = {
        email: email,
        accessToken: accessToken,
        currentUser: currentUser
    }
    return result
}

export const NavBar = connect(mapStateToProps)(withRouter(navBar));


export const LogOut = (props) => {
    const { handleLogout, currentUser } = props
    console.log(currentUser);
    let localStoreCurrUser = JSON.parse(localStorage.getItem("loggedinUser"))

    return (
        <>
            <Button variant="outline-info" className="mr-sm-3" onClick={handleLogout}>LOGOUT</Button>
            <Col className="user-section">
                <div className="userName">{localStoreCurrUser ? (localStoreCurrUser.firstName + ' ' + localStoreCurrUser.lastName) : ''}</div>
                <div className="designation">{localStoreCurrUser ? localStoreCurrUser.title : ''}</div>
            </Col>
        </>
    )
}
