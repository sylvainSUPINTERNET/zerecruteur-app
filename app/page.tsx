'use client'

import Image from 'next/image'
import Link from 'next/link';
import ObserverWrapper from './components/ObserverWrapper';


export default function Home() {
  return (
    <main>

      <ObserverWrapper>
        <form id="buy-button">
          <button type="submit">
            xd
          </button>
        </form>
      </ObserverWrapper>

      <div className="overflow-y-scroll h-10">
        
      <ObserverWrapper>
        <p id="xd">ok</p>
      </ObserverWrapper>

        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>
        <p>ok</p>


      </div>



      <div>
        <Link href={`/dashboard/jobseeker`}>Continuer en job seeker</Link>
      </div>
      <div>
        <Link href={`/dashboard/recruiter`}>Continuer en recruteur</Link>
      </div>
    </main>
  )
}
