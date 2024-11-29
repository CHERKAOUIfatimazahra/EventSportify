import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  Users,
  Trophy,
  DollarSign,
  Home,
  Settings,
  BarChart2,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [deleteEvent, setDeleteEvent] = useState(null);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/events/organizer",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEvents(response.data.events);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements:", error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // delete event
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet événement ?")) {
      try {
        await axios.delete(`http://localhost:5000/events/delete/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEvents(events.filter((event) => event._id !== eventId));
      } catch (error) {
        console.error("Erreur lors de la suppression de l'événement :", error);
        alert("Une erreur est survenue lors de la suppression.");
      }
    }
  };

  useEffect(() => {
    if (deleteEvent) {
      handleDeleteEvent(deleteEvent);
    }
  }, [deleteEvent]);

  // Sidebar Component
  const Sidebar = () => {
    const sidebarItems = [
      { icon: Home, label: "Dashboard", onClick: () => navigate("/dashboard") },
      { icon: Trophy, label: "Events", onClick: () => navigate("/events") },
      {
        icon: Users,
        label: "Participants",
        onClick: () => navigate("/participants"),
      },
      {
        icon: BarChart2,
        label: "Analytics",
        onClick: () => navigate("/analytics"),
      },
      {
        icon: Settings,
        label: "Settings",
        onClick: () => navigate("/settings"),
      },
    ];

    return (
      <div
        className={`
        fixed left-0 top-0 h-full 
        ${sidebarOpen ? "w-64" : "w-20"} 
        bg-gradient-to-b from-[#1A2980] to-[#26D0CE] 
        text-white transition-all duration-300 ease-in-out
        shadow-2xl z-50
      `}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <div className="flex items-center">
            <Trophy size={24} className="mr-2" />
            {sidebarOpen && (
              <span className="font-bold text-xl">SportsDash</span>
            )}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            <Menu size={24} />
          </button>
        </div>
        <nav className="mt-10">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="
                w-full flex items-center p-4 
                hover:bg-blue-700/30 
                transition-colors duration-200
              "
            >
              <item.icon size={24} className="mr-4" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="
              w-full flex items-center p-4 
              hover:bg-red-500/30 
              border-t border-blue-700
            "
          >
            <LogOut size={24} className="mr-4" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <Sidebar />
      <div
        className={`
          flex-grow p-6 transition-all duration-300 ease-in-out
          ${sidebarOpen ? "ml-64" : "ml-20"}
        `}
      >
        <div className="container mx-auto">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white p-6 flex items-center justify-between">
              <h1 className="text-3xl font-extrabold flex items-center">
                <Trophy className="mr-3" size={36} />
                Sports Event Dashboard
              </h1>
              <button
                onClick={() => navigate("/create-event")}
                className="flex items-center bg-white text-[#1A2980] px-4 py-2 rounded-full hover:bg-blue-50 transition transform hover:scale-105"
              >
                <PlusCircle className="mr-2" size={20} />
                Create New Event
              </button>
            </div>

            {/* Events Table */}
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-600">
                  <thead className="bg-blue-100 text-blue-800">
                    <tr>
                      <th className="px-4 py-3 text-left">Title</th>
                      <th className="px-4 py-3 text-left">Description</th>
                      <th className="px-4 py-3 text-left">
                        <Calendar className="inline mr-2" size={16} />
                        Start Date
                      </th>
                      <th className="px-4 py-3 text-left">
                        <MapPin className="inline mr-2" size={16} />
                        Location
                      </th>
                      <th className="px-4 py-3 text-left">
                        <DollarSign className="inline mr-2" size={16} />
                        Price
                      </th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">
                        <Users className="inline mr-2" size={16} />
                        Participants
                      </th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-blue-50 transition"
                      >
                        <td className="px-4 py-3 font-semibold">
                          {event.title}
                        </td>
                        <td className="px-4 py-3 truncate max-w-xs">
                          {event.description}
                        </td>
                        <td className="px-4 py-3">{event.startDate}</td>
                        <td className="px-4 py-3 flex items-center">
                          <MapPin className="mr-2 text-blue-500" size={16} />
                          {event.location}
                        </td>
                        <td className="px-4 py-3">${event.price}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`
                            px-2 py-1 rounded-full text-xs font-bold
                            ${
                              event.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }
                          `}
                          >
                            {event.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className="bg-[#1A2980] hover:bg-[#26D0CE] text-white font-bold py-2 px-4 rounded-full text-xs"
                            onClick={() =>
                              navigate(`/participantListe/${event._id}`)
                            }
                          >
                            View List
                          </button>
                        </td>
                        <td className="px-4 py-3 flex space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/updateEvent/${event._id}`)
                            }
                            className="text-blue-500 hover:bg-blue-100 p-2 rounded-full transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteEvent(event._id)}
                            className="text-red-500 hover:bg-red-100 p-2 rounded-full transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
