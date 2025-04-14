import React, { useState } from 'react';
import PersonalDetail from './forms/PersonalDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Summery from './forms/Summery';
import Experience from './forms/Experience';
import Education from './forms/Education';
import Skills from './forms/Skills';

const FormSection = () => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);
  const { resumeId } = useParams();

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-5">
          <Link to="/dashboard">
            <Button><Home /></Button>
          </Link>
        </div>
        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <Button
              size="sm"
              onClick={() => setActiveFormIndex(activeFormIndex - 1)}
            >
              <ArrowLeft />
            </Button>
          )}
          <Button
            disabled={!enableNext}
            className="flex gap-2"
            size="sm"
            onClick={() => setActiveFormIndex(activeFormIndex + 1)}
          >
            Next <ArrowRight />
          </Button>
        </div>
      </div>

      {/* Step 1: Personal Detail */}
      {activeFormIndex === 1 && (
        <PersonalDetail enabledNext={(v) => setEnableNext(v)} />
      )}

     {/* Step 2: Summary Section */}
     {activeFormIndex === 2 && (
        <Summery enabledNext={(v) => setEnableNext(v)} />
      )}
      {activeFormIndex===3 && (
        <Experience/>
      )}
      {activeFormIndex===4 && (
        <Education/>
      )}
      {activeFormIndex===5 && (
        <Skills/>
      )}
    </div>
  );
};

export default FormSection;
