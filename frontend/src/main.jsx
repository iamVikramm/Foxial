import React from 'react'
import ReactDOM from 'react-dom/client'
import store from './Store/index.jsx'
import {Provider} from 'react-redux';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx'
import {disableReactDevTools} from "@fvilers/disable-react-devtools"

disableReactDevTools()





ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    <ToastContainer 
        position="top-center"
        autoClose={2500}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        
    />
    </Provider>
  </React.StrictMode>,
)
