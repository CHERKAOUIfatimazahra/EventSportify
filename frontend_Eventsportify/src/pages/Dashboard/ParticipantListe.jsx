import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Users,
  Settings,
  Home,
  Trophy,
  BarChart2,
  LogOut,
  Menu,
  Download,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function ParticipantListe() {
  const [participants, setParticipant] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [deleteParticipant, setDeleteParticipant] = useState(null);

  // Fetch participant of event
  useEffect(() => {
    const fetchParticipantData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/participants/event/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setParticipant(response.data.participants);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch event details.");
        setLoading(false);
      }
    };

    fetchParticipantData();
  }, [eventId]);

  // delete participant
  const handleDeleteParticipant = async (id) => {
    // confirm delete
    if (window.confirm("Are you sure you want to delete this participant?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/participants/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data: { eventId: eventId },
          }
        );
        setParticipant(
          participants.filter((participant) => participant._id !== id)
        );
        toast.success("Participant deleted successfully.");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete participant.");
      }
    }
  };

  useEffect(() => {
    if (deleteParticipant) {
      handleDeleteParticipant(deleteParticipant);
    }
  }, [deleteParticipant]);

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

  // Generate PDF
    const generatePDF = () => {
      const doc = new jsPDF();

      // En-tête
      doc.setFontSize(20);
      doc.text("Liste des participants", 14, 15);
      doc.setFontSize(12);

      // Tableau
      const tableColumn = ["Nom", "Email", "Téléphone"];
      const tableRows = participants.map((participant) => [
        participant.name,
        participant.email,
        participant.phoneNumber,
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 25,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [26, 41, 128] },
      });

      doc.save("liste-participants.pdf");
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
                <Users className="mr-3" size={36} />
                Sports Event Participants
              </h1>
              <button
                onClick={() => { generatePDF() }}
              className="flex items-center bg-white text-[#1A2980] px-4 py-2 rounded-full hover:bg-blue-50 transition transform hover:scale-105"
              >
                <Download size={24} className="mr-4" />
                Download PDF
              </button>
              <button
                onClick={() => navigate(`/create-participant/${eventId}`)}
                className="flex items-center bg-white text-[#1A2980] px-4 py-2 rounded-full hover:bg-blue-50 transition transform hover:scale-105"
              >
                <PlusCircle className="mr-2" size={20} />
                Create New Participant
              </button>
            </div>

            {/* Participants Table */}
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-600">
                  <thead className="bg-blue-100 text-blue-800">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-blue-50 transition"
                      >
                        <td className="px-4 py-3 font-semibold">
                          {participant.name}
                        </td>
                        <td className="px-4 py-3 truncate max-w-xs">
                          {participant.email}
                        </td>
                        <td className="px-4 py-3">{participant.phoneNumber}</td>

                        <td className="px-4 py-3 flex justify-center space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/updateParticipant/${participant._id}`)
                            }
                            className="text-blue-500 hover:bg-blue-100 p-2 rounded-full transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteParticipant(participant._id)
                            }
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

export default ParticipantListe;
