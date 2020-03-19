import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../Actions/authActions";
import classnames from "classnames";
import { BASE_URL } from "../config/Constants.json";
import axios from 'axios';
import "../CSS/LoginSignup.css";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            errors: {},
            userNotFound: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push("/HomePage"); // push user to dashboard when they login
        }
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/HomePage");
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value })
        console.log(this.state.username);
    }

    onSubmit = (event) => {
        event.preventDefault();
        const userData = {
            username: this.state.username,
            password: this.state.password
        };
        axios.post(BASE_URL + "/login", userData).then(res => {
            if (res.data.token) {
                this.props.loginUser(res.data.token); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
            }
            else {
                console.log(res);
            }
        }).catch(err => {
            this.setState({ userNotFound: 'Username or password incorrect' })
        })
    }

    onClick = (event) => {
        this.props.history.push('/register');
    }

    render() {
        const { errors } = this.state;
        return (
            <div className="login">
                <h4><b>Login</b></h4>
                <br />
                <form onSubmit={this.onSubmit}>
                    <input placeholder='username' onChange={this.onChange} value={this.state.username} error={errors.username} id="username" type="text" />
                    <br/>
                    <input placeholder='password' onChange={this.onChange} value={this.state.password} error={errors.password} id="password" type="password" />
                    <br/>
                    <button type="submit" id="loginButton">login</button>
                    <br />
                    <span id='error'>{this.state.userNotFound}</span>
                    <br />
                </form>
                <p className="grey-text text-darken-1">Don't have an account?
                    <br/>
                    <button onClick={this.onClick} id='registerButton' to="/register">Register</button>
                </p>
            </div>
        );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(
    mapStateToProps,
    { loginUser }
)(Login);
