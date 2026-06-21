import React, { useState, useEffect } from 'react';
import { validateSlotAvailability } from '../../services/bookingService';

export type EventData = {
  id: number;
  name: string;
  duration: number;
};

type CatalogueMobileProps = {
  events: EventData[];
};

export default function CatalogueMobile({ events }: CatalogueMobileProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [lockedSlot, setLockedSlot] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (lockedSlot && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && lockedSlot) {
      setLockedSlot(null);
    }
    return () => clearInterval(timer);
  }, [lockedSlot, timeLeft]);

  const handleSelectEvent = (event: EventData) => {
    setSelectedEvent(event);
  };

  const handleSelectSlot = (timeStr: string) => {
    setError('');
    try {
      const dateStr = `2026-06-25T${timeStr}:00.000Z`;
      const endStr = `2026-06-25T${timeStr.replace('00', '30')}:00.000Z`;
      
      validateSlotAvailability(dateStr, endStr);

      setLockedSlot(timeStr);
      setTimeLeft(600); // 10 minutes in seconds
    } catch (err: any) {
      setError(err.message || 'Error seleccionando slot');
    }
  };

  if (!events || events.length === 0) {
    return <p>El profesional no tiene servicios disponibles para reserva actualmente</p>;
  }

  return (
    <div className="p-4">
      <h2>Catálogo de Eventos</h2>
      {error && <div role="alert" className="text-red-500">{error}</div>}
      
      {!selectedEvent ? (
        <div className="flex flex-col gap-4">
          {events.map((ev) => (
            <button
              key={ev.id}
              onClick={() => handleSelectEvent(ev)}
              // Ley de Fitts: >= 44x44px
              className="min-h-[44px] min-w-[44px] p-4 bg-blue-500 text-white rounded-md"
            >
              {ev.name}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <h3>Horarios para {selectedEvent.name}</h3>
          {lockedSlot ? (
            <div>
              <p>Bloqueado por {lockedSlot}</p>
              <p>Tiempo restante: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-4">
              <button
                onClick={() => handleSelectSlot('10:00')}
                className="min-h-[44px] min-w-[44px] p-4 bg-green-500 text-white rounded-md"
              >
                10:00
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
