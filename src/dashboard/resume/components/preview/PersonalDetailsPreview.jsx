import React from 'react';

function PersonalDetailPreview({ resumeInfo }) {
  const personal = resumeInfo?.personalInfo || {};

  return (
    <div>
      <h2
        className="font-bold text-xl text-center"
        style={{ color: resumeInfo?.themeColor }}
      >
        {personal.firstName} {personal.lastName}
      </h2>

      <h2 className="text-center text-sm font-medium">
        {personal.jobTitle}
      </h2>

      <h2
        className="text-center font-normal text-xs"
        style={{ color: resumeInfo?.themeColor }}
      >
        {personal.address}
      </h2>

      <div className="flex justify-between">
        <h2
          className="font-normal text-xs"
          style={{ color: resumeInfo?.themeColor }}
        >
          {personal.phone}
        </h2>
        <h2
          className="font-normal text-xs"
          style={{ color: resumeInfo?.themeColor }}
        >
          {personal.email}
        </h2>
      </div>

      <hr
        className="border-[1.5px] my-2"
        style={{ borderColor: resumeInfo?.themeColor }}
      />
    </div>
  );
}

export default PersonalDetailPreview;
