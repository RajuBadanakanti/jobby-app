import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUserInput = event => {
    this.setState({username: event.target.value})
  }

  onChangePasswordInput = event => {
    this.setState({password: event.target.value})
  }

  submitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  submitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password} = this.state
    const {showSubmitError, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="bg-login-container">
        <div className="login-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo-img"
          />
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <label htmlFor="userInput" className="label-text">
              USERNAME
            </label>
            <input
              id="userInput"
              type="text"
              className="input-container"
              placeholder="Username"
              value={username}
              onChange={this.onChangeUserInput}
            />

            <label htmlFor="passwordInput" className="label-text">
              PASSWORD
            </label>
            <input
              id="passwordInput"
              type="Password"
              className="input-container"
              placeholder="Password"
              value={password}
              onChange={this.onChangePasswordInput}
            />

            <button type="submit" className="submit-login-btn">
              Login
            </button>
            {showSubmitError && (
              <p className="submit-error-msg">* {errorMsg}</p>
            )}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
