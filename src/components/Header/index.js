import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {MdHome} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <div className="header-container">
      <div className="menu-items-container">
        <Link to="/" className="header-link">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-header-logo"
          />
        </Link>

        <div className="sm-header-items-div">
          <Link to="/" className="header-link">
            <MdHome size="26" className="header-icons" />
          </Link>

          <Link to="/jobs" className="header-link">
            <BsBriefcaseFill size="20" className="header-icons" />
          </Link>

          <button type="button" className="sm-logout-btn">
            <FiLogOut
              size="20"
              className="header-icons"
              onClick={onClickLogout}
            />
            .
          </button>
        </div>

        <div className="lg-header-items-div">
          <Link to="/" className="header-link">
            <p className="home-job-text">Home</p>
          </Link>

          <Link to="/jobs" className="header-link">
            <p className="home-job-text">Jobs</p>
          </Link>
        </div>

        <button type="button" className="logout-button" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}
export default withRouter(Header)
