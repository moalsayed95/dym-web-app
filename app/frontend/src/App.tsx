import { useState } from "react";
import { useTranslation } from "react-i18next";

import useRealTime from "@/hooks/useRealtime";
import useAudioRecorder from "@/hooks/useAudioRecorder";
import useAudioPlayer from "@/hooks/useAudioPlayer";

import StatusMessage from "@/components/ui/status-message";
import { Mic, MicOff } from "lucide-react";

function App() {
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
    const { start: startAudioRecording, stop: stopAudioRecording } = useAudioRecorder({ onAudioRecorded: addUserAudio });

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
        <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors dark:bg-foreground dark:text-background">
            {/* Fixed Header */}
            <header className="sticky top-0 z-50 border-b bg-white py-3 dark:bg-gray-900">
                <div className="container mx-auto flex flex-wrap items-center justify-between px-4">

                    {/* Recording Section */}
                    <div className="flex items-center gap-4">
                        <StatusMessage isRecording={isRecording} />
                        <button
                            onClick={onToggleListening}
                            className={`record-button ${isRecording ? "recording" : ""}`}
                            aria-label={isRecording ? t("app.stopRecording") : t("app.startRecording")}
                        >
                            {isRecording ? <Mic className="icon" /> : <MicOff className="icon" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content - Updated Layout */}
            <main className="flex flex-grow flex-col">

            </main>
        </div>
    );
}

export default App;
