import Image from 'next/image'
import Link from 'next/link';

export default function Home() {
  
  return (
    <main>
      <div>
        <Link href={`/dashboard/jobseeker`}>Continuer en job seeker</Link>
      </div>
      <div>
        <Link href={`/dashboard/recruiter`}>Continuer en recruteur</Link>
      </div>
    </main>
  )
}
