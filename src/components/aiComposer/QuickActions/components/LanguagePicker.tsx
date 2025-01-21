import { Icon } from '@/components/ui/Icon'
import * as Menu from '@/components/ui/PopoverMenu'
import { useCallback } from 'react'

const LANGUAGES = [
  {
    region: 'Europe',
    languages: [
      { code: 'sq', name: 'Albanian' },
      { code: 'hy', name: 'Armenian' },
      { code: 'az', name: 'Azerbaijani' },
      { code: 'be', name: 'Belarusian' },
      { code: 'bs', name: 'Bosnian' },
      { code: 'bg', name: 'Bulgarian' },
      { code: 'hr', name: 'Croatian' },
      { code: 'cs', name: 'Czech' },
      { code: 'da', name: 'Danish' },
      { code: 'nl', name: 'Dutch' },
      { code: 'en', name: 'English' },
      { code: 'et', name: 'Estonian' },
      { code: 'fi', name: 'Finnish' },
      { code: 'fr', name: 'French' },
      { code: 'ka', name: 'Georgian' },
      { code: 'de', name: 'German' },
      { code: 'el', name: 'Greek' },
      { code: 'hu', name: 'Hungarian' },
      { code: 'is', name: 'Icelandic' },
      { code: 'ga', name: 'Irish' },
      { code: 'it', name: 'Italian' },
      { code: 'kk', name: 'Kazakh' },
      { code: 'lv', name: 'Latvian' },
      { code: 'lt', name: 'Lithuanian' },
      { code: 'lb', name: 'Luxembourgish' },
      { code: 'mk', name: 'Macedonian' },
      { code: 'mt', name: 'Maltese' },
      { code: 'no', name: 'Norwegian' },
      { code: 'pl', name: 'Polish' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ro', name: 'Romanian' },
      { code: 'ru', name: 'Russian' },
      { code: 'sr', name: 'Serbian' },
      { code: 'sk', name: 'Slovak' },
      { code: 'sl', name: 'Slovenian' },
      { code: 'es', name: 'Spanish' },
      { code: 'sv', name: 'Swedish' },
      { code: 'tr', name: 'Turkish' },
      { code: 'uk', name: 'Ukrainian' },
      { code: 'uz', name: 'Uzbek' },
    ],
  },
  {
    region: 'Asia',
    languages: [
      { code: 'ar', name: 'Arabic' },
      { code: 'bn', name: 'Bengali' },
      { code: 'my', name: 'Burmese' },
      { code: 'zh', name: 'Chinese (Mandarin)' },
      { code: 'he', name: 'Hebrew' },
      { code: 'hi', name: 'Hindi' },
      { code: 'id', name: 'Indonesian' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'ku', name: 'Kurdish' },
      { code: 'lo', name: 'Lao' },
      { code: 'ms', name: 'Malay' },
      { code: 'mn', name: 'Mongolian' },
      { code: 'ne', name: 'Nepali' },
      { code: 'tl', name: 'Tagalog (Filipino)' },
      { code: 'th', name: 'Thai' },
      { code: 'ur', name: 'Urdu' },
      { code: 'vi', name: 'Vietnamese' },
    ],
  },
  {
    region: 'Africa',
    languages: [
      { code: 'ha', name: 'Hausa' },
      { code: 'ig', name: 'Igbo' },
      { code: 'sw', name: 'Swahili' },
      { code: 'yo', name: 'Yoruba' },
      { code: 'zu', name: 'Zulu' },
    ],
  },
] as const

type Language = (typeof LANGUAGES)[number]['languages'][number]

interface LanguagePickerProps {
  onLanguageSelect?: (language: Language) => void
  trigger: React.ReactNode
}

export const LanguagePicker = ({ onLanguageSelect, trigger }: LanguagePickerProps) => {
  const handleLanguageSelect = useCallback(
    (language: Language) => () => {
      onLanguageSelect?.(language)
    },
    [onLanguageSelect],
  )

  return (
    <Menu.Menu trigger={trigger} customTrigger withPortal>
      {LANGUAGES.map(region => (
        <div key={region.region}>
          <Menu.CategoryTitle>{region.region}</Menu.CategoryTitle>
          {region.languages.map(language => (
            <Menu.Item
              key={language.code}
              label={language.name}
              iconComponent={<Icon name="Languages" className="w-4 h-4" />}
              onClick={handleLanguageSelect(language)}
            />
          ))}
          {region !== LANGUAGES[LANGUAGES.length - 1] && <Menu.Divider />}
        </div>
      ))}
    </Menu.Menu>
  )
}