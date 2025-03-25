# Contributing to AI Deadlines

Thank you for your interest in contributing to AI Deadlines! This guide will help you understand how to add or modify conference information through pull requests.

## Adding a New Conference

To add a new conference to the database:

1. Create a new YAML file in the `src/data/conferences` directory.
2. Name the file using the conference ID format: `<shortname><year>.yml` (e.g., `neurips25.yml` for NeurIPS 2025).
3. Include the following information in the YAML file:

```yaml
title: TITLE_ACRONYM          # Conference acronym, e.g., "NeurIPS"
year: YEAR                    # Year of the conference, e.g., 2025
id: ID                        # Unique ID, typically acronym+year, e.g., "neurips25"
full_name: FULL_NAME          # Full conference name
link: URL                     # Conference website URL
deadline: "YYYY-MM-DD HH:MM:SS" # Paper submission deadline (in quotes)
timezone: TIMEZONE            # Timezone for the deadline, e.g., "UTC-12"
date: DATES                   # Conference dates, e.g., "December 9-15, 2025"
tags:                         # Array of relevant categories
  - machine-learning
  - computer-vision
  - etc.
city: CITY                    # Host city
country: COUNTRY              # Host country
abstract_deadline: "YYYY-MM-DD HH:MM:SS" # Optional: Abstract submission deadline (if different)
venue: VENUE                  # Optional: Conference venue
start: "YYYY-MM-DD"           # Optional: Conference start date (ISO format)
end: "YYYY-MM-DD"             # Optional: Conference end date (ISO format)
rankings: "CCF: X, CORE: Y"   # Optional: Conference rankings
note: "Additional information" # Optional: Special notes
```

4. Submit a pull request with your changes.

## Updating Existing Conference Information

To update information for an existing conference:

1. Find the appropriate YAML file in the `src/data/conferences` directory.
2. Make your changes, ensuring the YAML format remains valid.
3. Submit a pull request with your changes.

## Conference Tags

Please use the established tags when possible. Common tags include:

- machine-learning
- computer-vision
- natural-language-processing
- robotics
- speech-recognition
- data-mining
- computational-linguistics
- multilingual
- speech-translation
- human-computer-interaction
- language-modeling
- text-generation

## Date and Timezone Format

- For deadlines, use the format: `YYYY-MM-DD HH:MM:SS` (in quotes)
- For timezones, use the format: `UTC+X` or `UTC-X`
- For conference dates, you can use a descriptive format like: `December 9-15, 2025`

## Pull Request Process

1. Fork the repository
2. Create your feature branch (`git checkout -b add-conference-xyz`)
3. Commit your changes (`git commit -am 'Add XYZ conference'`)
4. Push to the branch (`git push origin add-conference-xyz`)
5. Create a new Pull Request

## Additional Notes

- Please ensure all required fields are filled in correctly.
- Double-check the deadline time and timezone information.
- If you're unsure about any fields, you can check existing conference entries for guidance.

Thank you for helping to maintain and improve the AI Deadlines resource! 