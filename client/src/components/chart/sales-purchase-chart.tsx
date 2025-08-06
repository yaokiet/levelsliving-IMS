import React from "react";

export function SalesPurchaseChart() {
  const barData = [
    { label: "Jan", height: 190, color: "bg-blue-500" },
    { label: "Feb", height: 170, color: "bg-green-500" },
    { label: "Mar", height: 160, color: "bg-blue-500" },
    { label: "Apr", height: 185, color: "bg-green-500" },
    { label: "May", height: 190, color: "bg-blue-500" },
    { label: "Jun", height: 32, color: "bg-green-500" },
  ];

  return (
    <div className="bg-background rounded-lg border p-6 w-full max-w-4xl">
      <h2 className="text-lg font-semibold mb-4 text-center">Sales & Purchase</h2>
      <div className="flex items-end h-72 gap-2">
        {barData.map((bar, index) => (
          <div key={index} className="flex flex-col items-center flex-grow">
            <div className={`${bar.color} w-8`} style={{ height: `${bar.height}px` }}></div>
            <span className="text-sm mt-2">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
