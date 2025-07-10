import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CreateRoomPage } from './pages/create-room';
import { RecordRoomAudioPage } from './pages/record-room-audio';
import { RoomPage } from './pages/room';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<CreateRoomPage />} index />
          <Route element={<RoomPage />} path="/room/:id" />
          <Route element={<RecordRoomAudioPage />} path="/room/:id/audio" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
