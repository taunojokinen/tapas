import React from "react";

interface SelectionListProps {
  title: string;
  items: any[];
  toggleSelection: (id: string) => void;
}

const SelectionList: React.FC<SelectionListProps> = ({ title, items, toggleSelection }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <ul className="border p-2 rounded-lg bg-gray-100">
        {items.map((item) => (
          <li key={item._id} className="flex items-center space-x-2 p-1">
            <input type="checkbox" checked={item.selected} onChange={() => toggleSelection(item._id)} />
            <span>{item.name || item.nimi}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectionList;
