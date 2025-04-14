import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { generateSummaries } from './../../../../../service/AIModel';

function Summery({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summery, setSummery] = useState(resumeInfo?.summery || "");
  const [loading, setLoading] = useState(false);
  const { resumeId } = useParams();  // Use destructuring like in PersonalDetail.jsx
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState([]);

  // Sync resumeId into context just like in PersonalDetail.jsx
  useEffect(() => {
    if (resumeId && resumeInfo?.resumeId !== resumeId) {
      setResumeInfo((prev) => ({
        ...prev,
        resumeId: resumeId,
      }));
    }
  }, [resumeId]);

  useEffect(() => {
    if (summery) {
      setResumeInfo({
        ...resumeInfo,
        summery: summery,
      });
    }
  }, [summery, resumeInfo]);

  const GenerateSummeryFromAI = async () => {
    setLoading(true);
    
    try {
      if (!resumeInfo?.jobTitle) {
        toast.error("Please enter a job title first");
        setLoading(false);
        return;
      }
      
      const result = await generateSummaries(resumeInfo?.jobTitle);
      console.log("Full AI response:", result);
      
      if (Array.isArray(result) && result.length > 0) {
        setAiGenerateSummeryList(result);
        toast.success("Summaries generated successfully");
      } else {
        console.error("Received an empty array or malformed response:", result);
        toast.error("No valid summaries were generated. Please try again.");
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!resumeId) throw new Error('Missing resume ID!');

      const payload = {
        data: {
          summery: summery,
        },
      };

      console.log(`Saving summary to resume ID: ${resumeId}`, payload);
      
      await GlobalApi.UpdateResumeDetail(resumeId, payload);
      enabledNext(true);
      toast.success("Summary updated successfully");
    } catch (error) {
      console.error('❌ Error saving summary:', error);
      console.error('💥 Strapi response:', error?.response?.data);
      toast.error("Failed to save summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add a summary for your job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label>Add Summary</label>
            <Button
              variant="outline"
              onClick={GenerateSummeryFromAI}
              type="button"
              size="sm"
              className="border-primary text-primary flex gap-2"
              disabled={loading}
            >
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
              Generate from AI
            </Button>
          </div>
          <Textarea
            className="mt-5"
            required
            value={summery}
            onChange={(e) => setSummery(e.target.value)}
            placeholder="Enter a professional summary or generate one with AI"
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin mr-2" /> : null}
              Save
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummeryList.length > 0 && (
        <div className="my-5">
          <h2 className="font-bold text-lg">Suggestions</h2>
          {aiGeneratedSummeryList.map((item, index) => (
            <div
              key={index}
              onClick={() => setSummery(item?.summary)}
              className="p-5 shadow-lg my-4 rounded-lg cursor-pointer hover:bg-slate-50"
            >
              <h2 className="font-bold my-1 text-primary">
                Level: {item?.experience_level}
              </h2>
              <p>{item?.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summery;