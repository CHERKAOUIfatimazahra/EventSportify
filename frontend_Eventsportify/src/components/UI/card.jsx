import React from "react";

export const Card = ({ children, className }) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }) => {
  return (
    <div
      className={`px-4 py-3 border-b border-gray-200 bg-gray-50 ${className}`}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className }) => {
  return (
    <h3 className={`text-lg font-medium text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

export const CardContent = ({ children, className }) => {
  return <div className={`px-4 py-4 ${className}`}>{children}</div>;
};
