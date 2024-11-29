import React, { useState } from "react";
import {
  PlusCircle,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  FileText,
  Home,
  Trophy,
  Settings,
  BarChart2,
  LogOut,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateEvent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    price: "",
    ticketsNumber: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation logic remains the same as in the original component
    if (!formData.title.trim()) {
      newErrors.title = "Event title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end < start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.ticketsNumber.trim()) {
      newErrors.ticketsNumber = "Number of tickets is required";
    } else if (
      isNaN(Number(formData.ticketsNumber)) ||
      !Number.isInteger(Number(formData.ticketsNumber)) ||
      Number(formData.ticketsNumber) <= 0
    ) {
      newErrors.ticketsNumber = "Tickets must be a positive whole number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await axios.post("http://localhost:5000/events/create", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        toast.success("Event created successfully!");
        navigate("/dashboard");
      } catch (error) {
        console.error(error.response?.data || error.message);
        toast.error("Failed to create event.");
      }
    } else {
      console.log("Form has errors");
    }
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
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#1A2980] to-[#26D0CE] text-white p-6 flex items-center">
              <PlusCircle className="mr-3" size={36} />
              <h1 className="text-2xl font-extrabold">Create Sports Event</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title Input */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="mr-2 text-[#1A2980]" size={16} />
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                    ${
                      errors.title
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#1A2980]"
                    }`}
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              {/* Description Input */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="mr-2 text-[#1A2980]" size={16} />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 h-24
                    ${
                      errors.description
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#1A2980]"
                    }`}
                  placeholder="Describe your event"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="mr-2 text-[#1A2980]" size={16} />
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2
                      ${
                        errors.startDate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-[#1A2980]"
                      }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="mr-2 text-[#1A2980]" size={16} />
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2
                      ${
                        errors.endDate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-[#1A2980]"
                      }`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Location Input */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="mr-2 text-[#1A2980]" size={16} />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2
                    ${
                      errors.location
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#1A2980]"
                    }`}
                  placeholder="Enter event location"
                />
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                )}
              </div>

              {/* Price and Tickets */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="mr-2 text-[#1A2980]" size={16} />
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2
                      ${
                        errors.price
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-[#1A2980]"
                      }`}
                    placeholder="Event ticket price"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                  )}
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Users className="mr-2 text-[#1A2980]" size={16} />
                    Number of Tickets
                  </label>
                  <input
                    type="number"
                    name="ticketsNumber"
                    value={formData.ticketsNumber}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2
                      ${
                        errors.ticketsNumber
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-[#1A2980]"
                      }`}
                    placeholder="Total tickets available"
                  />
                  {errors.ticketsNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.ticketsNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#1A2980] text-white py-3 rounded-lg hover:bg-[#26D0CE] transition transform hover:scale-[1.01] flex items-center justify-center"
                >
                  <PlusCircle className="mr-2" size={20} />
                  Create Event
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

export default CreateEvent;
