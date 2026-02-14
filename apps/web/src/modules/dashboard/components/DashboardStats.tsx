'use client';

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Total Sales</h3>
        <p className="text-2xl font-bold">$0.00</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Products</h3>
        <p className="text-2xl font-bold">0</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Forecasts</h3>
        <p className="text-2xl font-bold">0</p>
      </div>
    </div>
  );
}

