import React, { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RichTextEditor from "../RichTextEditor";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../service/GlobalApi";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

const initialFormField = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  workSummery: "",
};

function Experience() {
  const [experinceList, setExperinceList] = useState([]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resumeInfo?.Experience?.length > 0) {
      setExperinceList(resumeInfo.Experience);
    } else {
      setExperinceList([initialFormField]);
    }
  }, [resumeInfo]);

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      Experience: experinceList,
    }));
  }, [experinceList]);

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const updated = [...experinceList];
    updated[index][name] = value;
    setExperinceList(updated);
  };

  const handleRichTextEditor = (e, name, index) => {
    const updated = [...experinceList];
    updated[index][name] = e.target.value;
    setExperinceList(updated);
  };

  const AddNewExperience = () => {
    setExperinceList([...experinceList, { ...initialFormField }]);
  };

  const RemoveExperience = () => {
    if (experinceList.length > 1) {
      setExperinceList((prev) => prev.slice(0, -1));
    }
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        Experience: experinceList.map(({ id, ...rest }) => rest),
      },
    };
    GlobalApi.UpdateResumeDetail(params?.resumeId, data)
      .then((res) => {
        setLoading(false);
        toast("Details updated!");
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Something went wrong");
      });
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Professional Experience</h2>
      <p>Add your previous job experience</p>

      {experinceList.map((item, index) => (
        <div key={index} className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
          <div>
            <label className="text-xs">Position Title</label>
            <Input
              name="title"
              value={item.title}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs">Company Name</label>
            <Input
              name="companyName"
              value={item.companyName}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs">City</label>
            <Input
              name="city"
              value={item.city}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs">State</label>
            <Input
              name="state"
              value={item.state}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs">Start Date</label>
            <Input
              type="date"
              name="startDate"
              value={item.startDate}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs">End Date</label>
            <Input
              type="date"
              name="endDate"
              value={item.endDate}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div className="col-span-2">
            <RichTextEditor
              value={item.workSummery}
              onRichTextEditorChange={(e) =>
                handleRichTextEditor(e, "workSummery", index)
              }
            />
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={AddNewExperience} className="text-primary">
            + Add More Experience
          </Button>
          <Button variant="outline" onClick={RemoveExperience} className="text-primary">
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Experience;
