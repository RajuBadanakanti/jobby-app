import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

class Home extends Component {
  render() {
    return (
      <>
        <Header />
        <div className="bg-lg-Home-container">
          <div className="home-content-container">
            <h1 className="home-heading">Find The Job That Fits Your Life</h1>
            <p className="home-description">
              Millions of People are searching for jobs, salary information,
              company reviews.Find the job that fits your abilities and
              potential.
            </p>
            <Link to="/jobs">
              <button
                type="button"
                className="find-jobs-btn"
                onClick={this.onClickFindJobsBtn}
              >
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </>
    )
  }
}

export default Home
