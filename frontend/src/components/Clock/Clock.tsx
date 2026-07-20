import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ClockIcon from '../Icons/ClockIcon';
import './Clock.css';

interface ClockProps {
  className?: string;
}

export default function Clock({ className = '' }: ClockProps) {
  const { i18n } = useTranslation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const locale = i18n.language;

  return (
    <div className={`clock ${className}`}>
      <div className="clock__date">
        <div className="clock__weekday">{time.toLocaleDateString(locale, { weekday: 'long' })}</div>
        <div className="clock__full-date">
          {time.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>
      </div>

      <div className="clock__time">
        <ClockIcon size={14} />
        {time.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false })}
      </div>
    </div>
  );
}
