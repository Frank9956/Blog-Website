import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className='flex mx-auto items-center justify-center p-3'>
      <SignUp />
    </div>
  );
}
