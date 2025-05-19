import Image from "next/image";
import React from "react";

// components/CategoryItem.tsx
function CategoryItem({
  category,
}: {
  category: { id: number; name: string; icon: string | null };
}) {
  return (
    <div className="flex flex-col items-center p-4 border rounded-lg">
      {category.icon && (
        <div className="w-16 h-16 mb-2">
          {/* Render SVG from public folder */}
          <Image
            src={category.icon}
            alt={category.name}
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <h3 className="font-bold text-center">{category.name}</h3>
    </div>
  );
}

export default CategoryItem;
