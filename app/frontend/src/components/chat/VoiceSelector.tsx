import React from 'react';
import { useTranslation } from 'react-i18next';

export interface Voice {
  id: string;
  name: string;
  description: string;
}

export const voices: Voice[] = [
  { id: 'alloy', name: 'Alloy', description: 'Versatile and balanced' },
  { id: 'ash', name: 'Ash', description: 'Clear and professional' },
  { id: 'ballad', name: 'Ballad', description: 'Melodic and smooth' },
  { id: 'coral', name: 'Coral', description: 'Warm and friendly' },
  { id: 'echo', name: 'Echo', description: 'Resonant and distinct' },
  { id: 'sage', name: 'Sage', description: 'Wise and composed' },
  { id: 'shimmer', name: 'Shimmer', description: 'Bright and energetic' },
  { id: 'verse', name: 'Verse', description: 'Lyrical and engaging' }
];

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceSelect: (voice: string) => void;
  isRecording: boolean;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onVoiceSelect,
  isRecording
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-2 mr-6">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {t('app.voiceSelection', 'Voice')}
      </div>
      <div className="flex flex-col space-y-2">
        {voices.map((voice) => (
          <button
            key={voice.id}
            onClick={() => !isRecording && onVoiceSelect(voice.id)}
            disabled={isRecording}
            className={`
              flex items-center px-4 py-2 rounded-lg transition-all duration-200
              ${selectedVoice === voice.id 
                ? 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100' 
                : 'bg-white/80 dark:bg-gray-700/80 hover:bg-white/90 dark:hover:bg-gray-700/90'
              }
              ${isRecording ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            aria-label={`${t('app.selectVoice', 'Select voice')}: ${voice.name}`}
          >
            <div className="flex flex-col items-start">
              <span className="font-medium">{voice.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {voice.description}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}; 