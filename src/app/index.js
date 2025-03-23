import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import EventSchedule from '../components/Schedule/old/EventSchedule';
import { parseScheduleData } from '../utils/scheduleData';

export default function Home() {
  const [scheduleData, setScheduleData] = useState(null);
  
  useEffect(() => {
    async function fetchScheduleData() {
      try {
        const response = await fetch('/schedule.yaml');
        const yamlText = await response.text();
        const parsedData = parseScheduleData(yamlText);
        setScheduleData(parsedData);
      } catch (error) {
        console.error('Error fetching schedule data:', error);
      }
    }
    
    fetchScheduleData();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>d:exchange 2025 - Event Schedule</title>
        <link rel="icon" href="/favicon.png" />
        <link rel="stylesheet" href="/fonts/hero.css" />
      </Head>
      
      <Header />
      
      <main>
        {scheduleData ? (
          <EventSchedule scheduleData={scheduleData} />
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-[#081079]">Loading schedule...</p>
          </div>
        )}
      </main>
      
      <footer className="bg-[#081079] text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>d:exchange 2025 - April 9-10, 2025</p>
        </div>
      </footer>
    </div>
  );
}