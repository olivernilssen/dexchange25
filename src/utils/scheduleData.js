import yaml from 'js-yaml';

export function parseScheduleData(yamlData) {
  try {
    const data = yaml.load(yamlData);
    return data;
  } catch (e) {
    console.error('Error parsing YAML data:', e);
    return null;
  }
}

export function getFormattedTime(dateTimeString) {
  // Format: "2025-04-09:10.30" to "10:30"
  const timeStr = dateTimeString.split(':')[1];
  return timeStr.replace('.', ':');
}

export function getFormattedDate(dateTimeString) {
  // Format: "2025-04-09:10.30" to "April 9"
  const dateStr = dateTimeString.split(':')[0];
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}