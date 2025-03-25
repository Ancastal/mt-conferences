import { Conference } from "@/types/conference";
import { getDeadlineInLocalTime } from '@/utils/dateUtils';
import { formatDistanceToNow, isPast, isValid } from "date-fns";
import { AlarmClock, CalendarDays, Clock, Globe, Tag } from "lucide-react";
import { useState } from "react";
import ConferenceDialog from "./ConferenceDialog";

const ConferenceCard = ({
  title,
  full_name,
  year,
  date,
  deadline,
  timezone,
  tags = [],
  link,
  note,
  abstract_deadline,
  city,
  country,
  venue,
  ...conferenceProps
}: Conference) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const deadlineDate = getDeadlineInLocalTime(deadline, timezone);
  
  // Add validation before using formatDistanceToNow
  const getTimeRemaining = () => {
    if (!deadlineDate || !isValid(deadlineDate)) {
      return 'TBD';
    }
    
    if (isPast(deadlineDate)) {
      return 'Deadline passed';
    }
    
    try {
      return formatDistanceToNow(deadlineDate, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting time remaining:', error);
      return 'Invalid date';
    }
  };

  const timeRemaining = getTimeRemaining();

  // Create location string by concatenating city and country
  const location = [city, country].filter(Boolean).join(", ");

  // Determine countdown color based on days remaining
  const getCountdownColor = () => {
    if (!deadlineDate || !isValid(deadlineDate)) return "text-neutral-600";
    try {
      const daysRemaining = Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (daysRemaining <= 7) return "text-red-600";
      if (daysRemaining <= 30) return "text-orange-600";
      return "text-green-600";
    } catch (error) {
      console.error('Error calculating countdown color:', error);
      return "text-neutral-600";
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('a') && 
        !(e.target as HTMLElement).closest('.tag-button')) {
      setDialogOpen(true);
    }
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    const searchParams = new URLSearchParams(window.location.search);
    const currentTags = searchParams.get('tags')?.split(',') || [];
    
    let newTags;
    if (currentTags.includes(tag)) {
      newTags = currentTags.filter(t => t !== tag);
    } else {
      newTags = [...currentTags, tag];
    }
    
    if (newTags.length > 0) {
      searchParams.set('tags', newTags.join(','));
    } else {
      searchParams.delete('tags');
    }
    
    const newUrl = `${window.location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    window.history.pushState({}, '', newUrl);
    window.dispatchEvent(new CustomEvent('urlchange', { detail: { tag } }));
  };

  return (
    <>
      <div 
        className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-5 flex flex-col cursor-pointer transform hover:-translate-y-1 border border-neutral-100"
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-primary">
            {title} {year}
          </h3>
          {link && (
            <a 
              href={link}
              target="_blank"
              rel="noopener noreferrer" 
              className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label="Visit conference website"
            >
              <Globe className="h-4 w-4 flex-shrink-0 text-primary" />
            </a>
          )}
        </div>
        
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center text-neutral-600">
            <CalendarDays className="h-4 w-4 mr-2 flex-shrink-0 text-primary-light" />
            <span className="text-sm">{date}</span>
          </div>
          {location && (
            <div className="flex items-center text-neutral-600">
              <Globe className="h-4 w-4 mr-2 flex-shrink-0 text-primary-light" />
              <span className="text-sm">{location}</span>
            </div>
          )}
          <div className="flex items-center text-neutral-600">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-primary-light" />
            <span className="text-sm">
              {deadline === 'TBD' ? 'TBD' : deadline}
            </span>
          </div>
          <div className="flex items-center">
            <AlarmClock className={`h-4 w-4 mr-2 flex-shrink-0 ${getCountdownColor()}`} />
            <span className={`text-sm font-medium ${getCountdownColor()}`}>
              {timeRemaining}
            </span>
          </div>
        </div>

        {Array.isArray(tags) && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto pt-2">
            {tags.map((tag) => (
              <button
                key={tag}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                onClick={(e) => handleTagClick(e, tag)}
              >
                <Tag className="h-3 w-3 mr-1.5" />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <ConferenceDialog
        conference={{
          title,
          full_name,
          year,
          date,
          deadline,
          timezone,
          tags,
          link,
          note,
          abstract_deadline,
          city,
          country,
          venue,
          ...conferenceProps
        }}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};

export default ConferenceCard;
