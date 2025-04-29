import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRealTime from "@/hooks/useRealtime";
import useAudioRecorder from "@/hooks/useAudioRecorder";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import StatusMessage from "@/components/ui/status-message";
import { Mic, MicOff } from "lucide-react";

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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center gap-4">
                <StatusMessage isRecording={isRecording} />
                <button
                    onClick={onToggleListening}
                    className={`flex items-center justify-center w-14 h-14 rounded-full transition-colors ${
                        isRecording 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    aria-label={isRecording ? t("app.stopRecording") : t("app.startRecording")}
                >
                    {isRecording ? (
                        <MicOff className="w-6 h-6 text-white" />
                    ) : (
                        <Mic className="w-6 h-6 text-white" />
                    )}
                </button>
            </div>
        </div>
    );
} 