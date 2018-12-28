import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';

import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.6
}

class BurgerBuilder extends Component {

    state = {
        ingredients : null,

        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount(){
        axios.get("ingredients.json")
        .then(response => {
            this.setState({ ingredients: response.data });
        })
        .catch(error=>{
            this.setState({error:true});
        });
    }

    updatePurchaseState(ingredients){

        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce((sum,el) => {
                return sum + el;
            },0);
        this.setState({purchaseable: sum > 0});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {

        const queryParams = [];

        for(let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) 
                + '=' 
                + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname:'/checkout',
            search: '?' + queryString
        });
    }

    addIngredientHandler = (type) => {
        const oldcount = this.state.ingredients[type];
        const updatedCount = oldcount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddiction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddiction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldcount = this.state.ingredients[type];
        if(oldcount <= 0) return;
        const updatedCount = oldcount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing : true});
    }

    render(){

        const disabledInfo = {
            ...this.state.ingredients
        }

        for( let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let order = null;
        let burger = this.state.error ? <p>Can't access server</p> : <Spinner/>;

        if(this.state.ingredients){
            order = <OrderSummary 
            price={this.state.totalPrice.toFixed(2)}
            ingredients = {this.state.ingredients}
            purchaseCancelled = {this.purchaseCancelHandler} 
            purchaseContinued = {this.purchaseContinueHandler}/>;

            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls 
                        disabled={disabledInfo}
                        ingredientAdded = {this.addIngredientHandler} 
                        ingredientRemoved = {this.removeIngredientHandler}
                        purchaseable = {this.state.purchaseable}
                        ordered = {this.purchaseHandler}
                        price={this.state.totalPrice}/>
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

export default withErrorHandler(BurgerBuilder, axios);