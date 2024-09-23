import React from "react";
import { useTranslation } from "react-i18next";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useApi } from "../../../services/personalAreaapiService";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./Calendar.module.css";

moment.locale("he");
const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

const Calendar: React.FC = () => {
  const { t } = useTranslation();
  const { fetchEvents } = useApi();
  const [events, setEvents] = React.useState<Event[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching events");
        setLoading(false);
      }
    };
    loadEvents();
  }, [fetchEvents]);

  if (loading) return <div>{t("loading")}</div>;
  if (error) return <div>{error}</div>;
  if (!events) return null;

  return (
    <div className={styles.calendar}>
      <h1>{t("calendar.title")}</h1>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        messages={{
          next: t("calendar.next"),
          previous: t("calendar.previous"),
          today: t("calendar.today"),
          month: t("calendar.month"),
          week: t("calendar.week"),
          day: t("calendar.day"),
        }}
      />
    </div>
  );
};

export default Calendar;