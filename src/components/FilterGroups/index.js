//

import './index.css'

const FilterGroups = props => {
  const {employmentTypesList, salaryRangesList} = props
  const {onChangeEmploymentType, onChangeSalaryRange} = props

  return (
    <>
      <div className="type-employment-container">
        <p className="filters-header">Types of Employment</p>
        <ul className="checkbox-ul-container">
          {employmentTypesList.map(eachEmp => {
            const onSelectEmploymentType = event => {
              onChangeEmploymentType(event.target.value)
            }

            return (
              <li
                key={eachEmp.employmentTypeId}
                className="checkbox-items-container"
                onChange={onSelectEmploymentType}
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
            )
          })}
        </ul>
      </div>
      <hr className="hr-line" />
      <div className="type-employment-container">
        <p className="filters-header">Salary Range</p>
        <ul className="checkbox-ul-container">
          {salaryRangesList.map(eachEmp => {
            const onSelectSalaryRange = event => {
              onChangeSalaryRange(event.target.value)
            }

            return (
              <li
                key={eachEmp.salaryRangeId}
                className="checkbox-items-container"
                onChange={onSelectSalaryRange}
              >
                <input
                  type="radio"
                  id={eachEmp.salaryRangeId}
                  className="checkbox-input"
                  value={eachEmp.salaryRangeId}
                />
                <label htmlFor={eachEmp.salaryRangeId} className="label-text">
                  {eachEmp.label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default FilterGroups
