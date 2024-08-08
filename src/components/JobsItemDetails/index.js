import {Component} from 'react'

import Cookies from 'js-cookie'

import {MdStar, MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'

import './index.css'

class JobsItemDetails extends Component {
  state = {
    jobItemDetalis: {},
    similarJobDetails: {},
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
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
        company_logo_url: eachSimiData.company_logo_url,
        employment_type: eachSimiData.employment_type,
        job_description: eachSimiData.job_description,
        location: eachSimiData.location,
        rating: eachSimiData.rating,
        title: eachSimiData.title,
      }))

      this.setState({
        jobItemDetalis: updatedJobsDetails,
        similarJobDetails: updateSimilarJobDetails,
      })
    }
  }

  renderJobDetailsSuccessView = () => {
    const {jobItemDetalis, similarJobDetails} = this.state
    const {skills, lifeAtCompany} = jobItemDetalis
    const {description} = lifeAtCompany
    
    console.log(description)
    // TypeError: Cannot destructure property 'description' of 'lifeAtCompany' as it is undefined.

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      id,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobItemDetalis

    return (
      <div className="job-details-container">
        <div className="job-company-title-rating-container">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="job-items-company-logo"
          />
          <div className="job-item-title-rating-div">
            <p className="job-item-title">{title}</p>
            <div className="job-item-star-rating-div">
              <MdStar size="24" color="#fbbf24" />
              <p className="job-item-rating-text">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-item-location-type-salary-container">
          <div className="job-item-location-div">
            <MdLocationOn size="24" color="#ffffff" />
            <p className="job-item-location">{location}</p>
            <BsBriefcaseFill
              size="22"
              color="#ffffff"
              className="brief-case-icon"
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
            <BiLinkExternal size="22" color="#4f46e5" />
          </a>
        </div>
        <p className="job-items-description">{jobDescription}</p>
        <h1 className="job-item-skills-text">Skills</h1>
        <h1 className="job-item-skills-text">Life at Company</h1>
      </div>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="bg-job-items-container">
          <div className="job-details-bgcontainer">
            {this.renderJobDetailsSuccessView()}
          </div>
        </div>
      </>
    )
  }
}

export default JobsItemDetails
