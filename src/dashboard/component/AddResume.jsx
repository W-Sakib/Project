import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/clerk-react';

import GlobalApi from '../../../service/GlobalApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Loader2, PlusSquare } from 'lucide-react';

function AddResume() {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const onCreate = async () => {
    if (!resumeTitle || !user) return;
    setLoading(true);

    const uuid = uuidv4();

    const data = {
      data: {
        title: resumeTitle,
        resumeId: uuid,
        userEmail: user?.primaryEmailAddress?.emailAddress || '',
        userName: user?.fullName || '',
      }
    };

    try {
      const response = await GlobalApi.CreateNewResume(data);

      if (response?.data?.data?.id) {
        navigate(`/dashboard/resume/${uuid}/edit`);
        setOpenDialog(false);
      } else {
        console.error('Unexpected API response:', response);
      }
    } catch (err) {
      const error = err?.response?.data || err;
      console.error('❌ Failed to create resume:', error);
      alert(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Resume card placeholder */}
      <div
        className="p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg h-[250px]
        hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dotted"
        onClick={() => setOpenDialog(true)}
      >
        <PlusSquare />
      </div>

      {/* Dialog to enter resume title */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new Resume</DialogTitle>
            <DialogDescription>
              <p>New Resume Title:</p>
              <Input
                className="my-2"
                placeholder="e.g. Frontend Developer"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
              />
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-8 mt-4">
            <Button disabled={!resumeTitle || loading} onClick={onCreate}>
              {loading ? <Loader2 className="animate-spin" /> : 'Create'}
            </Button>
            <Button onClick={() => setOpenDialog(false)} variant="ghost">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddResume;
