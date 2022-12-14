import CartContext from "./cart-context";
import { useReducer } from "react";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = function (state, action) {
  if (action.type === "ADD") {
    const updatedTotalAmount =
      state.totalAmount + action.item.amount * action.item.price;

    const itemExistIndex = state.items.findIndex(
      (cur) => cur.id === action.item.id
    );
    const itemExist = state.items[itemExistIndex];

    let updatedItems;
    if (itemExist) {
      let updatedItem;
      updatedItem = {
        ...itemExist,
        amount: itemExist.amount + action.item.amount,
      };

      updatedItems = [...state.items];
      updatedItems[itemExistIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }
    return { items: updatedItems, totalAmount: updatedTotalAmount };
  }

  if (action.type === "REMOVE") {
    const itemIndex = state.items.findIndex((cur) => cur.id === action.id);
    const item = state.items[itemIndex];
    let updatedItems = [...state.items];

    if (item.amount === 1) {
      updatedItems = updatedItems.filter((cur) => cur.id !== item.id);
    } else {
      const updatedItem = {
        ...item,
        amount: --item.amount,
      };
      updatedItems[itemIndex] = updatedItem;
    }

    const updatedTotalAmount = state.totalAmount - item.price;
    return { items: updatedItems, totalAmount: updatedTotalAmount };
  }

  if (action.type === "RESET") {
    return defaultCartState;
  }

  return defaultCartState;
};

const CartContextProvider = function (props) {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemsToCartHandler = function (item) {
    dispatchCartAction({ type: "ADD", item: item });
  };

  const removeItemsFromCartHandler = function (id) {
    dispatchCartAction({ type: "REMOVE", id: id });
  };

  const resetHandler = function () {
    dispatchCartAction({ type: "RESET" });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemsToCartHandler,
    removeItem: removeItemsFromCartHandler,
    resetCart: resetHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
