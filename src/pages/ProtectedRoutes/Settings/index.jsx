import React from 'react'
import { LoaderPinwheel } from 'lucide-react'
import { useAuth } from '@/context/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function SettingsPage() {
  const authContext = useAuth();
  const { user, role: userRole, handleSignOut } = authContext || {};

  const handleLogout = async () => {
    await handleSignOut();
  }

  return (
    <div className='flex items-center justify-center p-10 bg-slate-100 flex-col gap-6'>
      <h1 className='text-xl font-semibold'>Settings Page</h1>
      <h1 className='text-xl font-semibold flex gap-2 items-center justify-center'><LoaderPinwheel className=' animate-spin' />work in progress </h1>
      <div className='flex gap-6 justify-between items-center'>
        <AlertDialog >
          <AlertDialogTrigger asChild>
            <button className='bg-red-500 text-white px-4 py-2 rounded-md'>Sign Out</button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to sign out?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action will sign you out of the application
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default SettingsPage
