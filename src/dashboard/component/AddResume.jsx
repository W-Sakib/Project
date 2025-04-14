import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/clerk-react";
import { Loader2, PlusSquare } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from 'uuid';
import GlobalApi from "./../../../service/GlobalApi";


function AddResume() {
        const [openDialog,setOpenDialog]=useState(false)
        const [resumeTitle,setResumeTitle]=useState('');
        const { user }=useUser();
        const [loading,setLoading]=useState(false);
        const navigate=useNavigate();

        const onCreate=async () => {
            setLoading(true)
            const uuid=uuidv4(); 
            const data={
                data:{
                    title:resumeTitle,
                    resumeId:uuid,
                    userEmail:user?.primaryEmailAddress?.emailAddress,
                    userName:user?.fullName,
                    
                    
                }
            };

            GlobalApi.CreateNewResume(data).then(resp=>{
                console.log(resp);
                if(resp)
                {
                    setLoading(false);
                    navigate('/dashboard/resume/'+uuid+'/edit');
                }
            },(error)=>{
                setLoading(false);
            })
        }
    return(
        <div>
            <div className="p-14 py-24 border items-center flex
            justify-center bg-secondary 
            rounded-lg h-[250px]
            hover:scale-107 transition-all hover:shadow-md 
            cursor-pointer border-dotted"
            onClick={()=> setOpenDialog(true)}>
                <PlusSquare/>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new Resume</DialogTitle>
                    <DialogDescription>
                        <p>New Resume Title:</p>
                        <Input className="my-2" onChange={(e)=> setResumeTitle(e.target.value)} />
                    </DialogDescription>
                </DialogHeader>
                    <div className='flex justify-end gap-8'>
                        <Button disabled={!resumeTitle||loading} onClick={()=>onCreate()}>
                            {loading?
                            <Loader2 className='animate-spin' /> : 'Create'
                            }
                        </Button>
                        <Button onClick={()=>setOpenDialog(false)} variant="ghost" >Cancel</Button>
                    </div>
                
            </DialogContent>
        </Dialog>

        </div>
    );
}

export default AddResume;