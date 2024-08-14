import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {MdStar, MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobItemDetalis: {},
    similarJobDetails: {},
    apiJobItemsStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({apiJobItemsStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props

    const {params} = match
    const {id} = params
    console.log(id)

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)

    if (response.ok === true) {
      const updatedJobsDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
        id: data.job_details.id,

        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },

        skills: data.job_details.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
      }

      const updateSimilarJobDetails = data.similar_jobs.map(eachSimiData => ({
        companyLogoUrl: eachSimiData.company_logo_url,
        employmentType: eachSimiData.employment_type,
        jobDescription: eachSimiData.job_description,
        location: eachSimiData.location,
        rating: eachSimiData.rating,
        title: eachSimiData.title,
        id: eachSimiData.id,
      }))

      this.setState({
        jobItemDetalis: updatedJobsDetails,
        similarJobDetails: updateSimilarJobDetails,
        apiJobItemsStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobItemsStatus: apiStatusConstants.failure})
    }
  }

  renderJobItemsFailureView = () => (
    <div className="job-items-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-item-failure-img"
      />
      <h1 className="job-items-failure-header">Oops! Something Went Wrong</h1>
      <p className="job-items-failure-description">
        We cannot seem to find the page you are looking for
      </p>

      <button
        type="button"
        data-testid="button"
        className="job-items-failure-retry-btn"
        onClick={this.getJobItemDetails}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemsSuccessView = () => {
    const {jobItemDetalis, similarJobDetails} = this.state
    const {skills, lifeAtCompany} = jobItemDetalis
    const {description, imageUrl} = lifeAtCompany

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobItemDetalis

    return (
      <div className="job-details-bgcontainer">
        <div className="job-details-container">
          <div className="job-company-title-rating-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-items-company-logo"
            />
            <div className="job-item-title-rating-div">
              <h1 className="job-item-title">{title}</h1>
              <div className="job-item-star-rating-div">
                <MdStar
                  size="24"
                  color="#fbbf24"
                  className="job-item-star-icon"
                />
                <p className="job-item-rating-text">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-item-location-type-salary-container">
            <div className="job-item-location-div">
              <MdLocationOn
                size="24"
                color="#ffffff"
                className="job-item-location-icon"
              />
              <p className="job-item-location">{location}</p>
              <BsBriefcaseFill
                size="22"
                color="#ffffff"
                className="job-item-brif-icon"
              />
              <p className="job-item-location">{employmentType}</p>
            </div>
            <p className="job-item-package">{packagePerAnnum}</p>
          </div>
          <hr className="hr-line" />
          <div className="job-item-description-visit-container">
            <h1 className="job-item-description-text">Description</h1>

            <a href={companyWebsiteUrl} className="visit-link">
              <p className="visit-text">Visit</p>
              <BiLinkExternal
                size="22"
                color="#4f46e5"
                className="job-item-visit-icon"
              />
            </a>
          </div>
          <p className="job-items-description">{jobDescription}</p>
          {/*  ................... Skills .......................  */}
          <h1 className="job-item-skills-text">Skills</h1>
          <ul className="skill-ul-container">
            {skills.map(eachSkill => (
              <li key={eachSkill.name} className="skill-li-container">
                <img
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                  className="skill-img"
                />
                <p className="skill-name">{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          {/*  ................... Life at Company .......................  */}
          <h1 className="job-item-skills-text">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="life-at-company-description">{description}</p>
            <img
              src={imageUrl}
              className="life-at-company-img"
              alt="life at company"
            />
          </div>
        </div>
        {/*  ................... Similar Jobs  .......................  */}
        <h1 className="similar-job-text">Similar Jobs</h1>
        <ul className="similar-jobs-ul-container">
          {similarJobDetails.map(eachSimiData => (
            <li key={eachSimiData.id} className="similar-job-li-container">
              <div className="job-company-title-rating-container-similar-jobs">
                <img
                  src={eachSimiData.companyLogoUrl}
                  alt="similar job company logo"
                  className="job-items-company-logo-similar-jobs"
                />
                <div className="job-item-title-rating-div-similar-jobs">
                  <h1 className="job-item-title-similar-jobs">
                    {eachSimiData.title}
                  </h1>
                  <div className="job-item-star-rating-div-similar-jobs">
                    <MdStar
                      size="22"
                      color="#fbbf24"
                      className="job-item-star-icon-similar-jobs"
                    />
                    <p className="job-item-rating-text-similar-jobs">
                      {eachSimiData.rating}
                    </p>
                  </div>
                </div>
              </div>
              <h1 className="similar-data-description-text">Description</h1>
              <p className="similar-data-description">
                {eachSimiData.jobDescription}
              </p>
              <div className="job-item-location-type-salary-container">
                <div className="job-item-location-div-similar-jobs">
                  <MdLocationOn
                    size="20"
                    color="#ffffff"
                    className="job-item-location-icon-similar-jobs"
                  />
                  <p className="job-item-location-similar-jobs">
                    {eachSimiData.location}
                  </p>
                  <BsBriefcaseFill
                    size="18"
                    color="#ffffff"
                    className="job-item-brief-case-icon"
                  />
                  <p className="job-item-location-similar-jobs">
                    {eachSimiData.employmentType}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderAllJobItemDetails = () => {
    const {apiJobItemsStatus} = this.state
    switch (apiJobItemsStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobItemsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return ''
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="bg-job-items-container">
          {this.renderAllJobItemDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
