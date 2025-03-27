'use client'
import { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import ScheduleView from '../components/schedule_temp/ScheduleView';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import yaml from 'js-yaml';
import { ScheduleData } from '../types/schedule';

export default function Home() {
  const [rawYaml, setRawYaml] = useState('');
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [yamlDebug, setYamlDebug] = useState(false);
  
  useEffect(() => {
    async function fetchScheduleData() {
      try {
        console.log("Fetching YAML file...");
        const response = await fetch('/schedule.yaml');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch schedule: ${response.status} ${response.statusText}`);
        }
        
        const yamlText = await response.text();
        setRawYaml(yamlText);
        
        // Check if we're getting HTML instead of YAML
        if (yamlText.includes('<!DOCTYPE html>') || yamlText.includes('<html>')) {
          throw new Error('Received HTML instead of YAML. File may be missing.');
        }
        
        try {
          // Parse the YAML directly and type cast it
          const parsedData = yaml.load(yamlText) as ScheduleData;
          
          console.log("Parsed data structure:", parsedData);
          
          // Validate the data structure
          if (!parsedData || !parsedData.schedule || !parsedData.schedule.days) {
            throw new Error('Invalid YAML structure: Missing required schedule.days property');
          }
          
          setScheduleData(parsedData);
        } catch (parseError: unknown) {
          console.error("YAML parse error:", parseError);
          setError(`YAML parsing error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }
      } catch (error: any) {
        console.error('Error fetching schedule data:', error);
        setError(error.message);
      }
    }
    
    fetchScheduleData();
  }, []);
  
  return (
    <FavoritesProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p className="font-bold">Error</p>
              <p>{error}</p>
              <div className="mt-4">
                <button 
                  onClick={() => setYamlDebug(!yamlDebug)}
                  className="text-blue-500 underline"
                >
                  {yamlDebug ? "Hide YAML" : "View YAML Content"}
                </button>
                
                {yamlDebug && (
                  <pre className="mt-2 text-xs bg-gray-800 text-white p-2 rounded overflow-auto max-h-60">
                    {rawYaml ? rawYaml.substring(0, 1000) + "..." : "No YAML content"}
                  </pre>
                )}
              </div>
              <p className="mt-4 text-sm">
                Make sure the file 'schedule.yaml' exists in the public folder and has valid YAML syntax.
              </p>
            </div>
          ) : scheduleData ? (
            <ScheduleView scheduleData={scheduleData} />
          ) : (
            <div>Loading...</div>
          )}
        </main>
        
        <footer className="bg-[#081079] text-white py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>d:exchange 2025 - April 9-10, 2025</p>
          </div>
        </footer>
      </div>
    </FavoritesProvider>
  );
}