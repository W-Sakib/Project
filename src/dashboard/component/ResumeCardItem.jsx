import { Notebook } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

function ResumeCardItem({ resume }) {
  return (
    <Link to={`/dashboard/resume/${resume.documentId}/edit`}>
      <div className="p-14 bg-secondary flex flex-col items-center justify-center h-[250px] border border-primary hover:scale-110 transition-all hover:shadow-md rounded-xl">
        <Notebook className="w-10 h-10" />
        <h2 className="text-center mt-4 text-lg font-semibold">{resume.title}</h2>
      </div>
    </Link>
  );
}

export default ResumeCardItem;
