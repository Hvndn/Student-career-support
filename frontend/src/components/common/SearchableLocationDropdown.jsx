import React, { useState, useEffect, useRef } from 'react';
import { vietnamLocations, findProvinceFuzzy } from '../../utils/vietnamLocations';
import '../../assets/css/common/SearchableDropdown.css';

const SearchableLocationDropdown = ({ onLocationSelect, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProvinces(vietnamLocations);
    } else {
      setFilteredProvinces(findProvinceFuzzy(searchTerm));
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProvinceSelect = (province) => {
    setSelectedProvince(province);
    setSearchTerm(province.name);
    setIsOpen(false);
    onLocationSelect(province.name);
  };

  const handleDistrictSelect = (districtName) => {
    setSelectedDistrict(districtName);
    const fullLocation = `${districtName}, ${selectedProvince.name}`;
    setSearchTerm(fullLocation);
    onLocationSelect(fullLocation);
  };

  return (
    <div className="searchable-dropdown" ref={dropdownRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          className="filter-search-input"
          placeholder="Tìm tỉnh thành (vd: nghe -> Nghệ An)..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            if (e.target.value === '') {
                onLocationSelect('');
                setSelectedProvince(null);
            }
          }}
          onFocus={() => setIsOpen(true)}
        />
        {searchTerm && (
          <button className="clear-btn" onClick={() => {
            setSearchTerm('');
            setSelectedProvince(null);
            onLocationSelect('');
          }}>×</button>
        )}
      </div>

      {isOpen && (
        <div className="dropdown-menu-list">
          {filteredProvinces.length > 0 ? (
            filteredProvinces.map((province) => (
              <div
                key={province.id}
                className="dropdown-item province-item"
                onClick={() => handleProvinceSelect(province)}
              >
                <span className="item-icon">📍</span>
                {province.name}
              </div>
            ))
          ) : (
            <div className="dropdown-no-results">Không tìm thấy tỉnh thành nào</div>
          )}
        </div>
      )}

      {selectedProvince && selectedProvince.wards && (
        <div className="subunit-selector">
          <label>Chọn Xã/Phường tại {selectedProvince.name}:</label>
          <div className="district-chips">
            {selectedProvince.wards.map(ward => (
              <button
                key={ward.id}
                className={`district-chip ${selectedDistrict === ward.name ? 'active' : ''}`}
                onClick={() => handleDistrictSelect(ward.name)}
              >
                {ward.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableLocationDropdown;
