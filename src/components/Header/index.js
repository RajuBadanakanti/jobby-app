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

        <ul className="sm-header-items-div">
          <Link to="/" className="header-link">
            <li className="li-sm-header-items-div">
              <MdHome size="26" className="header-icons" />
            </li>
          </Link>

          <Link to="/jobs" className="header-link">
            <li className="li-sm-header-items-div">
              <BsBriefcaseFill size="20" className="header-icons" />
            </li>
          </Link>
          <li className="li-sm-header-items-div">
            <button type="button" className="sm-logout-btn">
              <FiLogOut
                size="20"
                className="header-icons"
                onClick={onClickLogout}
              />
              .
            </button>
          </li>
        </ul>

        <ul className="lg-header-items-div">
          <Link to="/" className="header-link">
            <li className="li-sm-header-items-div">
              <p className="home-job-text">Home</p>
            </li>
          </Link>

          <Link to="/jobs" className="header-link">
            <li className="li-sm-header-items-div">
              <p className="home-job-text">Jobs</p>
            </li>
          </Link>
        </ul>

        <button type="button" className="logout-button" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}
export default withRouter(Header)
