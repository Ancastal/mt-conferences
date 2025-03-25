import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { loadConferences } from "@/utils/conferenceLoader";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useMemo } from "react";

interface FilterBarProps {
  selectedTags: Set<string>;
  selectedCountries: Set<string>;
  onTagSelect: (tags: Set<string>) => void;
  onCountrySelect: (countries: Set<string>) => void;
}

const FilterBar = ({ 
  selectedTags = new Set(), 
  selectedCountries = new Set(),
  onTagSelect,
  onCountrySelect
}: FilterBarProps) => {
  const uniqueTags = useMemo(() => {
    // Define MT-focused categories to prioritize
    const mtPriorityTags = [
      'machine-translation',
      'natural-language-processing',
      'computational-linguistics',
      'multilingual',
      'speech-translation',
      'language-modeling',
      'text-generation',
      'machine-learning',
      'speech-recognition'
    ];
    
    // Get all tags from conference data
    const tags = new Set<string>();
    const conferencesData = loadConferences();
    if (Array.isArray(conferencesData)) {
      conferencesData.forEach(conf => {
        if (Array.isArray(conf.tags)) {
          conf.tags.forEach(tag => tags.add(tag));
        }
      });
    }
    
    // Convert to array of tag objects
    const tagObjects = Array.from(tags).map(tag => ({
      id: tag,
      label: tag.split("-").map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(" "),
      description: `${tag} Conferences`,
      isPriority: mtPriorityTags.includes(tag)
    }));
    
    // Sort - priority MT tags first, then alphabetical
    return tagObjects.sort((a, b) => {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return a.label.localeCompare(b.label);
    });
  }, []);

  const isTagSelected = (tagId: string) => {
    return selectedTags?.has(tagId) ?? false;
  };

  const handleTagChange = (tagId: string) => {
    const newSelectedTags = new Set(selectedTags);
    if (newSelectedTags.has(tagId)) {
      newSelectedTags.delete(tagId);
    } else {
      newSelectedTags.add(tagId);
    }
    onTagSelect(newSelectedTags);
  };

  const clearAllFilters = () => {
    onTagSelect(new Set());
    onCountrySelect(new Set());
  };

  return (
    <div className="bg-white border border-neutral-100 shadow-sm rounded-xl p-5 mb-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2 rounded-lg border-neutral-200 hover:bg-neutral-50 hover:text-primary transition-colors">
                <SlidersHorizontal className="h-4 w-4" />
                Filter by MT Category
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 rounded-xl shadow-lg border-neutral-100" align="start">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-neutral-800">Machine Translation Categories</h4>
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1 pr-2">
                    {uniqueTags.map(tag => (
                      <div 
                        key={tag.id} 
                        className={`flex items-center space-x-2 hover:bg-neutral-50 p-2 rounded-lg transition-colors ${tag.isPriority ? 'bg-primary/5' : ''}`}
                      >
                        <Checkbox 
                          id={`tag-${tag.id}`}
                          checked={isTagSelected(tag.id)}
                          onCheckedChange={() => handleTagChange(tag.id)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label 
                          htmlFor={`tag-${tag.id}`}
                          className={`text-sm font-medium cursor-pointer w-full py-1 ${tag.isPriority ? 'text-primary-dark' : 'text-neutral-700'}`}
                        >
                          {tag.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Clear all filters button */}
          {(selectedTags.size > 0 || selectedCountries.size > 0) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-neutral-500 hover:text-primary hover:bg-neutral-50 h-9 transition-colors"
            >
              Clear all filters
            </Button>
          )}
          
          {/* Display selected tags */}
          {Array.from(selectedTags).map(tag => (
            <button
              key={tag}
              className="inline-flex items-center px-3.5 py-1.5 rounded-full text-sm bg-primary/10 text-primary hover:bg-primary/20 font-medium transition-colors animate-pulse-subtle"
              onClick={() => handleTagChange(tag)}
            >
              {tag.split("-").map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(" ")}
              <X className="ml-1.5 h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
