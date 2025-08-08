import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { FaTrash, FaPlus, FaTimes, FaEllipsisV, FaEdit, FaChevronDown, FaCheck, FaBan } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];



const DressManager = ({ tabId }) => {
  const [dresses, setDresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddDressModal, setShowAddDressModal] = useState(false);
  const [addDressLoading, setAddDressLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [newDress, setNewDress] = useState({
    category: "",
    subcategory: "",
    type: "",
    price: "",
    description: "",
    brand: "",
    originalPrice: "",
    sizes: sizeOptions.map((size) => ({ size, selected: true })),
    stockStatus: "",
  });
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [selectedDress, setSelectedDress] = useState(null);
  const [showDressModal, setShowDressModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  
  // Helper functions to get subcategories and types for a category
  const getSubcategoriesForCategory = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.subcategories || [] : [];
  };

  const getTypesForCategory = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.types || [] : [];
  };

  const getTypesForSubcategory = (categoryName, subcategoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (!category) return [];
    
    const subcategory = category.subcategories?.find(sub => sub.name === subcategoryName);
    return subcategory ? subcategory.types || [] : [];
  };

  // Edit functionality state variables
  const [showEditDressModal, setShowEditDressModal] = useState(false);
  const [editDressLoading, setEditDressLoading] = useState(false);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editingDress, setEditingDress] = useState(null);
  const [editDressData, setEditDressData] = useState({});
  
  // Hover dropdown state variables
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState("All");
  const [deletingDressId, setDeletingDressId] = useState(null);

  const fetchCategories = async () => {
    try {
      const token = sessionStorage.getItem("clienttoken");
      const response = await axios.get(`${API_BASE_URL}/dress/${tabId}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response);
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("clienttoken");
      const response = await axios.get(`${API_BASE_URL}/dress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("dresses",response)
      setDresses(response.data.dresses || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dress?")) return;
    setDeletingDressId(id);
    try {
      const token = sessionStorage.getItem("clienttoken");
      await axios.delete(`${API_BASE_URL}/dress/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Dress deleted successfully");
      setDresses((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setDeletingDressId(null);
    }
  };

  const handleDisable = async (id) => {
    setDeletingDressId(id);
    try {
      const token = sessionStorage.getItem("clienttoken");
      await axios.put(`${API_BASE_URL}/dress/${id}/disable`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Dress disabled successfully");
      setDresses((prev) => prev.map((d) => d._id === id ? { ...d, disabled: true } : d));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setDeletingDressId(null);
    }
  };

  const handleEnable = async (id) => {
    setDeletingDressId(id);
    try {
      const token = sessionStorage.getItem("clienttoken");
      await axios.put(`${API_BASE_URL}/dress/${id}/enable`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Dress enabled successfully");
      setDresses((prev) => prev.map((d) => d._id === id ? { ...d, disabled: false } : d));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setDeletingDressId(null);
    }
  };

  const handleSizeToggle = (sizeToToggle) => {
    setNewDress((prev) => ({
      ...prev,
      sizes: prev.sizes.map((size) =>
        size.size === sizeToToggle
          ? { ...size, selected: !size.selected }
          : size
      ),
    }));
  };

  const handleAddDress = async (e) => {
    e.preventDefault();
    setAddDressLoading(true);
    try {
      const token = sessionStorage.getItem("clienttoken");
      let imageKey = "";
      if (imageFile) {
        const uploadUrlRes = await axios.get(
          `${API_BASE_URL}/dress/upload-url`,
          {
            params: {
              fileName: imageFile.name,
              fileType: imageFile.type,
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (uploadUrlRes.data.success) {
          await fetch(uploadUrlRes.data.url, {
            method: "PUT",
            headers: {
              "Content-Type": imageFile.type,
            },
            body: imageFile,
          });
          imageKey = uploadUrlRes.data.key;
        } else {
          throw new Error("Failed to get S3 upload URL");
        }
      }
      const response = await axios.post(
        `${API_BASE_URL}/dress/add`,
        {
          ...newDress,
          price: newDress.price ? Number(newDress.price) : undefined,
          imageKey: imageKey || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("Dress added successfully!");
        setShowAddDressModal(false);
        setNewDress({
          category: "",
          subcategory: "",
          type: "",
          price: "",
          description: "",
          brand: "",
          originalPrice: "",
          sizes: sizeOptions.map((size) => ({ size, selected: true })),
          stockStatus: "",
        });
        setImageFile(null);
        fetchDresses();
      } else {
        toast.error(response.data.message || "Failed to add dress.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add dress.");
    } finally {
      setAddDressLoading(false);
    }
  };

  const handleCardClick = (dress) => {
    setSelectedDress(dress);
    setShowDressModal(true);
  };

  const closeDressModal = () => {
    setShowDressModal(false);
    setSelectedDress(null);
  };

  // Edit functionality functions
  const handleEditDress = (dress) => {
    setEditingDress(dress);
    setEditDressData({
      category: dress.category,
      subcategory: dress.subcategory || "",
      type: dress.type,
      price: dress.price || "",
      description: dress.description || "",
      brand: dress.brand || "",
      originalPrice: dress.originalPrice || "",
      sizes: dress.sizes ? dress.sizes.map(size => 
        typeof size === 'string' ? { size, selected: true } : size
      ) : sizeOptions.map(size => ({ size, selected: true })),
      stockStatus: dress.stockStatus || ""
      
    });
    setEditImageFile(null);
    setShowEditDressModal(true);
  };

  const handleEditSizeToggle = (sizeToToggle) => {
    setEditDressData(prev => ({
      ...prev,
      sizes: prev.sizes.map(size => 
        size.size === sizeToToggle 
          ? { ...size, selected: !size.selected }
          : size
      )
    }));
  };

  const handleUpdateDress = async (e) => {
    e.preventDefault();
    setEditDressLoading(true);
    try {
      const token = sessionStorage.getItem("clienttoken");
      let imageKey = editingDress.imageKey; // Keep existing key by default

      // If new image is selected
      if (editImageFile) {
        const uploadUrlRes = await axios.get(
          `${API_BASE_URL}/dress/upload-url`,
          {
            params: {
              fileName: editImageFile.name,
              fileType: editImageFile.type,
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (uploadUrlRes.data.success) {
          await fetch(uploadUrlRes.data.url, {
            method: "PUT",
            headers: {
              "Content-Type": editImageFile.type,
            },
            body: editImageFile,
          });
          imageKey = uploadUrlRes.data.key;
        } else {
          throw new Error("Failed to get S3 upload URL");
        }
      }

      const response = await axios.put(
        `${API_BASE_URL}/dress/${editingDress._id}`,
        {
          ...editDressData,
          price: editDressData.price ? Number(editDressData.price) : undefined,
          imageKey: imageKey,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Dress updated successfully!");
        setShowEditDressModal(false);
        setEditingDress(null);
        setEditDressData({});
        setEditImageFile(null);
        fetchDresses(); // Refresh the list
      } else {
        toast.error(response.data.message || "Failed to update dress.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update dress.");
    } finally {
      setEditDressLoading(false);
    }
  };

  // Filter dresses by selected category, subcategory, and type
  const filteredDresses = dresses.filter((d) => {
    const categoryMatch = selectedCategory === "All" || d.category === selectedCategory;
    const subcategoryMatch = selectedSubcategory === "All" || d.subcategory === selectedSubcategory;
    const typeMatch = selectedType === "All" || d.type === selectedType;
    return categoryMatch && subcategoryMatch && typeMatch;
  });

  const getDiscount = (price, originalPrice) => {
    if (!price || !originalPrice || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Helper function to get selected sizes for display
  const getSelectedSizes = (sizes) => {
    if (!sizes || sizes.length === 0) return [];

    // Handle both old format (array of strings) and new format (array of objects)
    if (typeof sizes[0] === "string") {
      return sizes;
    } else {
      return sizes.filter((size) => size.selected).map((size) => size.size);
    }
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("All"); // Reset subcategory when category changes
    setSelectedType("All"); // Reset type when category changes
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setSelectedType("All"); // Reset type when subcategory changes
  };

  // Handle type selection
  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  useEffect(() => {
    fetchCategories();
    fetchDresses();
  }, []);

  // Set default category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !newDress.category) {
      setNewDress(prev => ({ ...prev, category: categories[0].name }));
    }
  }, [categories]);

  return (
    <div>
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Dresses</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium shadow flex items-center"
          onClick={() => setShowAddDressModal(true)}
        >
          <FaPlus className="mr-2" /> Add Dress
        </button>
      </div>
      
      {/* Category Tabs with Hover Dropdown */}
      <div className="flex space-x-2 mb-6">
        {/* All option */}
        <div className="relative">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 flex items-center space-x-1 ${
              selectedCategory === "All"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
            }`}
            onClick={() => handleCategorySelect("All")}
          >
            <span>All</span>
          </button>
        </div>
        {/* Dynamic categories */}
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="relative"
            onMouseEnter={() => setHoveredCategory(cat.name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 flex items-center space-x-1 ${
                selectedCategory === cat.name
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
              }`}
              onClick={() => handleCategorySelect(cat.name)}
            >
              <span>{cat.name}</span>
              <FaChevronDown className="text-xs" />
            </button>
            
            {/* Hover Dropdown for Subcategories and Types */}
            {hoveredCategory === cat.name && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                <div className="p-3 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    {cat.name} Items
                  </h4>
                </div>
                <div className="py-2">
                  {/* All Types Option */}
                  <button
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      selectedType === "All" ? "bg-green-50 text-green-700 font-medium" : "text-gray-700"
                    }`}
                    onClick={() => handleTypeSelect("All")}
                  >
                    All Types
                  </button>
                  
                  {/* Category Types */}
                  {getTypesForCategory(cat.name).map((type) => (
                    <button
                      key={type.id}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        selectedType === type.name ? "bg-green-50 text-green-700 font-medium" : "text-gray-700"
                      }`}
                      onClick={() => handleTypeSelect(type.name)}
                    >
                      {type.name}
                    </button>
                  ))}
                  
                  {/* Subcategories */}
                  {getSubcategoriesForCategory(cat.name).map((subcategory) => (
                    <div key={subcategory.id}>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-t border-gray-100 mt-2 pt-2">
                        {subcategory.name}
                      </div>
                      {subcategory.types?.map((type) => (
                        <button
                          key={type.id}
                          className={`w-full text-left px-6 py-2 text-sm hover:bg-gray-50 transition-colors ${
                            selectedType === type.name ? "bg-green-50 text-green-700 font-medium" : "text-gray-700"
                          }`}
                          onClick={() => handleTypeSelect(type.name)}
                        >
                          {type.name}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Filters Display */}
      {(selectedCategory !== "All" || selectedSubcategory !== "All" || selectedType !== "All") && (
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm text-gray-600">Filters:</span>
          {selectedCategory !== "All" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {selectedCategory}
              <button
                className="ml-2 text-green-600 hover:text-green-800"
                onClick={() => handleCategorySelect("All")}
              >
                <FaTimes size={10} />
              </button>
            </span>
          )}
          {selectedSubcategory !== "All" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {selectedSubcategory}
              <button
                className="ml-2 text-blue-600 hover:text-blue-800"
                onClick={() => handleSubcategorySelect("All")}
              >
                <FaTimes size={10} />
              </button>
            </span>
          )}
          {selectedType !== "All" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {selectedType}
              <button
                className="ml-2 text-purple-600 hover:text-purple-800"
                onClick={() => handleTypeSelect("All")}
              >
                <FaTimes size={10} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Add Dress Modal */}
      {showAddDressModal && (
        <div className="fixed w-full h-screen inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-2xl relative flex flex-col md:flex-row overflow-hidden">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
              onClick={() => setShowAddDressModal(false)}
            >
              <FaTimes size={22} />
            </button>
            {/* Image upload/preview section */}
            <div className="md:w-1/2 w-full bg-gray-50 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="mb-4 w-full flex flex-col items-center">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image
                </label>
                <div className="w-40 h-40 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                  {imageFile ? (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">
                      No image selected
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-xs"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  required
                />
              </div>
              <p className="text-xs text-gray-400 text-center">
                Supported: JPG, PNG, etc. Max 5MB.
              </p>
            </div>
            {/* Form fields section */}
            <div className="md:w-1/2 w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Add New Dress
              </h3>
              <form onSubmit={handleAddDress} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                    value={newDress.brand}
                    onChange={(e) =>
                      setNewDress({ ...newDress, brand: e.target.value })
                    }
                    placeholder="e.g. HIPOP"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Category
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                      value={newDress.category}
                      onChange={(e) => {
                        setNewDress({ 
                          ...newDress, 
                          category: e.target.value,
                          subcategory: "", // Reset subcategory when category changes
                          type: "" // Reset type when category changes
                        });
                      }}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Subcategory
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                      value={newDress.subcategory}
                      onChange={(e) => {
                        setNewDress({ 
                          ...newDress, 
                          subcategory: e.target.value,
                          type: "" // Reset type when subcategory changes
                        });
                      }}
                    >
                      <option value="">Select Subcategory</option>
                      {getSubcategoriesForCategory(newDress.category).map((subcat) => (
                        <option key={subcat.id} value={subcat.name}>
                          {subcat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Type
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                    value={newDress.type}
                    onChange={(e) =>
                      setNewDress({ ...newDress, type: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Type</option>
                    {/* Category Types */}
                    {getTypesForCategory(newDress.category).map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                    {/* Subcategory Types */}
                    {newDress.subcategory && getTypesForSubcategory(newDress.category, newDress.subcategory).map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                      value={newDress.price}
                      onChange={(e) =>
                        setNewDress({ ...newDress, price: e.target.value })
                      }
                      min="0"
                      placeholder="e.g. 336"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                      value={newDress.originalPrice}
                      onChange={(e) =>
                        setNewDress({
                          ...newDress,
                          originalPrice: e.target.value,
                        })
                      }
                      min="0"
                      placeholder="e.g. 1499"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Sizes
                  </label>
                  <div className="grid grid-cols-3 gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
                    {newDress.sizes.map((sizeObj) => (
                      <label
                        key={sizeObj.size}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={sizeObj.selected}
                          onChange={() => handleSizeToggle(sizeObj.size)}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {sizeObj.size}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Stock Status
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                    value={newDress.stockStatus}
                    onChange={(e) =>
                      setNewDress({ ...newDress, stockStatus: e.target.value })
                    }
                    placeholder="Only few left"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                    value={newDress.description}
                    onChange={(e) =>
                      setNewDress({ ...newDress, description: e.target.value })
                    }
                    rows={2}
                    placeholder="e.g. Women Printed Round Neck Pure Cotton White T-Shirt"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold mt-2 shadow-lg transition"
                  disabled={addDressLoading}
                >
                  {addDressLoading ? "Adding..." : "Add Dress"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 mb-4">{error}</div>
      ) : filteredDresses.length === 0 ? (
        <div className="text-gray-500">No dresses found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredDresses.map((dress) => {
            const discount = getDiscount(dress.price, dress.originalPrice);
            const selectedSizes = getSelectedSizes(dress.sizes);
            return (
              <div
                key={dress._id}
                className={`relative bg-white rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 cursor-pointer group border border-gray-100 overflow-hidden ${deletingDressId === dress._id || dress.disabled ? 'grayscale' : ''}`}
                onClick={() => handleCardClick(dress)}
              >
                {/* 3-dot menu - always visible */}
                <div
                  className="absolute top-3 right-3 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === dress._id ? null : dress._id);
                  }}
                >
                  <button className="p-1 rounded-full hover:bg-gray-100 focus:outline-none">
                    <FaEllipsisV />
                  </button>
                  {menuOpenId === dress._id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-20">
                      <button
                        className="flex items-center px-4 py-2 text-blue-600 hover:bg-gray-100 w-full"
                        onClick={() => {
                          setMenuOpenId(null);
                          handleEditDress(dress);
                        }}
                        disabled={dress.disabled}
                      >
                        <FaEdit className="mr-2" /> Edit
                      </button>
                      {dress.disabled ? (
                        <button
                          className="flex items-center px-4 py-2 text-green-600 hover:bg-gray-100 w-full"
                          onClick={() => {
                            setMenuOpenId(null);
                            handleEnable(dress._id);
                          }}
                          disabled={deletingDressId === dress._id}
                        >
                          <FaCheck className="mr-2" /> Enable
                        </button>
                      ) : (
                        <button
                          className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 w-full"
                          onClick={() => {
                            setMenuOpenId(null);
                            handleDisable(dress._id);
                          }}
                          disabled={deletingDressId === dress._id}
                        >
                          <FaBan className="mr-2" /> Disable
                        </button>
                      )}
                      <button
                        className="flex items-center px-4 py-2 text-red-700 hover:bg-gray-100 w-full border-t border-gray-100"
                        onClick={() => {
                          setMenuOpenId(null);
                          handleDelete(dress._id);
                        }}
                        disabled={deletingDressId === dress._id}
                      >
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </div>
                  )}
                </div>
                {/* Image */}
                <div className="w-full h-48 bg-gray-50 flex items-center justify-center rounded-t-2xl overflow-hidden relative">
                  <img
                    src={dress.imageUrl}
                    alt={dress.type}
                    className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  {discount && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                {/* Details */}
                <div className="p-5 flex flex-col gap-2">
                  {dress.brand && (
                    <div className="font-bold text-green-700 text-base mb-0.5 tracking-wide">
                      {dress.brand}
                    </div>
                  )}
                  <div className="font-semibold text-lg capitalize mb-0.5 text-gray-800">
                    {dress.type}
                  </div>
                  <div className="text-sm text-gray-500 capitalize mb-1 line-clamp-2 min-h-[2.5em]">
                    {dress.description}
                  </div>
                  <div className="flex items-center space-x-2 mb-1">
                    {dress.price && (
                      <span className="text-green-700 font-bold text-base">
                        ₹{dress.price}
                      </span>
                    )}
                    {dress.originalPrice &&
                      dress.originalPrice > dress.price && (
                        <span className="text-gray-400 line-through text-sm">
                          ₹{dress.originalPrice}
                        </span>
                      )}
                  </div>
                  {dress.stockStatus && (
                    <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full mb-1">
                      {dress.stockStatus}
                    </span>
                  )}
                  {selectedSizes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedSizes.map((size, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-gray-200 border border-gray-300 rounded-full text-xs font-medium text-gray-700 shadow-sm"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Dress Details Modal */}
      {showDressModal && selectedDress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row w-full max-w-3xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeDressModal}
            >
              <FaTimes size={24} />
            </button>
            {/* Image on left */}
            <div className="md:w-1/2 w-full flex items-center justify-center p-4">
              <img
                src={selectedDress.imageUrl}
                alt={selectedDress.type}
                className="object-contain max-h-[70vh] w-full rounded"
                style={{ maxHeight: "70vh" }}
              />
            </div>
            {/* Details on right */}
            <div className="md:w-1/2 w-full p-6 flex flex-col justify-center">
              {selectedDress.brand && (
                <div className="text-2xl font-bold mb-2 text-gray-800">
                  {selectedDress.brand}
                </div>
              )}
              <div className="text-xl font-semibold mb-2 capitalize">
                {selectedDress.type}
              </div>
              <div className="text-gray-600 mb-2 capitalize">
                {selectedDress.category}
              </div>
              <div className="mb-2 text-gray-700">
                {selectedDress.description}
              </div>
              <div className="flex items-center space-x-2 mb-2">
                {selectedDress.price && (
                  <span className="text-green-700 font-bold text-lg">
                    ₹{selectedDress.price}
                  </span>
                )}
                {selectedDress.originalPrice &&
                  selectedDress.originalPrice > selectedDress.price && (
                    <span className="text-gray-400 line-through">
                      ₹{selectedDress.originalPrice}
                    </span>
                  )}
                {getDiscount(
                  selectedDress.price,
                  selectedDress.originalPrice
                ) && (
                  <span className="text-red-600 font-semibold">
                    {getDiscount(
                      selectedDress.price,
                      selectedDress.originalPrice
                    )}
                    % off
                  </span>
                )}
              </div>
              {selectedDress.stockStatus && (
                <div className="text-orange-600 mb-2">
                  {selectedDress.stockStatus}
                </div>
              )}
              {getSelectedSizes(selectedDress.sizes).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {getSelectedSizes(selectedDress.sizes).map((size, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 border rounded text-sm font-medium text-gray-700"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Edit Dress Modal */}
      {showEditDressModal && editingDress && (
        <div className="fixed w-full h-full inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-2xl relative flex flex-col md:flex-row overflow-hidden">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
              onClick={() => setShowEditDressModal(false)}
            >
              <FaTimes size={22} />
            </button>
            {/* Image upload/preview section */}
            <div className="md:w-1/2 w-full bg-gray-50 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="mb-4 w-full flex flex-col items-center">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image
                </label>
                <div className="w-40 h-40 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                  {editImageFile ? (
                    <img
                      src={URL.createObjectURL(editImageFile)}
                      alt="Preview"
                      className="object-contain w-full h-full"
                    />
                  ) : editingDress.imageUrl ? (
                    <img
                      src={editingDress.imageUrl}
                      alt="Current"
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No image</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-xs"
                  onChange={(e) => setEditImageFile(e.target.files[0])}
                />
                <p className="text-xs text-gray-400 text-center mt-2">
                  Leave empty to keep current image
                </p>
              </div>
            </div>
            {/* Form fields section */}
            <div className="md:w-1/2 w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Dress</h3>
              <form onSubmit={handleUpdateDress} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                    value={editDressData.brand}
                    onChange={(e) =>
                      setEditDressData({ ...editDressData, brand: e.target.value })
                    }
                    placeholder="e.g. HIPOP"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Category
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                      value={editDressData.category}
                      onChange={(e) => {
                        setEditDressData({ 
                          ...editDressData, 
                          category: e.target.value,
                          subcategory: "", // Reset subcategory when category changes
                          type: "" // Reset type when category changes
                        });
                      }}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Subcategory
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                      value={editDressData.subcategory}
                      onChange={(e) => {
                        setEditDressData({ 
                          ...editDressData, 
                          subcategory: e.target.value,
                          type: "" // Reset type when subcategory changes
                        });
                      }}
                    >
                      <option value="">Select Subcategory</option>
                      {getSubcategoriesForCategory(editDressData.category).map((subcat) => (
                        <option key={subcat.id} value={subcat.name}>
                          {subcat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Type
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                    value={editDressData.type}
                    onChange={(e) =>
                      setEditDressData({ ...editDressData, type: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Type</option>
                    {/* Category Types */}
                    {getTypesForCategory(editDressData.category).map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                    {/* Subcategory Types */}
                    {editDressData.subcategory && getTypesForSubcategory(editDressData.category, editDressData.subcategory).map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                      value={editDressData.price}
                      onChange={(e) =>
                        setEditDressData({ ...editDressData, price: e.target.value })
                      }
                      min="0"
                      placeholder="e.g. 336"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                      value={editDressData.originalPrice}
                      onChange={(e) =>
                        setEditDressData({
                          ...editDressData,
                          originalPrice: e.target.value,
                        })
                      }
                      min="0"
                      placeholder="e.g. 1499"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Sizes
                  </label>
                  <div className="grid grid-cols-3 gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
                    {editDressData.sizes.map((sizeObj) => (
                      <label
                        key={sizeObj.size}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={sizeObj.selected}
                          onChange={() => handleEditSizeToggle(sizeObj.size)}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {sizeObj.size}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Stock Status
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                    value={editDressData.stockStatus}
                    onChange={(e) =>
                      setEditDressData({ ...editDressData, stockStatus: e.target.value })
                    }
                    placeholder="Only few left"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                    value={editDressData.description}
                    onChange={(e) =>
                      setEditDressData({ ...editDressData, description: e.target.value })
                    }
                    rows={2}
                    placeholder="e.g. Women Printed Round Neck Pure Cotton White T-Shirt"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold mt-2 shadow-lg transition"
                  disabled={editDressLoading}
                >
                  {editDressLoading ? "Updating..." : "Update Dress"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DressManager;
