import ConferenceCard from "@/components/ConferenceCard";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Conference } from "@/types/conference";
import { loadConferences } from "@/utils/conferenceLoader";
import { extractCountry, getAllCountries } from "@/utils/countryExtractor";
import { getDeadlineInLocalTime } from "@/utils/dateUtils";
import { isPast, isValid, parseISO } from "date-fns";
import { Globe, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const Index = () => {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showPastConferences, setShowPastConferences] = useState(false);

  // Load conferences data
  const conferencesData = useMemo(() => loadConferences(), []);

  // Category buttons configuration
  const categoryButtons = [
    { id: "natural-language-processing", label: "Natural Language Processing" },
    { id: "machine-translation", label: "Machine Translation" },
    { id: "multilingual", label: "Multilingual" },
    { id: "speech-recognition", label: "Speech Recognition" },
    { id: "machine-learning", label: "Machine Learning" },
    { id: "computational-linguistics", label: "Computational Linguistics" },
    { id: "language-modeling", label: "Language Modeling" },
    { id: "text-generation", label: "Text Generation" },
    { id: "speech-translation", label: "Speech Translation" },
    { id: "information-retrieval", label: "Information Retrieval" },
    { id: "multimodal", label: "Multimodal" },
    { id: "data-mining", label: "Data Mining" },
  ];

  const filteredConferences = useMemo(() => {
    if (!Array.isArray(conferencesData)) {
      console.error("Conferences data is not an array:", conferencesData);
      return [];
    }

    // Define a list of MT-related tags for auto-selection
    const mtRelatedTags = ['machine-translation', 'natural-language-processing', 'computational-linguistics'];
    
    // Add MT-relevant conferences even if they don't explicitly have MT tags
    const mtRelevantConferences = ['ACL', 'NAACL', 'EMNLP', 'EACL', 'COLING', 'CoNLL', 'WMT', 'AACL', 'LREC', 'AMTA', 'IWSLT'];

    return conferencesData
      .filter((conf: Conference) => {
        // Filter by deadline (past/future)
        const deadlineDate = conf.deadline && conf.deadline !== 'TBD' ? parseISO(conf.deadline) : null;
        const isUpcoming = !deadlineDate || !isValid(deadlineDate) || !isPast(deadlineDate);
        if (!showPastConferences && !isUpcoming) return false;
        
        // Apply tag filtering, if selected
        if (selectedTags.size > 0) {
          if (!conf.tags || !Array.isArray(conf.tags)) return false;
          
          // Check if any selected tag is in the conference tags
          const hasSelectedTag = Array.from(selectedTags).some(tag => conf.tags?.includes(tag));
          if (!hasSelectedTag) return false;
        } else {
          // If no tags selected, only show MT-relevant conferences by default
          if (!conf.tags || !Array.isArray(conf.tags)) {
            // Include based on conference title if it's a known MT-relevant conference
            const confTitle = conf.title || '';
            return mtRelevantConferences.some(mtName => confTitle.includes(mtName));
          }
          
          // Show if it has any MT-related tags or is a recognized MT conference
          const hasMtTag = mtRelatedTags.some(tag => conf.tags?.includes(tag));
          const confTitle = conf.title || '';
          const isMtConference = mtRelevantConferences.some(mtName => confTitle.includes(mtName));
          
          if (!hasMtTag && !isMtConference) return false;
        }
        
        // Apply country filtering, if selected
        if (selectedCountries.size > 0) {
          const country = extractCountry(conf);
          if (!country || !selectedCountries.has(country)) return false;
        }

        // Apply search filtering
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            (conf.title && conf.title.toLowerCase().includes(query)) ||
            (conf.full_name && conf.full_name.toLowerCase().includes(query)) ||
            (conf.city && conf.city.toLowerCase().includes(query)) ||
            (conf.country && conf.country.toLowerCase().includes(query)) ||
            (conf.tags && conf.tags.some(tag => tag.toLowerCase().includes(query)))
          );
        }

        return true;
      })
      .sort((a: Conference, b: Conference) => {
        // Sort by deadline (similar to the utility function but for direct comparison)
        const aDeadline = getDeadlineInLocalTime(a.deadline, a.timezone);
        const bDeadline = getDeadlineInLocalTime(b.deadline, b.timezone);
        
        // If either date is invalid, place it later in the list
        if (!aDeadline && !bDeadline) return 0;
        if (!aDeadline) return 1;
        if (!bDeadline) return -1;
        
        // Both dates are valid, compare them
        return aDeadline.getTime() - bDeadline.getTime();
      });
  }, [conferencesData, selectedTags, selectedCountries, searchQuery, showPastConferences]);

  // Update handleTagsChange to handle multiple tags
  const handleTagsChange = (newTags: Set<string>) => {
    setSelectedTags(newTags);
    const searchParams = new URLSearchParams(window.location.search);
    if (newTags.size > 0) {
      searchParams.set('tags', Array.from(newTags).join(','));
    } else {
      searchParams.delete('tags');
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
  };

  const handleCountriesChange = (newCountries: Set<string>) => {
    setSelectedCountries(newCountries);
    const searchParams = new URLSearchParams(window.location.search);
    if (newCountries.size > 0) {
      searchParams.set('countries', Array.from(newCountries).join(','));
    } else {
      searchParams.delete('countries');
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
  };

  // Toggle a single tag
  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    handleTagsChange(newTags);
  };

  // Load filters from URL on initial render
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tagsParam = searchParams.get('tags');
    const countriesParam = searchParams.get('countries');
    
    if (tagsParam) {
      const tags = tagsParam.split(',');
      setSelectedTags(new Set(tags));
    }
    
    if (countriesParam) {
      const countries = countriesParam.split(',');
      setSelectedCountries(new Set(countries));
    }
  }, []);

  if (!Array.isArray(conferencesData)) {
    return <div>Loading conferences...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Header 
        onSearch={setSearchQuery} 
        showEmptyMessage={false}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 py-4">
          {/* Category filter buttons */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {categoryButtons.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedTags.has(category.id) 
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                  onClick={() => {
                    const newTags = new Set(selectedTags);
                    if (newTags.has(category.id)) {
                      newTags.delete(category.id);
                    } else {
                      newTags.add(category.id);
                    }
                    handleTagsChange(newTags);
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Controls row with past conferences toggle and country filter */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
              <label htmlFor="show-past" className="text-sm text-neutral-600">
                Show past conferences
              </label>
              <Switch
                id="show-past"
                checked={showPastConferences}
                onCheckedChange={setShowPastConferences}
              />
            </div>
            
            <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Globe className="h-4 w-4" />
                    Filter by Country
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4 bg-white" align="start">
                  <div className="space-y-4">
                    <div>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-800">Country</h4>
                      </div>
                      <div 
                        className="max-h-60 overflow-y-auto space-y-2 bg-white overscroll-contain touch-pan-y" 
                        style={{ WebkitOverflowScrolling: "touch" }}
                      >
                        {getAllCountries(conferencesData as Conference[]).map(country => (
                          <div key={country} className="flex items-center space-x-2 hover:bg-gray-50 p-1 rounded">
                            <Checkbox 
                              id={`country-${country}`}
                              checked={selectedCountries.has(country)}
                              onCheckedChange={() => {
                                const newCountries = new Set(selectedCountries);
                                if (newCountries.has(country)) {
                                  newCountries.delete(country);
                                } else {
                                  newCountries.add(country);
                                }
                                handleCountriesChange(newCountries);
                              }}
                            />
                            <label 
                              htmlFor={`country-${country}`}
                              className="text-sm font-medium text-gray-700 cursor-pointer w-full py-1"
                            >
                              {country}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Display selected countries */}
              {Array.from(selectedCountries).map(country => (
                <button
                  key={country}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 font-medium"
                  onClick={() => {
                    const newCountries = new Set(selectedCountries);
                    newCountries.delete(country);
                    handleCountriesChange(newCountries);
                  }}
                >
                  {country}
                  <X className="ml-1 h-3 w-3" />
                </button>
              ))}
              
              {/* Clear all filters button */}
              {(selectedTags.size > 0 || selectedCountries.size > 0) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    handleTagsChange(new Set());
                    handleCountriesChange(new Set());
                  }}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredConferences.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 mb-6">
            <p className="text-center">
              There are no upcoming conferences for the selected categories - enable "Show past conferences" to see previous ones
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConferences.map((conference: Conference) => (
            <ConferenceCard key={conference.id} {...conference} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
