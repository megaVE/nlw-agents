import { useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const isRecordingSupported =
  Boolean(navigator.mediaDevices) &&
  typeof navigator.mediaDevices.getUserMedia === 'function' &&
  typeof window.MediaRecorder === 'function';

type RoomParams = {
  id: string;
};

export function RecordRoomAudioPage() {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  const params = useParams<RoomParams>();

  if (!params.id) {
    return <Navigate replace to="/" />;
  }

  function createRecorder(audio: MediaStream) {
    recorderRef.current = new MediaRecorder(audio, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 64_000,
    });

    recorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        uploadAudio(e.data);
      }
    };

    recorderRef.current.onstart = () => {
      // biome-ignore lint/suspicious/noConsole: '
      console.log('Gravação iniciada.');
    };

    recorderRef.current.onstop = () => {
      // biome-ignore lint/suspicious/noConsole: '
      console.log('Gravação encerrada.');
    };

    recorderRef.current.start();
  }

  async function startRecording() {
    if (!isRecordingSupported) {
      return alert('O seu navegador não suporta Gravação de Áudio.');
    }

    setIsRecording(true);

    const audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44_100,
      },
    });

    createRecorder(audio);

    intervalRef.current = setInterval(() => {
      recorderRef.current?.stop();

      createRecorder(audio);
    }, 5000);
  }

  function stopRecording() {
    setIsRecording(false);

    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }

  async function uploadAudio(audio: Blob) {
    const formData = new FormData();

    formData.append('file', audio, 'audio.webm');

    const response = await fetch(
      `http://localhost:3333/rooms/${params.id}/audio`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    return result;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      {isRecording ? (
        <Button onClick={stopRecording}>Parar gravação</Button>
      ) : (
        <Button onClick={startRecording}>Gravar áudio</Button>
      )}
      {isRecording && <p>Gravando...</p>}
    </div>
  );
}
