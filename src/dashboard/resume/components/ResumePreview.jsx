import React, { useContext } from 'react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import PersonalDetailPreview from './preview/PersonalDetailsPreview';
import SummeryPreview from './preview/SummeryPreview';
import ExperiencePreview from './preview/ExperiencePreview';
import EducationalPreview from './preview/EducationalPreview';
import SkillsPreview from './preview/SkillsPreview';
import dummy from '@/data/dummy';  // Import the resume data

function ResumePreview() {
  const { resumeInfo } = useContext(ResumeInfoContext);

  if (!resumeInfo) {
    return null;
  }

  return (
    <div
      className="shadow-lg h-full p-14 border-t-[20px]"
      style={{ borderColor: resumeInfo?.themeColor }}
    >
      {/* Personal Detail Preview */}
      <PersonalDetailPreview resumeInfo={resumeInfo} />

      {/* Summary Preview */}
      <SummeryPreview resumeInfo={resumeInfo} />

      {/* Experience Preview */}
      {resumeInfo?.experience?.length > 0 && (
        <ExperiencePreview resumeInfo={resumeInfo} />
      )}

      {/* Education Preview */}
      <EducationalPreview resumeInfo={resumeInfo} />

      {/* Skills Preview */}
      <SkillsPreview resumeInfo={resumeInfo} />
    </div>
  );
}

export default ResumePreview;
