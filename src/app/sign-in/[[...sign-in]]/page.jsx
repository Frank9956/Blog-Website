import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className='flex mx-auto items-center justify-center p-3'>
      <SignIn />
    </div>
  );
}
