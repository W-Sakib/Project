import React from 'react';

function ExperiencePreview({ resumeInfo }) {
  // Check if there is experience data
  if (!resumeInfo?.experience || resumeInfo.experience.length === 0) {
    return null;  // If no experience data, return null (nothing will be rendered)
  }

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: resumeInfo?.themeColor }}
      >
        Professional Experience
      </h2>
      <hr style={{ borderColor: resumeInfo?.themeColor }} />

      {resumeInfo?.experience.map((experience, index) => (
        <div key={index} className="my-5">
          <h3
            className="text-sm font-bold"
            style={{ color: resumeInfo?.themeColor }}
          >
            {experience?.title}
          </h3>
          <h4 className="text-xs flex justify-between">
            {experience?.companyName}, {experience?.city}, {experience?.state}
            <span>
              {experience?.startDate} To{' '}
              {experience?.currentlyWorking ? 'Present' : experience?.endDate}
            </span>
          </h4>
          {/* Display work summary if available */}
          {experience?.workSummery && (
            <div
              className="text-xs my-2"
              dangerouslySetInnerHTML={{ __html: experience.workSummery }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default ExperiencePreview;
