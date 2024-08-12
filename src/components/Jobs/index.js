import {Component} from 'react'
import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch, BsBriefcaseFill} from 'react-icons/bs'
import {MdStar, MdLocationOn} from 'react-icons/md'

import Header from '../Header'

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
    activeSalary: 0,
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
        <img src={profileImageUrl} className="profile-img" alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="bio-para">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div className="profile-button-container">
      <button
        type="button"
        data-testid="button"
        className="profile-retry-btn"
        onClick={this.getProfileData}
      >
        Retry
      </button>
    </div>
  )

  renderProfileLoaderView = () => (
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

  onChangeSalaryRange = event => {
    this.setState({activeSalary: event.target.value}, this.getJobsDetails)
  }

  onChangeEmploymentType = event => {
    // if input not in Active List else in List
    const {activeEmpTypes} = this.state
    const inputNotInList = activeEmpTypes.filter(
      eachType => eachType === event.target.value,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          activeEmpTypes: [...prevState.activeEmpTypes, event.target.value],
        }),
        this.getJobsDetails,
      )
    } else {
      const filteredData = activeEmpTypes.filter(
        eachType => eachType !== event.target.value,
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
        return this.renderProfileLoaderView()
      default:
        return ''
    }
  }

  // JOBS CONTENT VIEWS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  renderJobscontentSuccessView = () => {
    const {jobsData} = this.state
    const isRenderJobsData = jobsData.length > 0

    return isRenderJobsData ? (
      <ul className="jobs-ul-container">
        {jobsData.map(job => (
          <li key={job.id} className="jobs-items-container">
            <Link to={`/jobs/${job.id}`} className="link">
              <div className="company-logo-title-container">
                <img
                  src={job.companyLogoUrl}
                  alt="company logo"
                  className="company-logo"
                />
                <div className="title-radio-div">
                  <h1 className="job-title">{job.title}</h1>
                  <div className="star-rating-div">
                    <MdStar size="22" color="#fbbf24" />
                    <p className="rating-text">{job.rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-type-package-container">
                <div className="location-div">
                  <MdLocationOn size="22" color="#ffffff" />
                  <p className="job-location">{job.location}</p>
                  <BsBriefcaseFill
                    size="22"
                    color="#ffffff"
                    className="brief-case-icon"
                  />
                  <p className="job-location">{job.employmentType}</p>
                </div>
                <p className="job-package">{job.packagePerAnnum}</p>
              </div>
              <hr className="hr-line" />
              <h1 className="description">Description</h1>
              <p className="job-description">{job.jobDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
    ) : (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-jobs-img"
          alt="no jobs"
        />
        <h1 className="no-jobs-header">No Jobs Found</h1>
        <p className="no-job-description">
          We could not find any jobs.Try other filters
        </p>
      </div>
    )
  }

  rederJobsContentFailureView = () => (
    <div className="jobs-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1 className="job-failure-header">Oops! Something Went Wrong</h1>
      <p className="job-failure-description">
        We cannot seem to find the page you are looking for
      </p>

      <button
        type="button"
        data-testid="button"
        className="job-failure-retry-btn"
        onClick={this.getJobsDetails}
      >
        Retry
      </button>
    </div>
  )

  renderJobsLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderAllJobContentSection = () => {
    const {apiJobsStatus} = this.state
    switch (apiJobsStatus) {
      case jobsViewconstats.success:
        return this.renderJobscontentSuccessView()
      case jobsViewconstats.failure:
        return this.rederJobsContentFailureView()
      case jobsViewconstats.inProgress:
        return this.renderJobsLoaderView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="bg-Jobs-container">
          <div className="jobs-main-container">
            {/*  ...................  Profile Content.......................  */}
            <div className="profile-content-section">
              {this.renderProfileStatusViews()}
              <hr className="hr-line" />
              {/*  ................... Filters Content.......................  */}

              <div className="type-employment-container">
                <h1 className="filters-header">Types of Employment</h1>
                <ul className="checkbox-ul-container">
                  {employmentTypesList.map(eachEmp => (
                    <li
                      key={eachEmp.employmentTypeId}
                      className="checkbox-items-container"
                      onChange={this.onChangeEmploymentType}
                    >
                      <input
                        type="checkbox"
                        className="checkbox-input"
                        value={eachEmp.employmentTypeId}
                        id={eachEmp.employmentTypeId}
                      />
                      <label
                        htmlFor={eachEmp.employmentTypeId}
                        className="label-text"
                      >
                        {eachEmp.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <hr className="hr-line" />
              <div className="type-employment-container">
                <h1 className="filters-header">Salary Range</h1>
                <ul className="checkbox-ul-container">
                  {salaryRangesList.map(eachSalary => (
                    <li
                      key={eachSalary.salaryRangeId}
                      className="checkbox-items-container"
                      onChange={this.onChangeSalaryRange}
                    >
                      <input
                        type="radio"
                        id={eachSalary.salaryRangeId}
                        className="checkbox-input"
                        value={eachSalary.salaryRangeId}
                      />
                      <label
                        htmlFor={eachSalary.salaryRangeId}
                        className="label-text"
                      >
                        {eachSalary.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="jobs-content-section">
              {/*  ................... Search Icon Content.......................  */}
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
              {/*  ...................  Job Card Content .......................  */}
              {this.renderAllJobContentSection()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
