import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';

import axios from '../../axios-orders';
import * as actionTypes from '../../store/actions';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


class BurgerBuilder extends Component {

    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    updatePurchaseState(ingredients){

        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce((sum,el) => {
                return sum + el;
            },0);
        return sum > 0;
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    }

    purchaseHandler = () => {
        this.setState({purchasing : true});
    }

    render(){

        const disabledInfo = {
            ...this.props.ings
        }

        for( let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let order = null;
        let burger = this.state.error ? <p>Can't access server</p> : <Spinner/>;

        if(this.props.ings){
            order = <OrderSummary 
            price={this.props.price.toFixed(2)}
            ingredients = {this.props.ings}
            purchaseCancelled = {this.purchaseCancelHandler} 
            purchaseContinued = {this.purchaseContinueHandler}/>;

            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls 
                        disabled={disabledInfo}
                        ingredientAdded = {this.props.onIngredientAdded} 
                        ingredientRemoved = {this.props.onIngredientRemoved}
                        purchaseable = {this.updatePurchaseState(this.props.ings)}
                        ordered = {this.purchaseHandler}
                        price={this.props.price}/>
                </Aux>
            )
        }
        if( this.state.loading ) {
            order = <Spinner/>;
        }

        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                    {order}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onIngredientAdded: (ingName)=> dispatch({type: actionTypes.ADD_INGREDIENTS, ingredientName:ingName}),
        onIngredientRemoved: (ingName)=> dispatch({type: actionTypes.REMOVE_INGREDIENTS, ingredientName:ingName}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (withErrorHandler(BurgerBuilder, axios));