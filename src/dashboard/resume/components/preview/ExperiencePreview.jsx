import React from "react";

function ExperiencePreview({ resumeInfo }) {
  if (!resumeInfo?.Experience || resumeInfo.Experience.length === 0) {
    return null;
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

      {resumeInfo?.Experience.map((experience, index) => (
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
              {experience?.startDate} To{" "}
              {experience?.endDate || "Present"}
            </span>
          </h4>
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
