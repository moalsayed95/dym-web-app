import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRealTime from "@/hooks/useRealtime";
import useAudioRecorder from "@/hooks/useAudioRecorder";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import StatusMessage from "@/components/ui/status-message";


export default function RealTimeChat() {
    const { t } = useTranslation();
    const [isRecording, setIsRecording] = useState(false);

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
            startSession();
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

    return (
        <div
            className={
                `rounded-lg shadow-lg p-24 flex flex-col items-center justify-center space-y-6 min-h-[390px] ` +
                (isRecording
                    ? 'animated-gradient-bg'
                    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900')
            }
        >
            {
                !isRecording ? (
                    <button 
                        onClick={onToggleListening}
                        className="focus:outline-none rounded-full"
                        aria-label={t("app.startConversation")}
                    >
                        <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-full px-10 py-5 shadow-lg hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-300 text-xl font-medium text-gray-800 dark:text-gray-200">
                            {t("app.clickToStartConversation", "Click to start conversation")} 
                        </div>
                    </button>
                ) : (
                    <button 
                        onClick={onToggleListening} 
                        className="focus:outline-none rounded-full"
                        aria-label={t("app.stopConversation")}
                    >
                        <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-full px-10 py-5 shadow-lg hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-300 text-xl font-medium text-gray-800 dark:text-gray-200"> 
                            <StatusMessage isRecording={isRecording} />
                        </div>
                    </button>
                )
            }
        </div>
    );
} 