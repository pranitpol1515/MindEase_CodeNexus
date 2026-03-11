import { useEffect, useMemo, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import API from "../services/api"

function CounselorProfile() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [counselor, setCounselor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState({ name: "", date: "", time: "", mobile: "", parentMobile: "" })
  const [bookingMsg, setBookingMsg] = useState("")

  const profile = useMemo(() => {
    const raw = localStorage.getItem("profile")
    return raw ? JSON.parse(raw) : null
  }, [])

  useEffect(() => {
    API.get(`/counselors/${id}`)
      .then((res) => setCounselor(res.data))
      .finally(() => setLoading(false))
  }, [id])

  const isBelow18 = profile?.age_group === "below_18"

  const book = async () => {
    setBookingMsg("")
    try {
      await API.post("/appointments", {
        counselor_id: id,
        user_name: isBelow18 ? booking.name : undefined,
        age_group: profile?.age_group,
        date: booking.date,
        time: booking.time,
        mobile_no: isBelow18 ? booking.parentMobile : booking.mobile,
        parent_mobile_no: isBelow18 ? booking.parentMobile : undefined,
      })
      setBookingMsg("Appointment booked successfully.")
      localStorage.setItem(
        "appointmentReminder",
        JSON.stringify({
          username: profile?.username,
          age_group: profile?.age_group,
          counselorName: counselor?.name,
          date: booking.date,
          time: booking.time,
        })
      )
      setBooking({ name: "", date: "", time: "", mobile: "", parentMobile: "" })
    } catch (error) {
      const msg = error?.response?.data?.detail || "Could not book appointment. Please check details and try again."
      setBookingMsg(msg)
    }
  }

  if (loading) return <div className="p-10">Loading...</div>
  if (!counselor) return <div className="p-10">Counselor not found.</div>

  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <button className="me-btn-outline px-4 py-2 text-sm" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="mt-4 me-card p-6">
        <h1 className="text-3xl font-bold">{counselor.name}</h1>
        <p className="mt-2 text-[#F5F9FF]/85">{counselor.qualification}</p>
        <p className="text-[#F5F9FF]/70">{counselor.city}</p>
        <p className="mt-2 text-sm text-[#F5F9FF]/70">Appointments: {counselor.appointments_count ?? 0}</p>
      </div>

      <div className="mt-6 me-card p-6">
        <h2 className="text-xl font-bold mb-4">Book Appointment</h2>

        {isBelow18 && (
          <input
            className="me-input w-full mb-3"
            placeholder="Name"
            value={booking.name}
            onChange={(e) => setBooking((b) => ({ ...b, name: e.target.value }))}
          />
        )}

        <input
          type="date"
          className="me-input w-full mb-3"
          value={booking.date}
          onChange={(e) => setBooking((b) => ({ ...b, date: e.target.value }))}
        />

        <input
          type="time"
          className="me-input w-full mb-3"
          value={booking.time}
          onChange={(e) => setBooking((b) => ({ ...b, time: e.target.value }))}
        />

        {!isBelow18 && (
          <input
            className="me-input w-full mb-3"
            placeholder="Mobile no"
            value={booking.mobile}
            onChange={(e) => setBooking((b) => ({ ...b, mobile: e.target.value }))}
          />
        )}

        {isBelow18 && (
          <input
            className="me-input w-full mb-3"
            placeholder="Parent mobile no"
            value={booking.parentMobile}
            onChange={(e) => setBooking((b) => ({ ...b, parentMobile: e.target.value }))}
          />
        )}

        <button onClick={book} className="me-btn px-4 py-2">
          Book appointment
        </button>

        {bookingMsg && <div className="mt-3 text-sm text-[#F5F9FF]/85">{bookingMsg}</div>}
      </div>
    </div>
  )
}

export default CounselorProfile

