'use client'
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import EventSchedule from '../components/Schedule/EventSchedule';
import { parseScheduleData } from '../utils/scheduleData';

export default function Home() {
  const [scheduleData, setScheduleData] = useState(null);
  const [error, setError] = useState(null);
  const [isDebugMode, setIsDebugMode] = useState(false);
  
  useEffect(() => {
    async function fetchScheduleData() {
      try {
        const response = await fetch('/schedule.yaml');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch schedule: ${response.status} ${response.statusText}`);
        }
        
        const yamlText = await response.text();
        
        // Check if we're getting HTML instead of YAML
        if (yamlText.includes('<!DOCTYPE html>') || yamlText.includes('<html>')) {
          throw new Error('Received HTML instead of YAML. File may be missing.');
        }
        
        const parsedData = parseScheduleData(yamlText);
        console.log("Parsed data:", parsedData); // Debug output
        setScheduleData(parsedData);
      } catch (error) {
        console.error('Error fetching schedule data:', error);
        setError(error.message);
      }
    }
    
    fetchScheduleData();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            <p className="mt-2 text-sm">
              Make sure the file 'schedule.yaml' exists in the public folder.
            </p>
          </div>
        ) : scheduleData ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#081079]">Event Schedule</h2>
              <button 
                className="text-sm text-[#6c7cbc] hover:underline"
                onClick={() => setIsDebugMode(!isDebugMode)}
              >
                {isDebugMode ? "Hide Raw Data" : "Show Raw Data"}
              </button>
            </div>
            
            {isDebugMode ? (
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs mb-8">
                {JSON.stringify(scheduleData, null, 2)}
              </pre>
            ) : null}
            
            <EventSchedule scheduleData={scheduleData} />
          </div>
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