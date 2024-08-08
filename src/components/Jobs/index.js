import {Component} from 'react'
import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch, BsBriefcaseFill} from 'react-icons/bs'
import {MdStar, MdLocationOn} from 'react-icons/md'

import Header from '../Header'

import FilterGroups from '../FilterGroups'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const profileViewconstats = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const jobsViewconstats = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileData: {},
    jobsData: [],
    apiProfileStatus: profileViewconstats.initial,
    apiJobsStatus: jobsViewconstats.initial,
    activeEmpTypes: [],
    activeSalary: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsDetails()
  }

  // Profile Data >>>>>>>>
  getProfileData = async () => {
    this.setState({apiProfileStatus: profileViewconstats.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      const updateProfileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileData: updateProfileData,
        apiProfileStatus: profileViewconstats.success,
      })
    } else {
      this.setState({apiProfileStatus: profileViewconstats.failure})
    }
  }

  // Profile Views >>>>>>>>>>>>>>>>>>>>>>>>>>
  renderProfileSuccessView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData

    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="bio-para">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div className="profile-button-container">
      <button type="button" className="profile-retry-btn">
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  // Jobs Data  Filters >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  onEnterkey = event => {
    if (event.key === 'Enter') {
      this.getJobsDetails()
    }
  }

  onClickSearchBtn = () => {
    this.getJobsDetails()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onChangeSalaryRange = salary => {
    this.setState({activeSalary: salary}, this.getJobsDetails)
  }

  onChangeEmploymentType = activeType => {
    // if input not in Active List else in List
    const {activeEmpTypes} = this.state
    const inputNotInList = activeEmpTypes.filter(
      eachType => eachType === activeType,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          activeEmpTypes: [...prevState.activeEmpTypes, activeType],
        }),
        this.getJobsDetails,
      )
    } else {
      const filteredData = activeEmpTypes.filter(
        eachType => eachType !== activeType,
      )

      this.setState({activeEmpTypes: filteredData}, this.getJobsDetails)
    }
  }

  getJobsDetails = async () => {
    const {activeEmpTypes, activeSalary, searchInput} = this.state

    this.setState({apiJobsStatus: jobsViewconstats.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiJobsUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmpTypes}&minimum_package=${activeSalary}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearear ${jwtToken}`,
      },
    }
    const response = await fetch(apiJobsUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedJobsData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsData: updatedJobsData,
        apiJobsStatus: jobsViewconstats.success,
      })
    } else {
      this.setState({apiJobsStatus: jobsViewconstats.failure})
    }
  }

  renderProfileStatusViews = () => {
    const {apiProfileStatus} = this.state
    switch (apiProfileStatus) {
      case profileViewconstats.success:
        return this.renderProfileSuccessView()
      case profileViewconstats.failure:
        return this.renderProfileFailureView()
      case profileViewconstats.inProgress:
        return this.renderLoaderView()
      default:
        return ''
    }
  }

  // JOBS CONTENT VIEWS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-img"
      />
      <h1 className="no-jobs-header">No Jobs Found</h1>
      <p className="no-job-description">
        We could not find any jobs.Try other filters.
      </p>
    </div>
  )

  renderJobscontentSuccessView = () => {
    const {jobsData} = this.state
    const isEmptyJobsData = jobsData.length
    if (isEmptyJobsData !== 0) {
      return (
        <ul className="jobs-ul-container">
          {jobsData.map(eachJob => (
            <Link to={`/jobs/${eachJob.id}`}>
              <li key={eachJob.id} className="jobs-items-container">
                <div className="company-logo-title-container">
                  <img
                    src={eachJob.companyLogoUrl}
                    alt="company Logo"
                    className="company-logo"
                  />
                  <div className="title-radio-div">
                    <h1 className="job-title">{eachJob.title}</h1>
                    <div className="star-rating-div">
                      <MdStar size="22" color="#fbbf24" />
                      <p className="rating-text">{eachJob.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="location-type-package-container">
                  <div className="location-div">
                    <MdLocationOn size="22" color="#ffffff" />
                    <p className="job-location">{eachJob.location}</p>
                    <BsBriefcaseFill
                      size="22"
                      color="#ffffff"
                      className="brief-case-icon"
                    />
                    <p className="job-location">{eachJob.employmentType}</p>
                  </div>
                  <p className="job-package">{eachJob.packagePerAnnum}</p>
                </div>
                <hr className="hr-line" />
                <p className="description">Description</p>
                <p className="job-description">{eachJob.jobDescription}</p>
              </li>
            </Link>
          ))}
        </ul>
      )
    }
    return this.renderNoJobsView()
  }

  rederJobsContentFailureView = () => (
    <div className="jobs-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <p className="job-failure-header">Oops! Something Went Wrong</p>
      <p className="job-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="job-failure-retry-btn">
        Retry
      </button>
    </div>
  )

  renderJobscontentSection = () => {
    const {apiJobsStatus} = this.state
    switch (apiJobsStatus) {
      case jobsViewconstats.success:
        return this.renderJobscontentSuccessView()
      case jobsViewconstats.failure:
        return this.rederJobsContentFailureView()
      case jobsViewconstats.inProgress:
        return this.renderLoaderView()
      default:
        return ''
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="bg-Jobs-container">
          <div className="jobs-main-container">
            <div className="profile-content-section">
              {this.renderProfileStatusViews()}
              <hr className="hr-line" />
              <FilterGroups
                employmentTypesList={employmentTypesList}
                salaryRangesList={salaryRangesList}
                onChangeEmploymentType={this.onChangeEmploymentType}
                onChangeSalaryRange={this.onChangeSalaryRange}
              />
            </div>
            <div className="jobs-content-section">
              <div className="search-input-btn-container">
                <input
                  type="search"
                  placeholder="Search"
                  className="search-input"
                  value={searchInput}
                  onChange={this.onChangeSearchInput}
                  onKeyDown={this.onEnterkey}
                />
                <button
                  type="button"
                  data-testid="searchButton"
                  className="search-button"
                  onClick={this.onClickSearchBtn}
                >
                  <BsSearch className="search-icon" />
                  ..
                </button>
              </div>
              {this.renderJobscontentSection()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
