import * as React from 'react';
import { connect } from 'react-redux';
import Form from "react-jsonschema-form";
import { RouteComponentProps } from 'react-router';
import { Row, Col, Button } from 'react-bootstrap';
import iconBSCLogo from '../../img/logo_bsc@2x.png';
import * as currentUserModel from '../../models/currentUser';
import { login } from '../../actions/login';

import '../../css/login.css';


const loginJsonSchema = {
  "description": "",
  "type": "object",
  "required": [
    "email",
    "password"
  ],
  "properties": {
    "email": {
      "type": "string",
      "title": "Email"
    },
    "password": {
      "type": "string",
      "title": "Password"
    }
  }
};

const loginUISchema = {
  "email": {
    "ui:autofocus": true
  },
  "password": {
    "ui:widget": "password"
  }
};

function formFieldsTemplate(props) {
  const { id, classNames, label, help, required, description, errors, children } = props;
  return (
    <div className={classNames}>
      <label htmlFor={id}>{label}{required ? "" : null}</label>
      {description}
      {children}
      {errors}
      {help}
    </div>
  );
}

let loginFormData;

interface ILoginDispProps {
  id?: number,
  email?: string,
  firstName?: string,
  lastName?: string,
  userType?: string,
  emailVerified?: boolean,
  loggedinUser?: any,
  accessToken?: any,
  loginError?: any,
  dispatch?: (name: any) => any,
  currentUser?: currentUserModel.CurrentUser
}

class LoginDisp extends React.Component<ILoginDispProps & RouteComponentProps, {}> {

  constructor(props) {
    super(props);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = ({ formData }) => {
    this.props.dispatch(login(formData));
  }

  onChangeInput({ formData }) {
    loginFormData = { formData }.formData;
  }

  render() {

    const sessionUser = JSON.parse(localStorage.getItem("loggedinUser"));

    if (this.props.loggedinUser) {
      localStorage.setItem("loggedinUser", JSON.stringify(this.props.loggedinUser))
      localStorage.setItem("accessToken", JSON.stringify(this.props.accessToken))
    }

    if (this.props.userType || sessionUser && sessionUser.userType) {
      const termsAccepted = (this.props.loggedinUser && this.props.loggedinUser.termsAccepted)
        || (sessionUser.termsAccepted);
      if (termsAccepted) {
        this.props.history.push('/search');
      }
    }

    return (
      <div className="container">
        <Row className="justify-content-center" id="loginPageLogo">
          <img src={iconBSCLogo} style={{ width: '147px', height: '57px' }} />
        </Row>
        <Row className="justify-content-center" id="loginPageTitle">
          <h1 className="heading">Welcome to the Partner Intelligence Tool</h1>

        </Row>
        <Row className="justify-content-center">
          <h6>Enter your details below</h6>
        </Row>
        {this.props.loginError &&
          <div className='login-error'>invalid email or password, please try again.</div>
        }
        <Form id="loginForm"
          schema={loginJsonSchema}
          uiSchema={loginUISchema}
          onSubmit={this.onSubmit}
          onChange={this.onChangeInput}
          formData={loginFormData}
          FieldTemplate={formFieldsTemplate}>
          <div>
            {/* <Row>
              <Col>
                <Link to="/accountrecovery"><span>Forgot your password?</span></Link> 
              </Col>
               <Col> 
                {/* <Button className='btn-log-in btn-block' type="submit">LOG IN</Button> 
              {/* </Col> 
            </Row> */}
            <Button className='btn-log-in btn btn-primary btn-block' type="submit">LOG IN</Button>
          </div>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: ILoginDispProps) => {
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

export const Login = connect(mapStateToProps)(LoginDisp);
