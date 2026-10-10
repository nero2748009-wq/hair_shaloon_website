import { useMemo, useState, type FormEvent } from "react";
import "./bookingSection.css"

type Availability = "open" | "few" | "full";

const SERVICES = ["Haircut", "Beard Grooming", "Hair Highlights", "Cleansing"] as const;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const ALL_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

/* ---------- sample data (deterministic, replace with a real API) ---------- */

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const dateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Stable pseudo-random number from a date so the demo doesn't flicker on re-render. */
function seed(d: Date): number {
  const n = d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate();
  return Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1;
}

function bookedSlotsFor(d: Date): string[] {
  const r = seed(d);
  const count = r < 0.12 ? ALL_SLOTS.length : r < 0.4 ? ALL_SLOTS.length - 2 : Math.floor(r * 4);
  // Pick `count` slots deterministically
  return [...ALL_SLOTS]
    .sort((a, b) => seed(new Date(d.getTime() + a.length * 1e7 + a.charCodeAt(0))) - seed(new Date(d.getTime() + b.length * 1e7 + b.charCodeAt(0))))
    .slice(0, count);
}

function availabilityFor(d: Date): { status: Availability; free: string[] } {
  if (d.getDay() === 0) return { status: "full", free: [] }; // closed Sundays in the demo
  const booked = bookedSlotsFor(d);
  const free = ALL_SLOTS.filter((s) => !booked.includes(s));
  if (free.length === 0) return { status: "full", free };
  return { status: free.length <= 2 ? "few" : "open", free };
}

/* ---------- component ---------- */

export default function BookingSection() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [service, setService] = useState<string>(SERVICES[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const year = view.getFullYear();
  const month = view.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = new Date(year, month, 1).getDay();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const cells = useMemo(() => {
    const out: (Date | null)[] = Array(leadingBlanks).fill(null);
    for (let day = 1; day <= daysInMonth; day++) out.push(new Date(year, month, day));
    return out;
  }, [year, month, daysInMonth, leadingBlanks]);

  const selectedInfo = selectedDate ? availabilityFor(selectedDate) : null;

  const formatLong = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const changeMonth = (delta: number) => {
    setView(new Date(year, month + delta, 1));
  };

  const pickDate = (d: Date) => {
    setSelectedDate(d);
    setSelectedSlot(null);
    setConfirmation("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;
    setConfirmation(
      `Thanks, ${name.trim()}! We've noted your request for ${service} on ${formatLong(selectedDate)} at ${selectedSlot}. We'll call ${phone.trim()} to confirm.`
    );
    setName("");
    setPhone("");
    setSelectedSlot(null);
  };

  return (
    <section id="book">
      <div className="section-inner">
        <div className="book-head">
          <div className="kicker">Appointments</div>
          <h2>Pick a day and a time</h2>
          <p>
            Choose an open date on the calendar, then a time that suits you. Dates with a gold dot
            have only a few slots left.
          </p>
          <div className="demo-note">
            Preview only: the availability shown here is sample data to show how booking will look.
            It isn't connected to a real schedule yet — call to confirm a slot.
          </div>
        </div>

        <div className="book-grid">
          {/* Calendar */}
          <div className="panel">
            <div className="cal-top">
              <h3 id="calTitle">
                {MONTHS[month]} {year}
              </h3>
              <div className="cal-nav">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => changeMonth(-1)}
                  disabled={isCurrentMonth}
                >
                  ‹
                </button>
                <button type="button" aria-label="Next month" onClick={() => changeMonth(1)}>
                  ›
                </button>
              </div>
            </div>

            <div className="cal-week">
              {WEEKDAYS.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="cal-days" id="calDays">
              {cells.map((d, i) => {
                if (!d) return <div key={`blank-${i}`} className="cal-day empty" />;
                const past = d < today;
                const { status } = availabilityFor(d);
                const disabled = past || status === "full";
                const isSelected = selectedDate ? dateKey(d) === dateKey(selectedDate) : false;
                const classes = [
                  "cal-day",
                  disabled ? "disabled" : "",
                  !disabled && status === "few" ? "few" : "",
                  !disabled && status === "open" ? "open" : "",
                  isSelected ? "selected" : "",
                  dateKey(d) === dateKey(today) ? "today" : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <button
                    key={dateKey(d)}
                    type="button"
                    className={classes}
                    disabled={disabled}
                    aria-pressed={isSelected}
                    onClick={() => pickDate(d)}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="legend">
              <span>
                <i style={{ background: "var(--olive)" }} />
                Available
              </span>
              <span>
                <i style={{ background: "var(--gold)", boxShadow: "0 0 0 1px rgba(1,48,34,.25)" }} />
                Few slots left
              </span>
              <span>
                <i style={{ background: "rgba(26,26,26,0.3)" }} />
                Fully booked
              </span>
            </div>
          </div>

          {/* Slots + form */}
          <div className="panel">
            <div className="slots-title" id="slotsTitle">
              {selectedDate ? formatLong(selectedDate) : "Select a date"}
            </div>
            <div className="slots-sub" id="slotsSub">
              {selectedInfo
                ? `${selectedInfo.free.length} time${selectedInfo.free.length === 1 ? "" : "s"} available`
                : "Available times will appear here."}
            </div>

            <div className="slots" id="slots">
              {selectedInfo ? (
                selectedInfo.free.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`slot${selectedSlot === slot ? " selected" : ""}`}
                    aria-pressed={selectedSlot === slot}
                    onClick={() => {
                      setSelectedSlot(slot);
                      setConfirmation("");
                    }}
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <div className="slots-empty">Pick a date on the calendar to see times.</div>
              )}
            </div>

            <form id="bookForm" onSubmit={handleSubmit}>
              <div className="summary" id="summary">
                {selectedDate && selectedSlot
                  ? `${service} · ${formatLong(selectedDate)} at ${selectedSlot}`
                  : "No time selected yet."}
              </div>

              <div className="field">
                <label htmlFor="bk-service">Service</label>
                <select
                  id="bk-service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="bk-name">Full name</label>
                <input
                  id="bk-name"
                  type="text"
                  placeholder="Your name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="bk-phone">Phone number</label>
                <input
                  id="bk-phone"
                  type="tel"
                  placeholder="98X-XXXXXXX"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-forest"
                id="bookBtn"
                disabled={!selectedDate || !selectedSlot}
              >
                Request this time
              </button>

              <div className="confirm-msg" id="bookConfirm" role="status" aria-live="polite">
                {confirmation}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}