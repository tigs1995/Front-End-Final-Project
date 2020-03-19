import React, { Component } from 'react';
import axios from 'axios';
import DataInput from '../DataInput';
import { CHECK_EXISTING_CITIZEN, BASE_URL } from '../../config/Constants.json';
import styled from 'styled-components';
import "../../CSS/CitizenSearch.css";

const Styles = styled.div`
  div {
    text-align: center;
    margin: 15%;

    input {
    
        padding: 0.5em;
        margin: 0.5em;
        color: ${props => props.inputColor || "palevioletred"};
        background: papayawhip;
        border-radius: 3px;
      }
}
`;

const Button = styled.button`
width: 90%;
padding: 5px;
border: 0;
background-color: lightgrey;
margin-bottom: 3px;
border-radius: 3px;
margin-top: 15px;
margin-bottom: 15px;
background-color:#CB0000;
color: white;
`;

export default class CitizenSearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            forenames: null,
            surname: null,
            errorMessage: null
        }
    }

    handleChange = ({ target }) => {
        this.setState({ [target.name]: target.value });
    }

    handleSubmit = e => {
        e.preventDefault();
        axios.post(`${BASE_URL}${CHECK_EXISTING_CITIZEN}`, { forenames: this.state.forenames, surname: this.state.surname }).then(response => {
            if (response.data.Error) {
                this.setState({ errorMessage: response.dataError });
            }
            else if (response.data === false) {
                this.setState({ errorMessage: 'Citizen not found.' });
            }
            else {
                this.props.history.push(`CitizenList/${this.state.forenames}/${this.state.surname}`);
            }
        })
    }


    render() {
        return (
            <Styles>
                <div id="citSearch">
                    <h4>Citizen Search</h4>
                    <form id="citizenForm" onSubmit={this.handleSubmit}>

                        <DataInput type='text' placeholder='Forenames' name='forenames' onChange={this.handleChange}></DataInput>
                        <DataInput type='text' placeholder='Surname' name='surname' onChange={this.handleChange}></DataInput>

                        <Button>Search</Button>
                        <span className='error'>{this.state.errorMessage}</span>
                    </form>
                </div>
            </Styles>

        )
    }
}
