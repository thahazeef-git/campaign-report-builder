import React from "react";

const Filters = ({filters, handleFilterChange}) => {
    return (
        <div className="mb-6 pl-4 pr-4">
            <h3 className="text-xl font-semibold mb-2">Filters</h3>
            <form className="flex space-x-4">
                <select name="deviceType" value={filters.deviceType} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded w-[9rem] h-10">
                    <option value="">All Devices</option>
                    <option value="mobile">Mobile</option>
                    <option value="desktop">Desktop</option>
                </select>
                <input
                    type="text"
                    name="campaignName"
                    placeholder="Campaign Name"
                    value={filters.campaignName}
                    onChange={handleFilterChange}
                    className="p-2 border border-gray-300 rounded h-10 w-[9rem]"
                />
                <div className="flex space-x-4">
                    <input
                        type="text"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        placeholder="Start Date"
                        className="p-2 border border-gray-300 rounded w-[9rem] h-10"
                        onFocus={(e) => (e.target.type = 'date')}
                        onBlur={(e) => (e.target.type = 'text')}
                    />
                    <input
                        type="text"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        placeholder="End Date"
                        className="p-2 border border-gray-300 rounded w-[9rem] h-10"
                        onFocus={(e) => (e.target.type = 'date')}
                        onBlur={(e) => (e.target.type = 'text')}
                    />
                </div>
            </form>
        </div>
    )
};

export default Filters;