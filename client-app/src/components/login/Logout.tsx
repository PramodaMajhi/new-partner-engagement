import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Redirect } from 'react-router';
import { Button, Col } from 'react-bootstrap';
import * as currentUserModel from '../../models/currentUser';
import { logout } from '../../actions/logout';
import { LOGOUT, ACCESS_TOKEN } from '../../actions/types';
import { resetLoginInfo } from './LoginUtil';
// import { Redirect } from 'react-router'
// import { SessionTimedOut } from './SessionTimedOut'

interface ILogoutDispProps {
    email?: string,
    accessToken?: string,
    dispatch?: (name: any) => any
}



class LogoutDisp extends React.Component<any & RouteComponentProps, {}> {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick = async () => {

        // remove user from redux storage
        this.props.dispatch({ type: LOGOUT, payload: null });
        // TODO: call logout api once backend auth is working
        await this.props.dispatch(logout(this.props.accessToken, this.onLogout));
        await this.props.dispatch({ type: ACCESS_TOKEN, payload: null });
    }

    componentDidMount() {
        setTimeout(() => {
            this.onClick()
            this.onLogout()
        }, 1000 * 60 * 30);
    }

    componentWillUnmount() {
        clearTimeout();
    }

    onLogout = () => {
        resetLoginInfo();
        this.props.history.push('/login');
    }

    render() {
        let showButton = (JSON.parse(localStorage.getItem("loggedinUser")) && JSON.parse(localStorage.getItem("loggedinUser")).email)
        return (<div>
            {/* {
                showButton ?
                    <>
                        <Button className='btn-log-out'
                            variant="outline-secondary"
                            onClick={this.onClick}>Log Out</Button>

                        <Col className="user-section">
                            <div className="userName">Fabian Bond</div>
                            <div className="designation">Strategist</div>
                        </Col>
                    </> :
                    <>
                        <Redirect to="/" />
                    </>
            } */}

        </div>)
    }
}

const mapStateToProps = (state: any, ownProps: ILogoutDispProps) => {
    const currentUser = state.user.currentUser;
    const email = currentUser ? currentUser.email : '';
    const accessToken = state.user.accessToken ? state.user.accessToken : '';
    const result = {
        email: email,
        accessToken: accessToken
    }
    return result
}

export const Logout = connect(mapStateToProps)(LogoutDisp);
