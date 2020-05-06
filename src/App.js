import React from "react";
import { ConnectedFileInput } from "./components/FileInput";
import {createStore} from 'redux';
import { Provider } from 'react-redux'

import {reducer} from './reducers/index'
import { ConnectedErrorMessage } from "./components/ErrorMessage";
import { ConnectedMetaData } from "./components/MetaData";
import { ConnectedMap } from "./components/Map";
import { ConnectedTable } from "./components/Table";
import { ConnectedViewSwitch } from "./components/ViewSwitch";
import styled from "styled-components";
import Logo from './assets/CameraMatics-logo.png'
// @ts-ignore
let store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

let AppContainer = styled.main`
  body{
    padding: 0;
    margin: 0;
  }
  *{
    box-sizing: border-box
  }

  width: 100vw;
  height: 100vh;
  background-color: #12284b;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 10vh 10vh 80vh;
  grid-template-areas: "header" "input" "output";

`

let LogoContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  grid-area: header;
  width: 100%;
  height: 100%;
`
let LogoComponent = styled.img`
  height: 80%;
  width: auto
`

let InputContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  grid-area: input;
  width: 100%;
  height: 100%;
`

let OutputContainer = styled.section`
  grid-area: output;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 15% 10% 75%;
  grid-template-areas: "meta" "toggle" "main"
`

let MainContainer  = styled.section`
  grid-area: main
`
export function App() {
  return (
    <Provider store={store}>
      <AppContainer>
        <LogoContainer>
          <LogoComponent src={Logo} />
        </LogoContainer>
        <InputContainer>
          <ConnectedFileInput/>
        </InputContainer>
        <OutputContainer>
          <ConnectedMetaData/>
          <ConnectedViewSwitch/>
          <MainContainer>
            <ConnectedErrorMessage/>
            <ConnectedMap/>
            <ConnectedTable/>
          </MainContainer>
        </OutputContainer>
      </AppContainer>
    </Provider>
  )
}
