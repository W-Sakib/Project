import Header from '@/components/custom/Header';
import AddResume from '@/dashboard/component/Addresume';
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import GlobalApi from './../../service/GlobalApi';
import ResumeCardItem from './component/ResumeCardItem';

const Dashboard = () => {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);

  useEffect(() => {
    if (user) {
      GetResumesList();
    }
  }, [user]);

  const GetResumesList = () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return;

    GlobalApi.GetUserResumes(email).then((resp) => {
      console.log("Raw resume list:", resp.data);
      setResumeList(resp.data.data); // ← only .data array
    });
  };

  return (
    <div>
      <Header />
      <div className="p-10 md:px-20 lg:px-32">
        <h3 className="font-bold text-3xl">My Resume</h3>
        <p>Start creating AI resume for your next job role</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 mt-12">
  <AddResume />

  {resumeList.length > 0 &&
    resumeList.map((resume, index) => (
      <ResumeCardItem
        resume={resume}
        key={index}
        refreshData={GetResumesList}
      />
    ))}
</div>

      </div>
    </div>
  );
};

export default Dashboard;
