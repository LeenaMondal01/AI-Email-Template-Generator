import React from "react";

const ElementLayoutCard = ({ layout }) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center border border-dashed rounded-xl p-3 group hover:shadow-md hover:border-primary cursor-pointer">
        {
          <layout.icon className="p-2 h-9 w-9 bg-gray-100 group-hover:text-primary group-hover:bg-purple-100 rounded-full" />
        }
        <h2 className="text-sm group-hover:text-primary">{layout.label}</h2>
      </div>
    </div>
  );
};

export default ElementLayoutCard;
