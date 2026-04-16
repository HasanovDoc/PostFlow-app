import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

class RootStore {
  isUserSubscribed = false; 

  constructor() {
    makeAutoObservable(this);
  }

  setSubscription(status: boolean) {
    this.isUserSubscribed = status;
  }
}

export const rootStore = new RootStore();

export const StoreContext = createContext(rootStore);

export const useStore = () => useContext(StoreContext);