import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  MapPin,
  Users,
  PlusCircle,
  Trophy,
  AlarmClock,
  ChevronRight,
  Menu,
  X,
  CheckCircle,
  Globe,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/events/");
        setEvents(response.data.events);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const Navbar = () => (
    <nav className="bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Trophy className="mr-3" size={30} />
          <span className="text-2xl font-bold">SportEvent</span>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => Navigate(`/login`)}
            className="bg-white text-[#1A2980] px-4 py-2 rounded-full hover:bg-blue-100 transition"
          >
            Login
          </button>
          <button
            onClick={() => Navigate(`/register`)}
            className="bg-white text-[#1A2980] px-4 py-2 rounded-full hover:bg-blue-200 transition"
          >
            Register
          </button>
        </div>
      </div>
    </nav>
  );

  const HeroSection = () => (
    <div className="bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-extrabold mb-6">
          Discover Exciting Sports Events
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join, Compete, and Connect with Athletes Across Various Sports
        </p>
      </div>
    </div>
  );

  const EventSection = () => (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-indigo-900 mb-4">
          Upcoming Challenges
        </h2>
        <p className="text-indigo-700 max-w-2xl mx-auto">
          Explore Extraordinary Athletic Experiences Across France
        </p>
      </div>

      {loading ? (
        <div className="text-center text-gray-600">Loading events...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : Array.isArray(events) && events.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative">
                <img
                  src={event.image || "EventSportify.png"}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-[#1A2980] text-white px-3 py-1 rounded-full text-sm">
                  {event.status || "active"}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-3">
                  {event.title}
                </h3>

                <div className="space-y-3 text-indigo-700">
                  <div className="flex items-center">
                    <Calendar className="mr-3 text-indigo-500" />
                    <span>{event.startDate}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-3 text-green-500" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-3 text-purple-500" />
                    <span>{event.participants?.length || 0} Participants</span>
                  </div>
                </div>

                <button
                  onClick={() => Navigate(`/login`)}
                  className="mt-6 w-full bg-[#1A2980] text-white py-3 rounded-full hover:bg-[#26D0CE] transition-colors flex items-center justify-center"
                >
                  Join Event <ChevronRight className="ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">No events found</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <HeroSection />
      <EventSection />

      <footer className="bg-[#1A2980] text-white py-6">
        <div className="container mx-auto text-center">
          <p>© 2024 SportEvent. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
