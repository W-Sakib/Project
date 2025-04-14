import React, { useContext, useEffect, useState } from 'react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi';
import { LoaderCircle } from 'lucide-react';

function PersonalDetail({ enabledNext }) {
    const { resumeid } = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [formData, setFormData] = useState(resumeInfo?.personalInfo || {});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("Resume ID from params:", resumeid);
    }, [resumeid]);

    const handleInputChange = (e) => {
        enabledNext(false);
        const { name, value } = e.target;

        const updatedFormData = {
            ...formData,
            [name]: value
        };

        setFormData(updatedFormData);
        setResumeInfo({
            ...resumeInfo,
            personalInfo: updatedFormData
        });
    };

    const onSave = async (e) => {
        e.preventDefault();
        setLoading(true);
      
        try {
          console.log('Searching with resumeId:', resumeInfo?.resumeId); // Confirm it logs correctly
      
          const response = await GlobalApi.GetResumeByResumeId(resumeInfo?.resumeId);
          const resumeList = response?.data?.data;
      
          if (resumeList && resumeList.length > 0) {
            const realId = resumeList[0].id;
      
            await GlobalApi.UpdateResumeDetail(realId, formData);
      
            enabledNext(true);
          } else {
            console.error("Resume not found!");
          }
        } catch (error) {
          console.error("Error updating resume:", error);
        } finally {
          setLoading(false);
        }
      };
      
    

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <h2 className='font-bold text-lg'>Personal Detail</h2>
            <p>Get Started with the basic information</p>
            <form onSubmit={onSave}>
                <div className='grid grid-cols-2 mt-5 gap-3'>
                    <div>
                        <label className='text-sm'>First Name</label>
                        <Input
                            name="firstName"
                            defaultValue={resumeInfo?.personalInfo?.firstName}
                            required
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className='text-sm'>Last Name</label>
                        <Input
                            name="lastName"
                            defaultValue={resumeInfo?.personalInfo?.lastName}
                            required
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='col-span-2'>
                        <label className='text-sm'>Job Title</label>
                        <Input
                            name="jobTitle"
                            required
                            defaultValue={resumeInfo?.personalInfo?.jobTitle}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='col-span-2'>
                        <label className='text-sm'>Address</label>
                        <Input
                            name="address"
                            required
                            defaultValue={resumeInfo?.personalInfo?.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className='text-sm'>Phone</label>
                        <Input
                            name="phone"
                            required
                            defaultValue={resumeInfo?.personalInfo?.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className='text-sm'>Email</label>
                        <Input
                            name="email"
                            required
                            defaultValue={resumeInfo?.personalInfo?.email}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className='mt-3 flex justify-end'>
                    <Button type="submit" disabled={loading}>
                        {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default PersonalDetail;
