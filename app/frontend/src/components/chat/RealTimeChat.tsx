import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRealTime from "@/hooks/useRealtime";
import useAudioRecorder from "@/hooks/useAudioRecorder";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import StatusMessage from "@/components/ui/status-message";
import { VoiceSelector } from './VoiceSelector';

export default function RealTimeChat() {
    const { t } = useTranslation();
    const [isRecording, setIsRecording] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState('alloy');

    const { startSession, addUserAudio, inputAudioBufferClear } = useRealTime({
        onWebSocketOpen: () => console.log("WebSocket connection opened"),
        onWebSocketClose: () => console.log("WebSocket connection closed"),
        onWebSocketError: event => console.error("WebSocket error:", event),
        onReceivedError: message => console.error("error", message),
        onReceivedResponseAudioDelta: message => {
            isRecording && playAudio(message.delta);
        },
        onReceivedInputAudioBufferSpeechStarted: () => {
            stopAudioPlayer();
        },
        onReceivedExtensionMiddleTierToolResponse: message => {
            console.log("Received tool response", message);
            const result = JSON.parse(message.tool_result);

            if (result.action === "update_preferences") {
                console.log("Update preferences", result);
            }
        }
    });

    const { reset: resetAudioPlayer, play: playAudio, stop: stopAudioPlayer } = useAudioPlayer();
    const { start: startAudioRecording, stop: stopAudioRecording } = useAudioRecorder({ 
        onAudioRecorded: (audio) => {
            addUserAudio(audio);
        }
    });

    const onToggleListening = async () => {
        if (!isRecording) {
            startSession({ voice: selectedVoice });
            await startAudioRecording();
            resetAudioPlayer();
            setIsRecording(true);
        } else {
            await stopAudioRecording();
            stopAudioPlayer();
            inputAudioBufferClear();
            setIsRecording(false);
        }
    };

    const handleVoiceSelect = (voice: string) => {
        setSelectedVoice(voice);
    };

    return (
        <div
            className={
                `rounded-lg shadow-lg p-8 flex flex-row items-center justify-between min-h-[180px] max-w-5xl mx-auto ` +
                (isRecording
                    ? 'animated-gradient-bg'
                    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900')
            }
        >
            {/* Voice Selector with isolated background, aligned left */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md flex flex-col justify-center">
                <VoiceSelector 
                    selectedVoice={selectedVoice}
                    onVoiceSelect={handleVoiceSelect}
                    isRecording={isRecording}
                />
            </div>
            
            {/* Centered button */}
            <div className="flex-1 flex items-center justify-center">
                {!isRecording ? (
                    <button 
                        onClick={onToggleListening}
                        className="focus:outline-none rounded-full w-[300px]"
                        aria-label={t("app.startConversation")}
                    >
                        <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-full px-10 py-5 shadow-lg hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-300 text-base font-medium text-gray-800 dark:text-gray-200">
                            {t("app.clickToStartConversation", "Click to start conversation")} 
                        </div>
                    </button>
                ) : (
                    <button 
                        onClick={onToggleListening} 
                        className="focus:outline-none rounded-full w-[300px]"
                        aria-label={t("app.stopConversation")}
                    >
                        <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-full px-10 py-5 shadow-lg hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-300 text-base font-medium text-gray-800 dark:text-gray-200"> 
                            <StatusMessage isRecording={isRecording} />
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
} 