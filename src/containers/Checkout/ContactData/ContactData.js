import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import './ContactData.css';

import { connect } from 'react-redux';

import axios from '../../../axios-orders';

class ContactData extends Component{

    state= {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: ''
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Address'
                },
                value: ''
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Zip Code'
                },
                value: ''
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: ''
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your email'
                },
                value: ''
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: ''
            }
        },
        loading : false
    }

    orderHandler = (event) => {
        event.preventDefault();

        this.setState({loading: true});

        const formData = {};

        for(let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = 
                this.state.orderForm[formElementIdentifier].value;
        }

        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData
        }

        axios.post('/orders.json', order)
            .then(response => {
                console.log(response)
                this.setState({loading: false})
                this.props.history.push('/');
            })
            .catch(error => {
                console.log(error)
                this.setState({loading: false})
            });
    }

    inputChangedHandler = (event, inputIdentifier) => {
        
        const updatedOderForm = {
            ...this.state.orderForm
        }
        const updatedFormElement = {
            ...updatedOderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedOderForm[inputIdentifier] = updatedFormElement;

        this.setState({orderForm: updatedOderForm});
    }

    render(){


        const formElementsArray = [];

        for ( let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (<form onSubmit={this.orderHandler}>

            {formElementsArray.map( formElement => (
                <Input 
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig = { formElement.config.elementConfig} 
                    value={formElement.config.value}
                    changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
            ))}
                
                <Button btnType="Success">Order</Button>
            </form>);
        if (this.state.loading){
            form = <Spinner/>
        }

        return (
            <div className="ContactData" >

                <h4>Enter your Contact Data</h4>
                {form}
                
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

export default connect(mapStateToProps)(ContactData);