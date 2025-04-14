import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GlobalApi from './../../../../../service/GlobalApi';
import { LoaderCircle } from 'lucide-react';

function PersonalDetail({ enabledNext }) {
  const { resumeId } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [formData, setFormData] = useState(resumeInfo?.personalInfo || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resumeId && resumeInfo?.resumeId !== resumeId) {
      setResumeInfo((prev) => ({
        ...prev,
        resumeId: resumeId,
      }));
    }
  }, [resumeId]);

  useEffect(() => {
    if (resumeInfo?.personalInfo) {
      setFormData(resumeInfo.personalInfo);
    }
  }, [resumeInfo?.personalInfo]);

  const handleInputChange = (e) => {
    enabledNext(false);
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);
    setResumeInfo((prev) => ({
      ...prev,
      personalInfo: updatedFormData,
    }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!resumeId) throw new Error('Missing resume ID!');

      const payload = {
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          jobTitle: formData.jobTitle,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
        },
      };

      const response = await GlobalApi.UpdateResumeDetail(resumeId, payload);
      console.log('Save successful:', response);
      enabledNext(true);
    } catch (error) {
      console.error('Error saving resume:', error);
      // Handle error cases with detailed messages
      if (error?.response?.status === 400) {
        console.error('Validation error - check your data structure and field names');
      } else if (error?.response?.status === 401 || error?.response?.status === 403) {
        console.error('Authentication or permission issue with Strapi');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Personal Detail</h2>
      <p>Get Started with the basic information</p>
      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div>
            <label className="text-sm">First Name</label>
            <Input
              name="firstName"
              value={formData?.firstName || ''}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm">Last Name</label>
            <Input
              name="lastName"
              value={formData?.lastName || ''}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Job Title</label>
            <Input
              name="jobTitle"
              value={formData?.jobTitle || ''}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Address</label>
            <Input
              name="address"
              value={formData?.address || ''}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <Input
              name="phone"
              value={formData?.phone || ''}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input
              name="email"
              value={formData?.email || ''}
              required
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetail;
