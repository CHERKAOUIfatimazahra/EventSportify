import React, { useState, useEffect } from "react";
import {
  PencilIcon,
  FileText,
  Phone,
  AtSign,
  Home,
  Trophy,
  Users,
  Settings,
  BarChart2,
  LogOut,
  Menu,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UpdateParticipant() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { participantId } = useParams();

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
        className={`fixed left-0 top-0 h-full ${sidebarOpen ? "w-64" : "w-20"} 
        bg-gradient-to-b from-[#1A2980] to-[#26D0CE] text-white transition-all duration-300 ease-in-out shadow-2xl z-50`}
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
              className="w-full flex items-center p-4 hover:bg-blue-700/30 transition-colors duration-200"
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
            className="w-full flex items-center p-4 hover:bg-red-500/30 border-t border-blue-700"
          >
            <LogOut size={24} className="mr-4" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchParticipantData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/participants/${participantId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFormData(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch participant details.");
      }
    };
    fetchParticipantData();
  }, [participantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.put(
          `http://localhost:5000/participants/update/${participantId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Participant updated successfully!");
        navigate(-1);
      } catch (error) {
        console.error(error.response?.data || error.message);
        toast.error("Failed to update participant.");
      }
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <Sidebar />
      <div
        className={`flex-grow p-6 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white p-6 flex items-center">
              <PencilIcon className="mr-3" size={36} />
              <h1 className="text-2xl font-extrabold">Update Participant</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="mr-2 text-[#1A2980]" size={16} />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                    ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#1A2980]"
                    }`}
                  placeholder="Enter participant name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <AtSign className="mr-2 text-[#1A2980]" size={16} />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                    ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#1A2980]"
                    }`}
                  placeholder="Enter participant email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="mr-2 text-[#1A2980]" size={16} />
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                    ${
                      errors.phoneNumber
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#1A2980]"
                    }`}
                  placeholder="Enter phone number"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#1A2980] text-white py-3 rounded-lg hover:bg-[#26D0CE] transition transform hover:scale-[1.01] flex items-center justify-center"
                >
                  <PencilIcon className="mr-2" size={20} />
                  Update Participant
                </button>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default UpdateParticipant;
