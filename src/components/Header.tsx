import { Input } from "@/components/ui/input";
import { CalendarDays, Search } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  onSearch: (query: string) => void;
  showEmptyMessage?: boolean;
}

const Header = ({ onSearch, showEmptyMessage = false }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-primary-dark via-primary to-primary-light text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4 md:gap-6">
          <div className="flex items-center justify-center md:justify-start w-full md:w-auto gap-3">
            <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
                <img 
                  src="https://huggingface.co/front/assets/huggingface_logo.svg" 
                  alt="Hugging Face Logo" 
                  className="h-7 w-7"
                />
              </div>
              <span className="text-2xl font-bold text-white">
                <span className="hidden md:inline">Machine Translation Deadlines</span>
                <span className="md:hidden">MT Deadlines</span>
              </span>
            </Link>
            <nav className="hidden md:flex space-x-4 ml-6">
              <Link
                to="/calendar"
                className="text-white/90 hover:text-white flex items-center gap-2 transition-all hover:translate-y-[-2px]"
              >
                <CalendarDays className="h-5 w-5" />
                Calendar
              </Link>
            </nav>
          </div>
          <div className="w-full md:max-w-lg lg:max-w-xs">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <Input
                type="search"
                placeholder="Search MT conferences..."
                className="pl-10 w-full bg-white/90 border-0 focus-visible:ring-2 focus-visible:ring-white transition-all text-neutral-dark"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        {showEmptyMessage && (
          <div className="max-w-4xl mx-auto mt-2 mb-4 text-center">
            <p className="text-sm bg-amber-50 text-amber-800 py-2 px-4 rounded-md inline-block shadow-sm">
              There are no upcoming machine translation conferences for the selected categories - enable "Show past conferences" to see previous ones
            </p>
          </div>
        )}
        <div className="max-w-4xl mx-auto text-center py-3 text-white/90">
          <p className="text-sm">
            Countdowns to top Machine Translation, NLP, and Computational Linguistics conference deadlines. To add/edit a conference, send in a{' '}
            <a 
              href="https://github.com/huggingface/ai-deadlines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium hover:underline"
            >
              pull request
            </a>.
            <br className="md:hidden" />
            <span className="hidden md:inline"> · </span>
            P.S. Have you published a MT paper? Share it on{' '}
            <a
              href="https://hf.co/papers/submit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium hover:underline"
            >
              hf.co/papers
            </a>
            {' '}and upload your models, datasets, and demos to the{' '}
            <a
              href="https://huggingface.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium hover:underline"
            >
              Hugging Face Hub
            </a>
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
