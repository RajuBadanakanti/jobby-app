//

import './index.css'

const FilterGroups = props => {
  const {employmentTypesList, salaryRangesList} = props
  const {onChangeEmploymentType, onChangeSalaryRange} = props

  return (
    <>
      <div className="type-employment-container">
        <h1 className="filters-header">Types of Employment</h1>
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
        <h1 className="filters-header">Salary Range</h1>
        <ul className="checkbox-ul-container">
          {salaryRangesList.map(eachSalary => {
            const onSelectSalaryRange = event => {
              onChangeSalaryRange(event.target.value)
            }

            return (
              <li
                key={eachSalary.salaryRangeId}
                className="checkbox-items-container"
                onChange={onSelectSalaryRange}
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
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default FilterGroups
